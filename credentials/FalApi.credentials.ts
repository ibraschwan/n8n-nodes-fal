import type { Icon } from 'n8n-workflow';
import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class FalApi implements ICredentialType {
	name = 'falApi';
	displayName = 'Fal API';
	icon: Icon = 'file:fal-ai-logo.svg';
	documentationUrl = 'https://fal.ai/docs';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'The API key for Fal.ai. You can obtain one from your Fal.ai dashboard.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Key {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://queue.fal.run',
			url: '/fal-ai/fast-sdxl/requests',
			method: 'GET',
		},
	};
}
