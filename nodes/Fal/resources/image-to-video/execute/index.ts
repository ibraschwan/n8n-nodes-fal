import { IExecuteFunctions, IDataObject, NodeApiError } from 'n8n-workflow';
import { pollQueue } from '../../../utils/poll-queue.util';
import { QueueSubmitResponse } from '../../../interfaces';

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const model = this.getNodeParameter('model', itemIndex) as string;
	const prompt = this.getNodeParameter('prompt', itemIndex, '') as string;
	const additionalOptions = this.getNodeParameter(
		'additionalOptions',
		itemIndex,
		{},
	) as IDataObject;

	// Build the request body
	const body: IDataObject = {};

	// Check if this is a first-last frame model
	const isFirstLastFrame = model.includes('first-last-frame-to-video');

	if (isFirstLastFrame) {
		const firstFrameUrl = this.getNodeParameter('firstFrameUrl', itemIndex) as string;
		const lastFrameUrl = this.getNodeParameter('lastFrameUrl', itemIndex) as string;
		body.first_frame_url = firstFrameUrl;
		body.last_frame_url = lastFrameUrl;
		if (prompt) {
			body.prompt = prompt;
		}
	} else {
		const imageUrl = this.getNodeParameter('imageUrl', itemIndex) as string;
		body.image_url = imageUrl;
		if (prompt) {
			body.prompt = prompt;
		}
	}

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
