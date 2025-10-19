import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import type {
	WorkflowExecuteCustomParams,
	WorkflowExecutePrebuiltParams,
	WorkflowDefinition,
} from '../models';
import { WorkflowOperation } from '../models';
import { pollQueue } from '../../../utils/poll-queue.util';
import { QueueSubmitResponse } from '../../../interfaces';

export async function executeWorkflow(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as WorkflowOperation;

	switch (operation) {
		case WorkflowOperation.ExecuteCustom:
			return await executeCustomWorkflow.call(this, index);
		case WorkflowOperation.ExecutePrebuilt:
			return await executePrebuiltWorkflow.call(this, index);
		default:
			throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
	}
}

async function executeCustomWorkflow(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const params = this.getNodeParameter('', index) as WorkflowExecuteCustomParams;
	const options = params.options || {};

	let workflowDefinition: WorkflowDefinition;
	try {
		workflowDefinition = JSON.parse(params.workflowDefinition);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(
			this.getNode(),
			`Invalid workflow definition JSON: ${errorMessage}`,
		);
	}

	let workflowInput: Record<string, any>;
	try {
		workflowInput = JSON.parse(params.workflowInput);
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(
			this.getNode(),
			`Invalid workflow input JSON: ${errorMessage}`,
		);
	}

	const body = {
		input: workflowInput,
		workflow: workflowDefinition,
	};

	return await executeWorkflowRequest.call(this, 'workflows/execute', body, options);
}

async function executePrebuiltWorkflow(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData[]> {
	const params = this.getNodeParameter('', index) as WorkflowExecutePrebuiltParams;
	const options = params.options || {};

	const body: Record<string, any> = {};

	if (params.parameters?.parameter) {
		for (const param of params.parameters.parameter) {
			if (param.name) {
				try {
					body[param.name] = JSON.parse(param.value);
				} catch {
					body[param.name] = param.value;
				}
			}
		}
	}

	return await executeWorkflowRequest.call(this, params.workflowEndpoint, body, options);
}

async function executeWorkflowRequest(
	this: IExecuteFunctions,
	endpoint: string,
	body: Record<string, any>,
	options: {
		includeIntermediateResults?: boolean;
		webhookUrl?: string;
		timeout?: number;
	},
): Promise<INodeExecutionData[]> {
	// If webhook URL is provided, use webhook mode
	if (options.webhookUrl) {
		return await executeWorkflowWithWebhook.call(this, endpoint, body, options.webhookUrl);
	}

	try {
		// Submit to queue
		const queueResponse = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'falApi',
			{
				method: 'POST',
				url: `/${endpoint}`,
				body,
				json: true,
			},
		)) as QueueSubmitResponse;

		const requestId = queueResponse.request_id;
		const responseUrl = queueResponse.response_url;

		// Poll for result
		const result = (await pollQueue.call(this, requestId, responseUrl)) as IDataObject;

		return [
			{
				json: result,
			},
		];
	} catch (error) {
		if (error instanceof NodeOperationError) {
			throw error;
		}
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(this.getNode(), `Workflow execution failed: ${errorMessage}`);
	}
}

async function executeWorkflowWithWebhook(
	this: IExecuteFunctions,
	endpoint: string,
	body: Record<string, any>,
	webhookUrl: string,
): Promise<INodeExecutionData[]> {
	try {
		// Submit to queue with webhook
		const queueResponse = (await this.helpers.httpRequestWithAuthentication.call(
			this,
			'falApi',
			{
				method: 'POST',
				url: `/${endpoint}?fal_webhook=${encodeURIComponent(webhookUrl)}`,
				body,
				json: true,
			},
		)) as QueueSubmitResponse;

		return [
			{
				json: {
					request_id: queueResponse.request_id,
					webhook_url: webhookUrl,
					status: 'queued',
					message: 'Workflow queued. Results will be sent to the webhook URL.',
				},
			},
		];
	} catch (error) {
		if (error instanceof NodeOperationError) {
			throw error;
		}
		const errorMessage = error instanceof Error ? error.message : String(error);
		throw new NodeOperationError(
			this.getNode(),
			`Failed to queue workflow with webhook: ${errorMessage}`,
		);
	}
}
