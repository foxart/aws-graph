import * as sinon from 'sinon';
import { GraphService } from '../../services';

describe('lambda/user-subscription', () => {
	const response = {
		headers: {
			'Access-Control-Allow-Credentials': true,
			'Access-Control-Allow-Origin': '*',
			'Content-Type': 'application/json',
		},
		isBase64Encoded: false,
		statusCode: 200,
	};
	const event = {
		requestContext: { authorizer: { claims: { 'cognito:username': 'UserId' } } },
	};
	// @ts-ignore
	const subscriptionList: any = sinon.stub(GraphService, 'list');
	// @ts-ignore
	const subscriptionCreate: any = sinon.stub(GraphService, 'create');
	// @ts-ignore
	const subscriptionDelete: any = sinon.stub(GraphService, 'remove');
	afterAll(() => {
		subscriptionCreate.restore();
		subscriptionList.restore();
		subscriptionDelete.restore();
	});
	afterEach(() => {
		subscriptionCreate.resetHistory();
		subscriptionList.resetHistory();
		subscriptionDelete.resetHistory();
	});
	describe('list()', () => {
		it('Should return User subscriptions list', async () => {
			subscriptionList.resolves([]);
			// @ts-ignore
			const result = await list(event, {});
			expect(subscriptionList.callCount).toEqual(1);
			expect(result).toEqual({
				...response,
				body: JSON.stringify([]),
			});
		});
	});
	describe('create()', () => {
		it('Should create User subscription', async () => {
			subscriptionCreate.resolves({});
			// @ts-ignore
			const result = await create(event, {});
			expect(subscriptionCreate.callCount).toEqual(1);
			expect(result).toEqual({
				...response,
				body: JSON.stringify({ success: true }),
			});
		});
		it('Should throw error on delete', async () => {
			subscriptionCreate.throws(new Error('error'));
			// @ts-ignore
			const result = await create(event, {});
			expect(subscriptionCreate.callCount).toEqual(1);
			expect(result).toEqual({
				...response,
				body: JSON.stringify({ message: 'error' }),
				statusCode: 500,
			});
		});
	});
	describe('delete()', () => {
		it('Should delete User subscription', async () => {
			subscriptionDelete.resolves({});
			// @ts-ignore
			const result = await deleteUserSubscription(event, {});
			expect(subscriptionDelete.callCount).toEqual(1);
			expect(result).toEqual({
				...response,
				body: JSON.stringify({ success: true }),
			});
		});
		it('Should throw error on delete', async () => {
			subscriptionDelete.throws(new Error('error'));
			// @ts-ignore
			const result = await deleteUserSubscription(event, {});
			expect(subscriptionDelete.callCount).toEqual(1);
			expect(result).toEqual({
				...response,
				body: JSON.stringify({ message: 'error' }),
				statusCode: 500,
			});
		});
	});
});
