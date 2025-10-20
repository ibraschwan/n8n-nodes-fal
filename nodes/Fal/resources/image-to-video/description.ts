import { INodeProperties } from 'n8n-workflow';
import { imageToVideoModels } from './models';

export const imageToVideoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['imageToVideo'],
			},
		},
		options: [
			{
				name: 'Generate',
				value: 'generate',
				description: 'Generate a video from an image',
				action: 'Generate a video from an image',
			},
		],
		default: 'generate',
	},
];

export const imageToVideoFields: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['imageToVideo'],
				operation: ['generate'],
			},
		},
		options: imageToVideoModels,
		default: 'fal-ai/veo3.1/image-to-video',
		description: 'The AI model to use for video generation',
	},
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['imageToVideo'],
				operation: ['generate'],
			},
			hide: {
				model: [
					'fal-ai/veo3.1/first-last-frame-to-video',
					'fal-ai/veo3.1/fast/first-last-frame-to-video',
				],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.imageUrl}} or https://example.com/image.jpg',
		description: 'The URL of the image to animate. Supports expressions from previous nodes.',
	},
	{
		displayName: 'First Frame URL',
		name: 'firstFrameUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['imageToVideo'],
				operation: ['generate'],
				model: [
					'fal-ai/veo3.1/first-last-frame-to-video',
					'fal-ai/veo3.1/fast/first-last-frame-to-video',
				],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.firstFrame}} or https://example.com/frame1.jpg',
		description:
			'The URL of the first frame of the video. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Last Frame URL',
		name: 'lastFrameUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['imageToVideo'],
				operation: ['generate'],
				model: [
					'fal-ai/veo3.1/first-last-frame-to-video',
					'fal-ai/veo3.1/fast/first-last-frame-to-video',
				],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.lastFrame}} or https://example.com/frame2.jpg',
		description:
			'The URL of the last frame of the video. Supports expressions from previous nodes.',
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
				resource: ['imageToVideo'],
				operation: ['generate'],
				model: [
					'fal-ai/veo3.1/first-last-frame-to-video',
					'fal-ai/veo3.1/fast/first-last-frame-to-video',
				],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.videoDescription}} or A person walking through a forest',
		description:
			'The text prompt describing the video you want to generate. Supports expressions from previous nodes.',
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
				resource: ['imageToVideo'],
				operation: ['generate'],
			},
			hide: {
				model: [
					'fal-ai/veo3.1/first-last-frame-to-video',
					'fal-ai/veo3.1/fast/first-last-frame-to-video',
				],
			},
		},
		default: '',
		placeholder: '={{$json.guidance}}',
		description:
			'Optional text prompt to guide the video generation. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['imageToVideo'],
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
				displayName: 'Duration',
				name: 'duration',
				type: 'options',
				options: [
					{
						name: '5 Seconds',
						value: '5s',
					},
					{
						name: '8 Seconds',
						value: '8s',
					},
					{
						name: '10 Seconds',
						value: '10s',
					},
				],
				default: '5s',
				description: 'Duration of the generated video in seconds',
			},
			{
				displayName: 'Generate Audio',
				name: 'generateAudio',
				type: 'boolean',
				default: true,
				description: 'Whether to generate audio. If false, 33% less credits will be used.',
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

export const description: INodeProperties[] = [...imageToVideoOperations, ...imageToVideoFields];
