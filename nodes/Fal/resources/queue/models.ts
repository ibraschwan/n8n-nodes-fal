export enum QueueOperation {
	Submit = 'submit',
	GetStatus = 'getStatus',
	GetResponse = 'getResponse',
	Cancel = 'cancel',
	StreamStatus = 'streamStatus',
}

export type QueueStatusType = 'IN_QUEUE' | 'IN_PROGRESS' | 'COMPLETED';

export type CancellationStatusType = 'CANCELLATION_REQUESTED' | 'ALREADY_COMPLETED';

export interface QueueSubmitParams {
	modelEndpoint: string;
	inputParameters: string;
	options?: {
		webhookUrl?: string;
	};
}

export interface QueueStatusParams {
	requestId: string;
	modelEndpoint: string;
	options?: {
		includeLogs?: boolean;
	};
}

export interface QueueResponseParams {
	requestId: string;
	modelEndpoint: string;
}

export interface QueueCancelParams {
	requestId: string;
	modelEndpoint: string;
}

export interface QueueStreamStatusParams {
	requestId: string;
	modelEndpoint: string;
	options?: {
		includeLogs?: boolean;
	};
}

export interface QueueSubmitResponse {
	request_id: string;
	response_url: string;
	status_url: string;
	cancel_url: string;
}

export interface RequestLog {
	message: string;
	level: 'STDERR' | 'STDOUT' | 'ERROR' | 'INFO' | 'WARN' | 'DEBUG';
	source?: string;
	timestamp: string;
}

export interface QueueStatusResponseInQueue {
	status: 'IN_QUEUE';
	queue_position: number;
	response_url: string;
}

export interface QueueStatusResponseInProgress {
	status: 'IN_PROGRESS';
	logs?: RequestLog[];
	response_url: string;
}

export interface QueueStatusResponseCompleted {
	status: 'COMPLETED';
	logs?: RequestLog[];
	response_url: string;
}

export type QueueStatusResponse =
	| QueueStatusResponseInQueue
	| QueueStatusResponseInProgress
	| QueueStatusResponseCompleted;

export interface QueueResponseData {
	status: 'COMPLETED';
	logs?: RequestLog[];
	response: Record<string, any>;
}

export interface QueueCancelResponse {
	status: CancellationStatusType;
}
