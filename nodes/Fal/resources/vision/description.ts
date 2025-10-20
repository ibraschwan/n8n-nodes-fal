import { INodeProperties } from 'n8n-workflow';
import { visionModels } from './models';

export const visionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['vision'],
			},
		},
		options: [
			{
				name: 'Analyze',
				value: 'analyze',
				description: 'Analyze images with vision language models',
				action: 'Analyze images with vision language models',
			},
		],
		default: 'analyze',
	},
];

export const visionFields: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['vision'],
				operation: ['analyze'],
			},
		},
		options: visionModels,
		default: 'google/gemini-2.5-flash-lite',
		description: 'The vision language model to use',
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
				resource: ['vision'],
				operation: ['analyze'],
			},
		},
		default: '',
		required: true,
		description: 'The question or instruction for analyzing the image',
	},
	{
		displayName: 'Image URLs',
		name: 'imageUrls',
		type: 'string',
		typeOptions: {
			rows: 2,
		},
		displayOptions: {
			show: {
				resource: ['vision'],
				operation: ['analyze'],
			},
		},
		default: '',
		placeholder:
			'={{$json.images.join(",")}} or https://example.com/image1.jpg, https://example.com/image2.jpg',
		description:
			'Comma-separated image URLs to analyze. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['vision'],
				operation: ['analyze'],
			},
		},
		options: [
			{
				displayName: 'Include Reasoning',
				name: 'reasoning',
				type: 'boolean',
				default: false,
				description: 'Whether reasoning should be part of the final answer',
			},
			{
				displayName: 'Max Tokens',
				name: 'maxTokens',
				type: 'number',
				default: 1024,
				description: 'Maximum number of tokens to generate',
			},
			{
				displayName: 'Priority',
				name: 'priority',
				type: 'options',
				options: [
					{
						name: 'Throughput',
						value: 'throughput',
					},
					{
						name: 'Latency',
						value: 'latency',
					},
				],
				default: 'latency',
				description:
					'Processing priority (latency for low latency, throughput for most use cases)',
			},
			{
				displayName: 'System Prompt',
				name: 'systemPrompt',
				type: 'string',
				typeOptions: {
					rows: 2,
				},
				default: '',
				description: 'System prompt to provide context or instructions',
			},
			{
				displayName: 'Temperature',
				name: 'temperature',
				type: 'number',
				typeOptions: {
					minValue: 0,
					maxValue: 2,
					numberPrecision: 2,
				},
				default: 1.0,
				description: 'Controls randomness in responses (0-2)',
			},
		],
	},
];

export const description: INodeProperties[] = [...visionOperations, ...visionFields];
