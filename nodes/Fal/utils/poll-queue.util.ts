import { IExecuteFunctions, IDataObject, NodeApiError } from 'n8n-workflow';
import { QueueStatus } from '../enums';
import { QueueStatusResponse } from '../interfaces';

/**
 * Poll the Fal.ai queue until the request is completed or failed
 * @param requestId The request ID to poll
 * @param responseUrl Optional response URL from the queue submission
 * @returns The final response data
 */
export async function pollQueue(
	this: IExecuteFunctions,
	requestId: string,
	responseUrl?: string,
): Promise<IDataObject> {
	const maxAttempts = 60; // Maximum number of polling attempts
	const pollInterval = 2000; // Poll every 2 seconds
	let attempts = 0;

	while (attempts < maxAttempts) {
		attempts++;

		// Get the status of the request
		const statusResponse = await this.helpers.httpRequestWithAuthentication.call(
			this,
			'falApi',
			{
				method: 'GET',
				url: `/requests/${requestId}/status`,
				json: true,
			},
		);

		const status = statusResponse as QueueStatusResponse;

		if (status.status === QueueStatus.Completed) {
			// Request completed, get the result
			const finalResponseUrl = status.response_url || responseUrl;

			if (!finalResponseUrl) {
				throw new NodeApiError(this.getNode(), {
					message: 'Request completed but no response URL available',
					description: 'The queue processing completed but no response URL was provided',
				});
			}

			// Fetch the final result
			const result = await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
				method: 'GET',
				url: finalResponseUrl.replace('https://queue.fal.run', ''),
				json: true,
			});

			return result as IDataObject;
		} else if (status.status === QueueStatus.Failed) {
			// Request failed
			const errorMessage =
				status.logs
					?.filter((log) => log.level === 'error')
					.map((log) => log.message)
					.join(', ') || 'Unknown error';

			throw new NodeApiError(this.getNode(), {
				message: 'Request failed',
				description: errorMessage,
			});
		}

		// Request is still in queue or in progress, wait before polling again
		await new Promise((resolve) => setTimeout(resolve, pollInterval));
	}

	// Max attempts reached
	throw new NodeApiError(this.getNode(), {
		message: 'Request timeout',
		description: `The request did not complete within ${(maxAttempts * pollInterval) / 1000} seconds`,
	});
}
