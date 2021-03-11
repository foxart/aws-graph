import * as sinon from 'sinon';
// @ts-ignore
import { ResponseService } from './response.service';

describe('service/response', () => {
	describe('ok()', () => {
		it('Should call ResponseService.response with status 200 and data', () => {
			const testData = {
				body: 'test',
			};
			const expectedResponse = 'test';
			const response = sinon.stub(ResponseService, 'response').returns('test');
			const actualResponse = ResponseService.ok(testData);
			expect(actualResponse).toEqual(expectedResponse);
			expect(response.callCount).toEqual(1);
			expect(response.getCall(0).args).toEqual([200, testData]);
			response.restore();
		});
	});
	describe('notFound()', () => {
		it('Should call ResponseService.response with status 404 and data', () => {
			const testData = {
				body: 'test',
			};
			const expectedResponse = 'test';
			const response = sinon.stub(ResponseService, 'response').returns('test');
			const actualResponse = ResponseService.notFound(testData);
			expect(actualResponse).toEqual(expectedResponse);
			expect(response.callCount).toEqual(1);
			expect(response.getCall(0).args).toEqual([404, testData]);
			response.restore();
		});
	});
	describe('internal()', () => {
		it('Should call ResponseService.response with status 500 and data', () => {
			const testData = {
				body: 'test',
			};
			const expectedResponse = 'test';
			const response = sinon.stub(ResponseService, 'response').returns('test');
			const actualResponse = ResponseService.internal(testData);
			expect(actualResponse).toEqual(expectedResponse);
			expect(response.callCount).toEqual(1);
			expect(response.getCall(0).args).toEqual([500, testData]);
			response.restore();
		});
	});
	describe('response()', () => {
		it('Should response with stringified body, customHeader and status 200', () => {
			const expectedResponse = {
				body: JSON.stringify({
					test: 'name',
				}),
				headers: {
					'Access-Control-Allow-Credentials': true,
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
					'test-header': 'test-header',
				},
				isBase64Encoded: false,
				statusCode: 200,
			};
			const actualResponse = ResponseService.response(200, {
				headers: {
					'test-header': 'test-header',
				},
				body: {
					test: 'name',
				},
			});
			expect(actualResponse).toEqual(expectedResponse);
		});
		it('Should response with emptyString when no body pass', () => {
			const expectedResponse = {
				body: '',
				headers: {
					'Access-Control-Allow-Credentials': true,
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
				},
				isBase64Encoded: false,
				statusCode: 200,
			};
			const actualResponse = ResponseService.response(200, {});
			expect(actualResponse).toEqual(expectedResponse);
		});
		it('Should response with emptyString when no body is empty string', () => {
			const expectedResponse = {
				body: '',
				headers: {
					'Access-Control-Allow-Credentials': true,
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
				},
				isBase64Encoded: false,
				statusCode: 200,
			};
			const actualResponse = ResponseService.response(200, {
				body: '',
			});
			expect(actualResponse).toEqual(expectedResponse);
		});
		it('Should response with passed string', () => {
			const expectedResponse = {
				body: 'test',
				headers: {
					'Access-Control-Allow-Credentials': true,
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
				},
				isBase64Encoded: false,
				statusCode: 200,
			};
			const actualResponse = ResponseService.response(200, {
				body: 'test',
			});
			expect(actualResponse).toEqual(expectedResponse);
		});
		it('Should response if no data pass', () => {
			const expectedResponse = {
				body: '',
				headers: {
					'Access-Control-Allow-Credentials': true,
					'Access-Control-Allow-Origin': '*',
					'Content-Type': 'application/json',
				},
				isBase64Encoded: false,
				statusCode: 200,
			};
			const actualResponse = ResponseService.response(200);
			expect(actualResponse).toEqual(expectedResponse);
		});
	});
});
