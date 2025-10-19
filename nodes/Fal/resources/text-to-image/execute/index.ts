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

	// Handle image size
	const imageSize = (additionalOptions.imageSize as string) || 'square';
	if (imageSize === 'custom') {
		body.image_size = {
			width: additionalOptions.width || 1024,
			height: additionalOptions.height || 1024,
		};
	} else {
		const sizes: { [key: string]: { width: number; height: number } } = {
			square: { width: 1024, height: 1024 },
			landscape: { width: 1280, height: 720 },
			portrait: { width: 720, height: 1280 },
		};
		body.image_size = sizes[imageSize];
	}

	// Add optional parameters
	if (additionalOptions.numImages) {
		body.num_images = additionalOptions.numImages;
	}
	if (additionalOptions.seed && additionalOptions.seed !== -1) {
		body.seed = additionalOptions.seed;
	}
	if (additionalOptions.guidanceScale) {
		body.guidance_scale = additionalOptions.guidanceScale;
	}
	if (additionalOptions.numInferenceSteps) {
		body.num_inference_steps = additionalOptions.numInferenceSteps;
	}
	if (additionalOptions.safetyCheck !== undefined) {
		body.enable_safety_checker = additionalOptions.safetyCheck;
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
