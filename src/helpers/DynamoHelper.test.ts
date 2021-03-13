import * as sinon from 'sinon';
import * as AWS from 'aws-sdk';
import { DynamoHelper } from './DynamoHelper';
import { IDynamoConfig } from './IDynamoHelper';

describe('helpers/dynamo.helper', () => {
	const deleteDb: any = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'delete');
	const putDb: any = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'put');
	const queryDb: any = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'query');
	const scanDb: any = sinon.stub(AWS.DynamoDB.DocumentClient.prototype, 'scan');
	const config: IDynamoConfig = {
		table: 'my-table',
		idLength: 32,
		idAlphabet: '1234567890-abcdefghijklmnopqrstuvwxyz_ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	};
	const dynamo = new DynamoHelper(config);
	const data = {
		id: 'some-id',
		text: 'lorem ipsum dolor',
		order: 1,
	};
	const params = {
		param1: 'value1',
		param2: 'value2',
	};
	afterAll(() => {
		deleteDb.restore();
		putDb.restore();
		queryDb.restore();
		scanDb.restore();
	});
	afterEach(() => {
		deleteDb.resetHistory();
		putDb.resetHistory();
		queryDb.resetHistory();
		scanDb.resetHistory();
	});
	describe('DynamoDB', () => {
		it('Should call generateId', async () => {
			const escapeRegex = string => string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
			const regexAlphabet = escapeRegex(config.idAlphabet.split('').join(','));
			const response = await dynamo.generateId;
			expect(response).toMatch(new RegExp(`^[${regexAlphabet}]{${config.idLength}}$`));
		});
		it('Should call delete()', async () => {
			deleteDb.returns({ promise: () => Promise.resolve({}) });
			const response = await dynamo.delete(params);
			expect(response).toEqual({});
			expect(deleteDb.getCall(0).args).toEqual([{
				...params,
				TableName: config.table,
			}]);
			expect(deleteDb.callCount).toEqual(1);
		});
		it('Should call put()', async () => {
			putDb.returns({ promise: () => Promise.resolve(data) });
			const response = await dynamo.put(params);
			expect(response).toEqual(data);
			expect(putDb.getCall(0).args).toEqual([{
				...params,
				TableName: config.table,
			}]);
			expect(putDb.callCount).toEqual(1);
		});
		it('Should call query()', async () => {
			queryDb.returns({ promise: () => Promise.resolve({ Items: [data] }) });
			const response = await dynamo.query(params);
			expect(response).toEqual([data]);
			expect(queryDb.getCall(0).args).toEqual([{
				...params,
				TableName: config.table,
			}]);
			expect(queryDb.callCount).toEqual(1);
		});
		it('Should call scan()', async () => {
			scanDb.returns({ promise: () => Promise.resolve({ Items: [data] }) });
			const response = await dynamo.scan(params);
			expect(response).toEqual([data]);
			expect(scanDb.getCall(0).args).toEqual([{
				...params,
				TableName: config.table,
			}]);
			expect(scanDb.callCount).toEqual(1);
		});
	});
	describe('DynamoDB branches', () => {
		it('Should call query() empty result', async () => {
			queryDb.returns({ promise: () => Promise.resolve({}) });
			const response = await dynamo.query(params);
			expect(response).toEqual([]);
			expect(queryDb.getCall(0).args).toEqual([{
				...params,
				TableName: config.table,
			}]);
			expect(queryDb.callCount).toEqual(1);
		});
		it('Should call scan() empty result', async () => {
			scanDb.returns({ promise: () => Promise.resolve({}) });
			const response = await dynamo.scan(params);
			expect(response).toEqual([]);
			expect(scanDb.getCall(0).args).toEqual([{
				...params,
				TableName: config.table,
			}]);
			expect(scanDb.callCount).toEqual(1);
		});
	});
});
