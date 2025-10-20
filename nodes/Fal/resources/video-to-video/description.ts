import { INodeProperties } from 'n8n-workflow';
import { videoToVideoModels } from './models';

export const videoToVideoOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['videoToVideo'],
			},
		},
		options: [
			{
				name: 'Transform',
				value: 'transform',
				description: 'Transform a video using text or image prompts',
				action: 'Transform a video',
			},
		],
		default: 'transform',
	},
];

export const videoToVideoFields: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['videoToVideo'],
				operation: ['transform'],
			},
		},
		options: videoToVideoModels,
		default: 'fal-ai/sora-2/video-to-video/remix',
		description: 'The AI model to use for video transformation',
	},
	{
		displayName: 'Video URL',
		name: 'videoUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['videoToVideo'],
				operation: ['transform'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.videoUrl}} or https://example.com/video.mp4',
		description: 'The URL of the video to transform. Supports expressions from previous nodes.',
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
				resource: ['videoToVideo'],
				operation: ['transform'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.transformation}} or Transform into cyberpunk style',
		description:
			'Text prompt describing how to transform the video. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['videoToVideo'],
				operation: ['transform'],
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
				description: 'Aspect ratio of the output video',
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
						name: '10 Seconds',
						value: '10s',
					},
				],
				default: '5s',
				description: 'Duration of the output video',
			},
			{
				displayName: 'Image URL',
				name: 'imageUrl',
				type: 'string',
				default: '',
				description: 'Optional image URL to guide the transformation',
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

export const description: INodeProperties[] = [...videoToVideoOperations, ...videoToVideoFields];
