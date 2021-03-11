export interface IRequest<T> {
	body?: T;
	pathParameters?: {
		[name: string]: string;
	};
	queryStringParameters?: {
		[name: string]: string;
	};
}

export interface IResponse<T> {
	body?: T;
	headers?: {
		[name: string]: string;
	};
	isBase64Encoded?: boolean;
}
