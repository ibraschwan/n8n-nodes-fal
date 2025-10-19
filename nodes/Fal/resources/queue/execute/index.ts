import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type {
	QueueSubmitParams,
	QueueStatusParams,
	QueueResponseParams,
	QueueCancelParams,
	QueueStreamStatusParams,
	QueueSubmitResponse,
	QueueStatusResponse,
	QueueResponseData,
	QueueCancelResponse,
} from '../models';
import { QueueOperation } from '../models';

export async function executeQueue(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as QueueOperation;

	switch (operation) {
		case QueueOperation.Submit:
			return await submitRequest.call(this, index);
		case QueueOperation.GetStatus:
			return await getStatus.call(this, index);
		case QueueOperation.GetResponse:
			return await getResponse.call(this, index);
		case QueueOperation.Cancel:
			return await cancelRequest.call(this, index);
		case QueueOperation.StreamStatus:
			return await streamStatus.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
	}
}

async function submitRequest(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const params = this.getNodeParameter('', index) as QueueSubmitParams;
	const options = params.options || {};

	let inputParameters: Record<string, any>;
	try {
		inputParameters = JSON.parse(params.inputParameters);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(
			this.getNode(),
			`Invalid input parameters JSON: ${errorMessage}`,
		);
	}

	try {
		let url = `/${params.modelEndpoint}`;

		// Add webhook URL as query parameter if provided
		if (options.webhookUrl) {
			url += `?fal_webhook=${encodeURIComponent(options.webhookUrl)}`;
		}

		const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
			method: 'POST',
			url,
			body: inputParameters,
			json: true,
		})) as QueueSubmitResponse;

		return [
			{
				json: {
					request_id: response.request_id,
					response_url: response.response_url,
					status_url: response.status_url,
					cancel_url: response.cancel_url,
					...(options.webhookUrl && {
						webhook_url: options.webhookUrl,
						message: 'Request queued. Results will be sent to the webhook URL.',
					}),
				},
			},
		];
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to submit request: ${errorMessage}`);
	}
}

async function getStatus(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const params = this.getNodeParameter('', index) as QueueStatusParams;
	const options = params.options || {};

	try {
		let url = `/${params.modelEndpoint}/requests/${params.requestId}/status`;

		// Add logs parameter if requested
		if (options.includeLogs) {
			url += '?logs=1';
		}

		const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
			method: 'GET',
			url,
			json: true,
		})) as QueueStatusResponse;

		return [
			{
				json: response as unknown as IDataObject,
			},
		];
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to get status: ${errorMessage}`);
	}
}

async function getResponse(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const params = this.getNodeParameter('', index) as QueueResponseParams;

	try {
		const url = `/${params.modelEndpoint}/requests/${params.requestId}`;

		const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
			method: 'GET',
			url,
			json: true,
		})) as QueueResponseData;

		return [
			{
				json: {
					status: response.status,
					...(response.logs && { logs: response.logs }),
					response: response.response,
				},
			},
		];
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to get response: ${errorMessage}`);
	}
}

async function cancelRequest(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const params = this.getNodeParameter('', index) as QueueCancelParams;

	try {
		const url = `/${params.modelEndpoint}/requests/${params.requestId}/cancel`;

		const response = (await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
			method: 'PUT',
			url,
			json: true,
		})) as QueueCancelResponse;

		return [
			{
				json: {
					status: response.status,
					message:
						response.status === 'CANCELLATION_REQUESTED'
							? 'Cancellation requested successfully. Note that the request may still be executed if it was very late in the queue process.'
							: 'Request has already been completed and cannot be cancelled.',
				},
			},
		];
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to cancel request: ${errorMessage}`);
	}
}

async function streamStatus(this: IExecuteFunctions, index: number): Promise<INodeExecutionData[]> {
	const params = this.getNodeParameter('', index) as QueueStreamStatusParams;
	const options = params.options || {};

	try {
		let url = `https://queue.fal.run/${params.modelEndpoint}/requests/${params.requestId}/status/stream`;

		// Add logs parameter if requested
		if (options.includeLogs) {
			url += '?logs=1';
		}

		const credentials = await this.getCredentials('falApi');

		// Use fetch to handle Server-Sent Events
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				Authorization: `Key ${credentials.apiKey}`,
				Accept: 'text/event-stream',
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new NodeOperationError(
				this.getNode(),
				`Failed to stream status: ${response.status} ${errorText}`,
			);
		}

		const statusUpdates: QueueStatusResponse[] = [];
		let finalStatus: QueueStatusResponse | null = null;

		// Parse Server-Sent Events
		const reader = response.body?.getReader();
		const decoder = new TextDecoder();

		if (!reader) {
			throw new NodeOperationError(this.getNode(), 'Failed to read response stream');
		}

		let buffer = '';

		while (true) {
			const { done, value } = await reader.read();

			if (done) {
				break;
			}

			buffer += decoder.decode(value, { stream: true });
			const lines = buffer.split('\n');

			// Keep the last incomplete line in the buffer
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (line.startsWith('data: ')) {
					const data = line.substring(6);
					if (data.trim()) {
						try {
							const statusUpdate = JSON.parse(data) as QueueStatusResponse;
							statusUpdates.push(statusUpdate);

							if (statusUpdate.status === 'COMPLETED') {
								finalStatus = statusUpdate;
							}
						} catch (parseError) {
							// Ignore parse errors for ping messages or malformed data
						}
					}
				}
			}

			// Break if we've received the final status
			if (finalStatus) {
				break;
			}
		}

		return [
			{
				json: {
					final_status: finalStatus || statusUpdates[statusUpdates.length - 1],
					status_updates: statusUpdates,
					total_updates: statusUpdates.length,
				},
			},
		];
	} catch (error) {
		if (error instanceof NodeOperationError) {
			throw error;
		}
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Failed to stream status: ${errorMessage}`);
	}
}
