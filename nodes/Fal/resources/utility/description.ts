import { INodeProperties } from 'n8n-workflow';
import { utilityOperations } from './models';

export const utilityOperationsField: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: utilityOperations,
		default: 'imageUpscale',
	},
];

export const utilityFields: INodeProperties[] = [
	// Image Upscaling
	{
		displayName: 'Image URL',
		name: 'imageUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['imageUpscale', 'removeBackground', 'nsfwDetection'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.imageUrl}} or https://example.com/image.jpg',
		description: 'The URL of the image to process. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Upscale Factor',
		name: 'upscaleFactor',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['imageUpscale'],
			},
		},
		options: [
			{
				name: '2x',
				value: 2,
			},
			{
				name: '4x',
				value: 4,
			},
		],
		default: 2,
		description: 'How much to upscale the image',
	},
	// Video Upscaling
	{
		displayName: 'Video URL',
		name: 'videoUrl',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['videoUpscale', 'removeBackgroundVideo'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.videoUrl}} or https://example.com/video.mp4',
		description: 'The URL of the video to process. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Upscale Factor',
		name: 'upscaleFactor',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['videoUpscale'],
			},
		},
		options: [
			{
				name: '2x',
				value: 2,
			},
			{
				name: '4x',
				value: 4,
			},
		],
		default: 2,
		description: 'How much to upscale the video',
	},
];

export const description: INodeProperties[] = [...utilityOperationsField, ...utilityFields];
