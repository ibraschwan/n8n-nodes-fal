import { IExecuteFunctions, IDataObject, NodeApiError } from 'n8n-workflow';
import { pollQueue } from '../../../utils/poll-queue.util';
import { QueueSubmitResponse } from '../../../interfaces';

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const operation = this.getNodeParameter('operation', itemIndex) as string;

	let endpoint = '';
	const body: IDataObject = {};

	switch (operation) {
		case 'imageUpscale':
			endpoint = '/fal-ai/topaz/upscale/image';
			body.image_url = this.getNodeParameter('imageUrl', itemIndex) as string;
			body.scale = this.getNodeParameter('upscaleFactor', itemIndex, 2) as number;
			break;

		case 'videoUpscale':
			endpoint = '/fal-ai/topaz/upscale/video';
			body.video_url = this.getNodeParameter('videoUrl', itemIndex) as string;
			body.scale = this.getNodeParameter('upscaleFactor', itemIndex, 2) as number;
			break;

		case 'removeBackground':
			endpoint = '/fal-ai/bria/background/remove';
			body.image_url = this.getNodeParameter('imageUrl', itemIndex) as string;
			break;

		case 'removeBackgroundVideo':
			endpoint = '/fal-ai/bria/video/background-removal';
			body.video_url = this.getNodeParameter('videoUrl', itemIndex) as string;
			break;

		case 'nsfwDetection':
			endpoint = '/fal-ai/x-ailab/nsfw';
			body.image_url = this.getNodeParameter('imageUrl', itemIndex) as string;
			break;

		default:
			throw new NodeApiError(this.getNode(), {
				message: `Unknown operation: ${operation}`,
			});
	}

	// Submit the request to the queue
	const submitResponse = await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
		method: 'POST',
		url: endpoint,
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

	// Poll for completion - use endpoint without leading slash for pollQueue
	const modelEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
	const result = await pollQueue.call(this, modelEndpoint, queueData.request_id, queueData.response_url);

	return result;
}
