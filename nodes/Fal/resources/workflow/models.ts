export enum WorkflowOperation {
	ExecuteCustom = 'executeCustom',
	ExecutePrebuilt = 'executePrebuilt',
}

export interface WorkflowNode {
	id: string;
	type: 'input' | 'run' | 'display';
	depends: string[];
	app?: string;
	input?: Record<string, unknown>;
	fields?: Record<string, unknown>;
}

export interface WorkflowDefinition {
	[key: string]: WorkflowNode;
}

export interface WorkflowSubmitEvent {
	type: 'submit';
	node_id: string;
	app_id: string;
	request_id: string;
}

export interface WorkflowCompletionEvent {
	type: 'completion';
	node_id: string;
	app_id?: string;
	output: unknown;
}

export interface WorkflowOutputEvent {
	type: 'output';
	output: unknown;
}

export interface WorkflowErrorEvent {
	type: 'error';
	node_id: string;
	message: string;
	error: {
		status?: number;
		body?: unknown;
	};
}

export type WorkflowEvent =
	| WorkflowSubmitEvent
	| WorkflowCompletionEvent
	| WorkflowOutputEvent
	| WorkflowErrorEvent;

export interface WorkflowExecuteCustomParams {
	workflowDefinition: string;
	workflowInput: string;
	options?: {
		includeIntermediateResults?: boolean;
		webhookUrl?: string;
		timeout?: number;
	};
}

export interface WorkflowExecutePrebuiltParams {
	workflowEndpoint: string;
	parameters?: {
		parameter?: Array<{
			name: string;
			value: string;
		}>;
	};
	options?: {
		includeIntermediateResults?: boolean;
		webhookUrl?: string;
		timeout?: number;
	};
}
