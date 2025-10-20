import type { INodeProperties } from 'n8n-workflow';

export const workflowOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['workflow'],
			},
		},
		options: [
			{
				name: 'Execute Custom Workflow',
				value: 'executeCustom',
				description: 'Execute a custom workflow definition',
				action: 'Execute custom workflow',
			},
			{
				name: 'Execute Pre-Built Workflow',
				value: 'executePrebuilt',
				description: 'Execute a pre-built workflow endpoint',
				action: 'Execute pre built workflow',
			},
		],
		default: 'executePrebuilt',
	},
];

export const workflowFields: INodeProperties[] = [
	// Execute Custom Workflow Fields
	{
		displayName: 'Workflow Definition',
		name: 'workflowDefinition',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['executeCustom'],
			},
		},
		default: JSON.stringify(
			{
				input: {
					id: 'input',
					type: 'input',
					depends: [],
					input: {
						prompt: '',
					},
				},
				node_1: {
					id: 'node_1',
					type: 'run',
					depends: ['input'],
					app: 'fal-ai/flux/dev',
					input: {
						prompt: '$input.prompt',
					},
				},
				output: {
					id: 'output',
					type: 'display',
					depends: ['node_1'],
					fields: {
						image: '$node_1.images.0.url',
					},
				},
			},
			null,
			2,
		),
		description:
			'The JSON workflow definition with input, model nodes, and output nodes. See <a href="https://fal.ai/docs/model-endpoints/workflows" target="_blank">Fal Workflows Documentation</a>.',
		required: true,
	},
	{
		displayName: 'Workflow Input',
		name: 'workflowInput',
		type: 'json',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['executeCustom'],
			},
		},
		default: '{\n  "prompt": "A beautiful sunset over a calm ocean"\n}',
		description: 'The input parameters for the workflow',
		required: true,
	},

	// Execute Pre-built Workflow Fields
	{
		displayName: 'Workflow Endpoint',
		name: 'workflowEndpoint',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['executePrebuilt'],
			},
		},
		default: 'workflows/fal-ai/sdxl-sticker',
		description:
			'The workflow endpoint ID (e.g., workflows/fal-ai/sdxl-sticker). See <a href="https://fal.ai/docs/model-endpoints/workflows" target="_blank">Fal Workflows</a>.',
		required: true,
	},
	{
		displayName: 'Input Parameters',
		name: 'parameters',
		placeholder: 'Add Parameter',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				resource: ['workflow'],
				operation: ['executePrebuilt'],
			},
		},
		default: {},
		options: [
			{
				name: 'parameter',
				displayName: 'Parameter',
				values: [
					{
						displayName: 'Name',
						name: 'name',
						type: 'string',
						default: '',
						description: 'Name of the parameter',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						description: 'Value of the parameter',
					},
				],
			},
		],
	},

	// Common Fields
	{
		displayName: 'Options',
		name: 'options',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['workflow'],
			},
		},
		options: [
			{
				displayName: 'Include Intermediate Results',
				name: 'includeIntermediateResults',
				type: 'boolean',
				default: true,
				description:
					'Whether to include intermediate results from each workflow step in the output',
			},
			{
				displayName: 'Webhook URL',
				name: 'webhookUrl',
				type: 'string',
				default: '',
				description:
					'Optional webhook URL to receive results asynchronously. If provided, the workflow will be queued and results sent to this URL.',
			},
			{
				displayName: 'Timeout',
				name: 'timeout',
				type: 'number',
				default: 300000,
				description: 'Request timeout in milliseconds',
			},
		],
	},
];
