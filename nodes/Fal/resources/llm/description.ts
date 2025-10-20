import { INodeProperties } from 'n8n-workflow';
import { llmModels } from './models';

export const llmOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['llm'],
			},
		},
		options: [
			{
				name: 'Generate Text',
				value: 'generate',
				description: 'Generate text using language models',
				action: 'Generate text using language models',
			},
		],
		default: 'generate',
	},
];

export const llmFields: INodeProperties[] = [
	{
		displayName: 'Model',
		name: 'model',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['llm'],
				operation: ['generate'],
			},
		},
		options: llmModels,
		default: 'google/gemini-2.5-flash-lite',
		description:
			'The language model to use. Premium models (10x rate): Claude 3.7/3.5 Sonnet, Gemini 2.5 Pro, GPT-4o, GPT-5 Chat, DeepSeek R1, O3.',
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
				resource: ['llm'],
				operation: ['generate'],
			},
		},
		default: '',
		required: true,
		placeholder: '={{$json.userMessage}} or Write a short story about...',
		description:
			'The prompt to send to the language model. Supports expressions from previous nodes.',
	},
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: {
				resource: ['llm'],
				operation: ['generate'],
			},
		},
		options: [
			{
				displayName: 'Include Reasoning',
				name: 'reasoning',
				type: 'boolean',
				default: false,
				description:
					'Whether reasoning should be part of the final answer (for reasoning models)',
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
						description: 'Default, recommended for most use cases',
					},
					{
						name: 'Latency',
						value: 'latency',
						description: 'For use cases where low latency is important',
					},
				],
				default: 'latency',
				description: 'Processing priority',
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
				description:
					'Controls randomness in responses (0-2). Lower = more predictable, Higher = more creative.',
			},
		],
	},
];

export const description: INodeProperties[] = [...llmOperations, ...llmFields];
