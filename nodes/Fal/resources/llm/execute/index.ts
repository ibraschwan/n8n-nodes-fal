import { IExecuteFunctions, IDataObject, NodeApiError } from 'n8n-workflow';
import { pollQueue } from '../../../utils/poll-queue.util';
import { QueueSubmitResponse } from '../../../interfaces';

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const model = this.getNodeParameter('model', itemIndex) as string;
	const prompt = this.getNodeParameter('prompt', itemIndex) as string;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	// Build the request body
	const body: IDataObject = {
		prompt,
		model,
	};

	// Add optional parameters
	if (additionalOptions.systemPrompt) {
		body.system_prompt = additionalOptions.systemPrompt;
	}
	if (additionalOptions.temperature !== undefined) {
		body.temperature = additionalOptions.temperature;
	}
	if (additionalOptions.maxTokens) {
		body.max_tokens = additionalOptions.maxTokens;
	}
	if (additionalOptions.priority) {
		body.priority = additionalOptions.priority;
	}
	if (additionalOptions.reasoning !== undefined) {
		body.reasoning = additionalOptions.reasoning;
	}

	// Submit the request to the queue
	const submitResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
		method: 'POST',
		url: '/fal-ai/any-llm',
		body,
		json: true,
	});

	const queueData = submitResponse as QueueSubmitResponse;

	if (!queueData.request_id) {
		throw new NodeApiError(this.getNode(), {
			message: 'Failed to submit request to queue',
			description: 'No request_id received',
		});
	}

	// Poll for completion - LLM uses a fixed endpoint 'fal-ai/any-llm'
	const result = await pollQueue.call(this, 'fal-ai/any-llm', queueData.request_id, queueData.response_url);

	return result;
}
