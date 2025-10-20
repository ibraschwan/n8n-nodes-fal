import { INodeProperties } from 'n8n-workflow';
import { textToVideoModels } from './models';

export const textToVideoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['textToVideo'],
			},
		},
		options: [
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate a video from text',
				action: 'Generate a video from text',
			},
		],
		default: 'generate',
	},
];

export const textToVideoFields: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['textToVideo'],
				operation: ['generate'],
			},
		},
		options: textToVideoModels,
		default: 'fal-ai/veo3.1/fast',
		description: 'The AI model to use for video generation',
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
				resource: ['textToVideo'],
				operation: ['generate'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.videoPrompt}} or A cinematic shot of waves crashing...',
		description:
			'The text prompt describing the video you want to generate. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['textToVideo'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Aspect Ratio',
				name: 'aspectRatio',
				type: 'options',
				options: [
					{
						name: '16:9',
						value: '16:9',
					},
					{
						name: '9:16',
						value: '9:16',
					},
					{
						name: '1:1',
						value: '1:1',
					},
				],
				default: '16:9',
				description: 'Aspect ratio of the generated video',
			},
			{
				displayName: 'Auto Fix',
				name: 'autoFix',
				type: 'boolean',
				default: true,
				description: 'Whether to automatically fix prompts that fail content policy',
			},
			{
				displayName: 'Duration',
				name: 'duration',
				type: 'options',
				options: [
					{
						name: '4 Seconds',
						value: '4s',
					},
					{
						name: '6 Seconds',
						value: '6s',
					},
					{
						name: '8 Seconds',
						value: '8s',
					},
				],
				default: '8s',
				description: 'Duration of the generated video in seconds',
			},
			{
				displayName: 'Enhance Prompt',
				name: 'enhancePrompt',
				type: 'boolean',
				default: true,
				description: 'Whether to enhance the video generation',
			},
			{
				displayName: 'Generate Audio',
				name: 'generateAudio',
				type: 'boolean',
				default: true,
				description: 'Whether to generate audio. If false, 33% less credits will be used.',
			},
			{
				displayName: 'Negative Prompt',
				name: 'negativePrompt',
				type: 'string',
				typeOptions: {
					rows: 2,
				},
				default: '',
				description: 'A negative prompt to guide the video generation',
			},
			{
				displayName: 'Resolution',
				name: 'resolution',
				type: 'options',
				options: [
					{
						name: '720p',
						value: '720p',
					},
					{
						name: '1080p',
						value: '1080p',
					},
				],
				default: '720p',
				description: 'Resolution of the generated video',
			},
			{
				displayName: 'Seed',
				name: 'seed',
				type: 'number',
				default: -1,
				description: 'Random seed for reproducibility. Use -1 for random.',
			},
		],
	},
];

export const description: INodeProperties[] = [...textToVideoOperations, ...textToVideoFields];
