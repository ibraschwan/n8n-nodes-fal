import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';
import * as textToImage from './resources/text-to-image';
import * as textToVideo from './resources/text-to-video';
import * as imageEditing from './resources/image-editing';
import * as imageToVideo from './resources/image-to-video';
import * as videoToVideo from './resources/video-to-video';
import * as vision from './resources/vision';
import * as llm from './resources/llm';
import * as utility from './resources/utility';
import * as workflow from './resources/workflow';
import * as queue from './resources/queue';

export class Fal implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Fal',
		name: 'fal',
		icon: 'file:fal-ai-logo.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Fal.ai API',
		defaults: {
			name: 'Fal',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'falApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://queue.fal.run',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'LLM (Text Generation)',
						value: 'llm',
					},
					{
						name: 'Text to Image',
						value: 'textToImage',
					},
					{
						name: 'Text to Video',
						value: 'textToVideo',
					},
					{
						name: 'Image Editing',
						value: 'imageEditing',
					},
					{
						name: 'Image to Video',
						value: 'imageToVideo',
					},
					{
						name: 'Video to Video',
						value: 'videoToVideo',
					},
					{
						name: 'Vision (Image Analysis)',
						value: 'vision',
					},
					{
						name: 'Workflow',
						value: 'workflow',
					},
					{
						name: 'Queue',
						value: 'queue',
					},
					{
						name: 'Utility',
						value: 'utility',
					},
				],
				default: 'textToImage',
			},
			...llm.description,
			...textToImage.description,
			...textToVideo.description,
			...imageEditing.description,
			...imageToVideo.description,
			...videoToVideo.description,
			...vision.description,
			...workflow.workflowOperations,
			...workflow.workflowFields,
			...queue.queueOperations,
			...queue.queueFields,
			...utility.description,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0);

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData;

				if (resource === 'llm') {
					responseData = await llm.execute.execute.call(this, i);
				} else if (resource === 'textToImage') {
					responseData = await textToImage.execute.execute.call(this, i);
				} else if (resource === 'textToVideo') {
					responseData = await textToVideo.execute.execute.call(this, i);
				} else if (resource === 'imageEditing') {
					responseData = await imageEditing.execute.execute.call(this, i);
				} else if (resource === 'imageToVideo') {
					responseData = await imageToVideo.execute.execute.call(this, i);
				} else if (resource === 'videoToVideo') {
					responseData = await videoToVideo.execute.execute.call(this, i);
				} else if (resource === 'vision') {
					responseData = await vision.execute.execute.call(this, i);
				} else if (resource === 'workflow') {
					responseData = await workflow.executeWorkflow.call(this, i);
				} else if (resource === 'queue') {
					responseData = await queue.executeQueue.call(this, i);
				} else if (resource === 'utility') {
					responseData = await utility.execute.execute.call(this, i);
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`The resource "${resource}" is not known!`,
						{
							itemIndex: i,
						},
					);
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);
			} catch (error) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					returnData.push({
						json: {
							error: errorMessage,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
