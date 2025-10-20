import { INodeProperties } from 'n8n-workflow';
import { textToImageModels } from './models';

export const textToImageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['textToImage'],
			},
		},
		options: [
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate an image from text',
				action: 'Generate an image from text',
			},
		],
		default: 'generate',
	},
];

export const textToImageFields: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['textToImage'],
				operation: ['generate'],
			},
		},
		options: textToImageModels,
		default: 'fal-ai/flux-pro/v1.1',
		description: 'The AI model to use for image generation',
	},
	{
		displayName: 'Prompt',
		name: 'prompt',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['textToImage'],
				operation: ['generate'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.imagePrompt}} or A serene landscape with mountains...',
		description:
			'The text prompt to generate an image from. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['textToImage'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Guidance Scale',
				name: 'guidanceScale',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 20,
				},
				default: 7.5,
				description: 'How closely to follow the prompt (0-20)',
			},
			{
				displayName: 'Height',
				name: 'height',
				type: 'number',
				displayOptions: {
					show: {
						imageSize: ['custom'],
					},
				},
				default: 1024,
				description: 'Height of the generated image',
			},
			{
				displayName: 'Image Size',
				name: 'imageSize',
				type: 'options',
				options: [
					{
						name: 'Square (1024x1024)',
						value: 'square',
					},
					{
						name: 'Landscape (1280x720)',
						value: 'landscape',
					},
					{
						name: 'Portrait (720x1280)',
						value: 'portrait',
					},
					{
						name: 'Custom',
						value: 'custom',
					},
				],
				default: 'square',
				description: 'The size of the generated image',
			},
			{
				displayName: 'Number of Images',
				name: 'numImages',
				type: 'number',
				default: 1,
				description: 'Number of images to generate',
			},
			{
				displayName: 'Number of Inference Steps',
				name: 'numInferenceSteps',
				type: 'number',
				default: 50,
				description: 'Number of denoising steps',
			},
			{
				displayName: 'Safety Check',
				name: 'safetyCheck',
				type: 'boolean',
				default: true,
				description: 'Whether to run safety checks on generated images',
			},
			{
				displayName: 'Seed',
				name: 'seed',
				type: 'number',
				default: -1,
				description: 'Random seed for reproducibility. Use -1 for random.',
			},
			{
				displayName: 'Width',
				name: 'width',
				type: 'number',
				displayOptions: {
					show: {
						imageSize: ['custom'],
					},
				},
				default: 1024,
				description: 'Width of the generated image',
			},
		],
	},
];

export const description: INodeProperties[] = [...textToImageOperations, ...textToImageFields];
