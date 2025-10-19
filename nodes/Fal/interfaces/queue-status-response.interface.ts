import { QueueStatus } from '../enums';

export interface QueueStatusResponse {
	status: QueueStatus;
	response_url?: string;
	logs?: Array<{
		message: string;
		timestamp: string;
		level: string;
	}>;
	metrics?: {
		inference_time?: number;
	};
}
