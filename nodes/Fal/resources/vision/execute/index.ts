import { IExecuteFunctions, IDataObject, NodeApiError } from 'n8n-workflow';

export async function execute(this: IExecuteFunctions, itemIndex: number): Promise<IDataObject> {
	const model = this.getNodeParameter('model', itemIndex) as string;
	const prompt = this.getNodeParameter('prompt', itemIndex) as string;
	const imageUrls = this.getNodeParameter('imageUrls', itemIndex, '') as string;
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

	// Parse image URLs (comma-separated)
	if (imageUrls) {
		const urls = imageUrls
			.split(',')
			.map((url) => url.trim())
			.filter((url) => url.length > 0);
		if (urls.length > 0) {
			body.image_urls = urls;
		}
	}

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

	// Submit the request directly (no queue for vision models)
	const response = await this.helpers.httpRequestWithAuthentication.call(this, 'falApi', {
		method: 'POST',
		url: '/fal-ai/any-llm/vision',
		body,
		json: true,
	});

	if (!response) {
		throw new NodeApiError(this.getNode(), {
			message: 'Failed to get response from vision model',
			description: 'No response received',
		});
	}

	return response as IDataObject;
}
