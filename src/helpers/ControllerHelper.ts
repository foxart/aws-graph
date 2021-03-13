import { APIGatewayProxyResult, Context } from 'aws-lambda';
import { EStatusCode, IBody, IReq, IReqPath, IReqQuery, IRes, IResHeaders } from './IControllerHelper';

class ControllerHelper {
	private _path: IReqPath;
	private _query: IReqQuery;
	private _body: IBody;
	private _context: Context;

	public constructor() {
		return this.proxy(this);
	}

	private static buildResponse<T>(statusCode: EStatusCode, body: IBody, headers?: IResHeaders): IRes<T> {
		return {
			statusCode,
			// isBase64Encoded,
			headers: {
				'Content-Type': 'application/json',
				// 	'Access-Control-Allow-Origin': '*',
				// 	'Access-Control-Allow-Credentials': true,
				...headers || null,
			},
			body: body ? JSON.stringify(body) : null,
		};
	}

	private get _res() {
		return {
			ok(data: IBody, headers?: IResHeaders): APIGatewayProxyResult {
				return <any>ControllerHelper.buildResponse(EStatusCode.OK, data, headers);
			},
			notFound(data: IBody, headers?: IResHeaders): APIGatewayProxyResult {
				return <any>ControllerHelper.buildResponse(EStatusCode.NOT_FOUND, data, headers);
			},
			serverError(data: IBody, headers?: IResHeaders): APIGatewayProxyResult {
				let body;
				if (data instanceof Error) {
					if (process.env.IS_LOCAL) {
						const PrettyError = require('pretty-error');
						console.log(new PrettyError().render(data));
					}
					body = {
						error: {
							name: data.name,
							message: data.message,
						},
					};
				} else {
					body = {
						error: data,
					};
				}
				return <any>ControllerHelper.buildResponse(EStatusCode.INTERNAL_SERVER_ERROR, body, headers);
			},
		};
	}

	private proxy(target) {
		const hook = <T>(callback, event: IReq<T>, context: Context) => {
			// console.log('HOOK', event, context);
			this._path = event.pathParameters || {};
			this._query = event.queryStringParameters || {};
			try {
				this._body = JSON.parse(<any>event.body);
			} catch (e) {
				this._body = event.body;
			}
			this._context = context;
			return callback.call(this);
		};
		const cache = new WeakMap();
		const handler = {
			get(target, key) {
				const value = Reflect.get(target, key);
				if (typeof value !== 'function') {
					return value;
				}
				if (!cache.has(value)) {
					// cache.set(value, value.bind(target));
					cache.set(value, hook.bind(target, value));
				}
				return cache.get(value);
			},
		};
		return new Proxy(target, handler);
	}

	public get getPath(): IReqPath {
		return this._path;
	}

	public get getQuery(): IReqQuery {
		return this._query;
	}

	public get getBody(): IBody {
		return this._body;
	}

	public get getContext(): IBody {
		return this._context;
	}

	public get res() {
		return this._res;
	}
}

export { ControllerHelper };
