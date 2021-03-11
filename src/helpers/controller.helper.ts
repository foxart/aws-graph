import { APIGatewayProxyResult } from 'aws-lambda';
import { IRequest, IResponse } from './controller.helper.interface';

class Request {
	private static _instance: Request;

	static get Instance(): Request {
		return this._instance || (this._instance = new Request());
	}

	private constructor() {
	}

	public path<T>(event: IRequest<T>) {
		console.log('[request path]', event.pathParameters);
		return event.pathParameters;
	}

	public query<T>(event: IRequest<T>) {
		console.log('[request query]', event.queryStringParameters);
		return event.queryStringParameters;
	}

	public body<T>(event: IRequest<T>) {
		console.log('[request body]', event.body);
		try {
			return JSON.parse(<any>event.body);
		} catch (e) {
			return event.body;
		}
	}
}

class Response {
	private static _instance: Response;

	static get Instance(): Response {
		return this._instance || (this._instance = new Response());
	}

	private constructor() {
	}

	private static isString(x: any) {
		return Object.prototype.toString.call(x) === '[object String]';
	}

	private static response<T>(statusCode: number, {
		headers = {},
		body,
		// isBase64Encoded = false,
	}: IResponse<T> = {}): APIGatewayProxyResult {
		return {
			statusCode,
			// isBase64Encoded,
			headers: {
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true,
				...headers,
			},
			body: body && !Response.isString(body) ? JSON.stringify(body) : ((<any>body) || ''),
		};
	}

	public ok<T>(data: IResponse<T>): APIGatewayProxyResult {
		return Response.response<T>(200, data);
	}

	public notFound<T>(data: IResponse<T>): APIGatewayProxyResult {
		return Response.response<T>(404, data);
	}

	public internal<T>(data: IResponse<T>): APIGatewayProxyResult {
		return Response.response<T>(500, data);
	}
}

export class ControllerHelper {
	public _response: Response;
	public _request: Request;

	constructor() {
		this._response = Response.Instance;
		this._request = Request.Instance;
	}

	public get response(): Response {
		// console.log('response', this._response);
		return this._response;
	}

	public get request(): Request {
		// console.log('request', this._request);
		return this._request;
	}
}
