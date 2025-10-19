import { INodeProperties } from 'n8n-workflow';
import { imageEditingModels } from './models';

export const imageEditingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['imageEditing'],
			},
		},
		options: [
			{
				name: 'Edit',
				value: 'edit',
				description: 'Edit an image using a text prompt',
				action: 'Edit an image using a text prompt',
			},
		],
		default: 'edit',
	},
];

export const imageEditingFields: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['imageEditing'],
				operation: ['edit'],
			},
		},
		options: imageEditingModels,
		default: 'fal-ai/flux-pro/kontext',
		description: 'The AI model to use for image editing',
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['imageEditing'],
				operation: ['edit'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.imageUrl}} or https://example.com/image.jpg',
		description: 'The URL of the image to edit. Supports expressions from previous nodes.',
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
				resource: ['imageEditing'],
				operation: ['edit'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.editInstruction}} or Transform this into a watercolor painting',
		description:
			'The text prompt describing the edits to make. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['imageEditing'],
				operation: ['edit'],
			},
		},
		options: [
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
				description: 'The size of the edited image',
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
				description: 'Width of the edited image',
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
				description: 'Height of the edited image',
			},
			{
				displayName: 'Seed',
				name: 'seed',
				type: 'number',
				default: -1,
				description: 'Random seed for reproducibility. Use -1 for random.',
			},
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
				displayName: 'Strength',
				name: 'strength',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 1,
					numberPrecision: 2,
				},
				default: 0.8,
				description: 'How much to transform the original image (0-1)',
			},
			{
				displayName: 'Number of Inference Steps',
				name: 'numInferenceSteps',
				type: 'number',
				default: 50,
				description: 'Number of denoising steps',
			},
		],
	},
];

export const description: INodeProperties[] = [...imageEditingOperations, ...imageEditingFields];
