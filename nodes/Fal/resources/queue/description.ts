import type { INodeProperties } from 'n8n-workflow';

export const queueOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['queue'],
			},
		},
		options: [
			{
				name: 'Cancel Request',
				value: 'cancel',
				description: 'Cancel a queued request that has not started processing',
				action: 'Cancel request',
			},
			{
				name: 'Get Response',
				value: 'getResponse',
				description: 'Get the response of a completed request',
				action: 'Get request response',
			},
			{
				name: 'Get Status',
				value: 'getStatus',
				description: 'Get the status of a queued request',
				action: 'Get request status',
			},
			{
				name: 'Stream Status',
				value: 'streamStatus',
				description: 'Stream status updates until request completes',
				action: 'Stream request status',
			},
			{
				name: 'Submit Request',
				value: 'submit',
				description: 'Submit a request to the queue',
				action: 'Submit request to queue',
			},
		],
		default: 'submit',
	},
];

export const queueFields: INodeProperties[] = [
	// Submit Request Fields
	{
		displayName: 'Model Endpoint',
		name: 'modelEndpoint',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['submit'],
			},
		},
		default: 'fal-ai/flux/dev',
		description:
			'The model endpoint ID (e.g., fal-ai/flux/dev, fal-ai/fast-sdxl). See <a href="https://fal.ai/models" target="_blank">Fal Models</a>.',
		required: true,
	},
	{
		displayName: 'Input Parameters',
		name: 'inputParameters',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['submit'],
			},
		},
		default: '{\n  "prompt": "a beautiful sunset"\n}',
		description: 'The input parameters for the model as JSON',
		required: true,
	},

	// Request ID Field (for status, response, cancel, stream operations)
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['getStatus', 'getResponse', 'cancel', 'streamStatus'],
			},
		},
		default: '',
		description: 'The request ID returned from submitting a request',
		required: true,
	},
	{
		displayName: 'Model Endpoint',
		name: 'modelEndpoint',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queue'],
				operation: ['getStatus', 'getResponse', 'cancel', 'streamStatus'],
			},
		},
		default: 'fal-ai/flux/dev',
		description: 'The model endpoint ID used when submitting the request',
		required: true,
	},

	// Options
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['queue'],
			},
		},
		options: [
			{
				displayName: 'Include Logs',
				name: 'includeLogs',
				type: 'boolean',
				default: false,
				description: 'Whether to include logs in the status response',
				displayOptions: {
					show: {
						'/operation': ['getStatus', 'streamStatus'],
					},
				},
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				description:
					'Optional webhook URL to receive the result when the request completes. If provided, fal will call this URL instead of requiring polling.',
				displayOptions: {
					show: {
						'/operation': ['submit'],
					},
				},
			},
		],
	},
];
