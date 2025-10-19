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
	};

	// Add optional parameters
	if (additionalOptions.duration) {
		body.duration = additionalOptions.duration;
	}
	if (additionalOptions.aspectRatio) {
		body.aspect_ratio = additionalOptions.aspectRatio;
	}
	if (additionalOptions.resolution) {
		body.resolution = additionalOptions.resolution;
	}
	if (additionalOptions.generateAudio !== undefined) {
		body.generate_audio = additionalOptions.generateAudio;
	}
	if (additionalOptions.negativePrompt) {
		body.negative_prompt = additionalOptions.negativePrompt;
	}
	if (additionalOptions.enhancePrompt !== undefined) {
		body.enhance_prompt = additionalOptions.enhancePrompt;
	}
	if (additionalOptions.autoFix !== undefined) {
		body.auto_fix = additionalOptions.autoFix;
	}
	if (additionalOptions.seed && additionalOptions.seed !== -1) {
		body.seed = additionalOptions.seed;
	}

	// Submit the request to the queue
	const submitResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
		method: 'POST',
		url: `/${model}`,
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

	// Poll for completion
	const result = await pollQueue.call(this, queueData.request_id, queueData.response_url);

	return result;
}
