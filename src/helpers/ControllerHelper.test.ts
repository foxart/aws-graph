import * as sinon from 'sinon';
import { Context } from 'aws-lambda';
import { ControllerHelper } from './ControllerHelper';
import { EStatusCode, IReq } from './IControllerHelper';

class Controller extends ControllerHelper {
	public testPath() {
		return this.getPath;
	}

	public testQuery() {
		return this.getQuery;
	}

	public testBody() {
		return this.getBody;
	}

	public testContext() {
		return this.getContext;
	}
}

describe('helpers/controller.helper', () => {
	const controller = new Controller();
	const headers = {
		'Content-Type': 'application/json',
	};
	const event: IReq<any> = {
		pathParameters: {
			id: '1',
		},
		queryStringParameters: {
			search: 'search',
		},
		body: {
			field1: 'value1',
			field2: 'value2',
		},
	};
	const context: Context = {
		awsRequestId: 'id',
		logGroupName: '/aws/lambda/test',
		logStreamName: `${(new Date()).toLocaleDateString('en-US')}/[HEAD]123abc`,
		functionName: 'test',
		functionVersion: 'HEAD',
		callbackWaitsForEmptyEventLoop: false,
		invokedFunctionArn: 'local',
		memoryLimitInMB: '1024',
		getRemainingTimeInMillis: () => 100,
		done: () => 'done',
		fail: () => 'fail',
		succeed: () => 'succeed',
	};
	const data = {
		a: 1,
		b: 2,
	};
	beforeAll(() => {
		sinon.stub(console, 'log');
	});
	afterAll(() => {
		(<any>console.log).restore();
	});
	describe('methods', () => {
		it('Should call ok()', () => {
			const expected = {
				headers,
				statusCode: EStatusCode.OK,
				body: JSON.stringify(data),
			};
			const res = controller.res.ok(data);
			expect(res).toEqual(expected);
		});
		it('Should call notFound()', () => {
			const expected = {
				headers,
				statusCode: EStatusCode.NOT_FOUND,
				body: JSON.stringify(data),
			};
			const res = controller.res.notFound(data);
			expect(res).toEqual(expected);
		});
		it('Should call serverError(error)', () => {
			const error = new Error('error');
			const expected = {
				headers,
				statusCode: EStatusCode.INTERNAL_SERVER_ERROR,
				body: JSON.stringify({
					error: {
						name: error.name,
						message: error.message,
					},
				}),
			};
			const res = controller.res.serverError(error);
			expect(res).toEqual(expected);
		});
	});
	describe('methods branches', () => {
		it('Should call ok() -> empty', () => {
			const expected = {
				headers,
				statusCode: EStatusCode.OK,
				body: null,
			};
			const res = controller.res.ok(undefined);
			expect(res).toEqual(expected);
		});
		it('Should call serverError() wrongly', () => {
			const expected = {
				headers,
				statusCode: EStatusCode.INTERNAL_SERVER_ERROR,
				body: JSON.stringify({
					error: data,
				}),
			};
			const res = controller.res.serverError(data);
			expect(res).toEqual(expected);
		});
		it('Should call serverError() locally', () => {
			process.env.IS_LOCAL = 'true';
			const error = new Error('error');
			const expected = {
				headers,
				statusCode: EStatusCode.INTERNAL_SERVER_ERROR,
				body: JSON.stringify({
					error: {
						name: error.name,
						message: error.message,
					},
				}),
			};
			const res = controller.res.serverError(error);
			expect(res).toEqual(expected);
			process.env.IS_LOCAL = undefined;
		});
	});
	describe('extract event', () => {
		it('Should call getPath', () => {
			const res = controller.testPath.call(this, event);
			expect(res).toEqual(event.pathParameters);
		});
		it('Should call getQuery', () => {
			const res = controller.testQuery.call(this, event);
			expect(res).toEqual(event.queryStringParameters);
		});
		it('Should call getBody', () => {
			const res = controller.testBody.call(this, event);
			expect(res).toEqual(event.body);
		});
		it('Should call getBody', () => {
			const res = controller.testContext.call(this, event, context);
			expect(res).toEqual(context);
		});
	});
	describe('extract event branches', () => {
		it('Should call getPath -> empty', () => {
			const res = controller.testPath.call(this, {});
			expect(res).toEqual({});
		});
		it('Should call getQuery -> empty', () => {
			const res = controller.testQuery.call(this, {});
			expect(res).toEqual({});
		});
		it('Should call getBody -> empty', () => {
			const res = controller.testBody.call(this, {});
			expect(res).toEqual(undefined);
		});
	});
});
