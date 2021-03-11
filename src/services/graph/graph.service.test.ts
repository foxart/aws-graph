import * as sinon from 'sinon';
import * as AWS from 'aws-sdk';
import { GraphService } from './graph.service';
import { IGraphRequest, IGraphResponse } from '../graph';

describe('service/user-subscription', () => {
	const queryDb: any = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'query');
	const scanDb: any = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'scan');
	const putDb: any = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'put');
	const deleteDb: any = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'delete');
	const requestData: IGraphRequest = {
		// @ts-ignore
		subscriptionId: 'subscriptionId',
		plan: 100,
	};
	const queryData: IGraphResponse = {
		// @ts-ignore
		userId: 'userId',
		subscriptionId: 'subscriptionId',
		datetime: new Date(),
		order: 1,
	};
	const scanData1: IGraphResponse = {
		// @ts-ignore
		id: 'subscriptionId',
		title: 'title',
		data: {},
		order: 1,
	};
	const scanData2: IGraphResponse = {
		// @ts-ignore
		id: null,
		title: 'title',
		data: {},
		order: 1,
	};
	const now = new Date();
	sinon.useFakeTimers(now.getTime());
	afterAll(() => {
		scanDb.restore();
		queryDb.restore();
		putDb.restore();
		deleteDb.restore();
	});
	afterEach(() => {
		scanDb.resetHistory();
		queryDb.resetHistory();
		putDb.resetHistory();
		deleteDb.resetHistory();
	});
	describe('list()', () => {
		it('Should return User subscriptions list', async () => {
			scanDb.returns({ promise: () => Promise.resolve({ Items: [scanData1] }) } as any);
			queryDb.returns({ promise: () => Promise.resolve({ Items: [queryData] }) } as any);
			// @ts-ignore
			const response = await GraphService.list(queryData.userId);
			expect(queryDb.getCall(0).args).toEqual([{
				TableName: undefined,
				ExpressionAttributeNames: {
					'#userId': 'userId',
				},
				ExpressionAttributeValues: {
					':userId': 'userId',
				},
				KeyConditionExpression: '#userId = :userId',
			}]);
			// @ts-ignore
			const { subscriptionId, ...result } = queryData;
			expect(response).toEqual([{
				...result,
				subscription: scanData1,
			}]);
			expect(scanDb.callCount).toEqual(1);
			expect(queryDb.callCount).toEqual(1);
		});
		it('Should return empty list', async () => {
			queryDb.returns({ promise: () => Promise.resolve({ Items: undefined }) } as any);
			// @ts-ignore
			const response = await GraphService.list(queryData.userId);
			expect(queryDb.getCall(0).args).toEqual([{
				TableName: undefined,
				ExpressionAttributeNames: {
					'#userId': 'userId',
				},
				ExpressionAttributeValues: {
					':userId': 'userId',
				},
				KeyConditionExpression: '#userId = :userId',
			}]);
			expect(response).toEqual([]);
			expect(scanDb.callCount).toEqual(1);
			expect(queryDb.callCount).toEqual(1);
		});
	});
	describe('create()', () => {
		it('Should create User subscription', async () => {
			queryDb.returns({ promise: () => Promise.resolve({ Items: [] }) } as any);
			scanDb.returns({ promise: () => Promise.resolve({ Items: [scanData1] }) } as any);
			putDb.returns({ promise: () => Promise.resolve({}) } as any);
			// @ts-ignore
			const response = await GraphService.create(queryData.userId, requestData);
			const result = putDb.getCall(0).args[0];
			expect([result]).toEqual([{
				TableName: undefined,
				Item: {
					// @ts-ignore
					userId: queryData.userId,
					datetime: now.toString(),
					// @ts-ignore
					subscriptionId: requestData.subscriptionId,
					// @ts-ignore
					plan: requestData.plan,
					order: 1,
				},
			}]);
			expect(response).toEqual({});
			expect(queryDb.callCount).toEqual(1);
			expect(putDb.callCount).toEqual(1);
		});
		it('Should throw error', async () => {
			queryDb.returns({ promise: () => Promise.resolve({ Items: [queryData] }) } as any);
			scanDb.returns({ promise: () => Promise.resolve({ Items: [scanData2] }) } as any);
			putDb.returns({ promise: () => Promise.resolve({}) } as any);
			try {
				// @ts-ignore
				await GraphService.create(queryData.userId, requestData);
			} catch (e) {
				expect(e).toEqual(new Error('already subscribed'));
			}
			expect(queryDb.callCount).toEqual(1);
			expect(putDb.callCount).toEqual(0);
		});
	});
	describe('delete()', () => {
		it('Should delete User subscription', async () => {
			queryDb.returns({ promise: () => Promise.resolve({ Items: [queryData] }) } as any);
			scanDb.returns({ promise: () => Promise.resolve({ Items: [scanData1] }) } as any);
			deleteDb.returns({ promise: () => Promise.resolve({}) } as any);
			// @ts-ignore
			const response = await GraphService.remove(queryData.userId);
			const result = deleteDb.getCall(0).args[0];
			expect([result]).toEqual([{
				TableName: undefined,
				Key: {
					// @ts-ignore
					userId: queryData.userId,
					order: 1,
				},
			}]);
			expect(response).toEqual({});
			expect(queryDb.callCount).toEqual(1);
			expect(deleteDb.callCount).toEqual(1);
		});
		it('Should throw error', async () => {
			queryDb.returns({ promise: () => Promise.resolve({ Items: undefined }) } as any);
			scanDb.returns({ promise: () => Promise.resolve({ Items: [scanData2] }) } as any);
			deleteDb.returns({ promise: () => Promise.resolve({}) } as any);
			try {
				// @ts-ignore
				await GraphService.remove(queryData.userId);
			} catch (e) {
				expect(e).toEqual(new Error('not subscribed'));
			}
			expect(queryDb.callCount).toEqual(1);
			expect(deleteDb.callCount).toEqual(0);
		});
	});
});
