export enum WorkflowOperation {
	ExecuteCustom = 'executeCustom',
	ExecutePrebuilt = 'executePrebuilt',
}

export interface WorkflowNode {
	id: string;
	type: 'input' | 'run' | 'display';
	depends: string[];
	app?: string;
	input?: Record<string, any>;
	fields?: Record<string, any>;
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
	output: any;
}

export interface WorkflowOutputEvent {
	type: 'output';
	output: any;
}

export interface WorkflowErrorEvent {
	type: 'error';
	node_id: string;
	message: string;
	error: {
		status?: number;
		body?: any;
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
			value: any;
		}>;
	};
	options?: {
		includeIntermediateResults?: boolean;
		webhookUrl?: string;
		timeout?: number;
	};
}
