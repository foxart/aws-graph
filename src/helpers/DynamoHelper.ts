import * as AWS from 'aws-sdk';
import { customAlphabet } from 'nanoid';
import { IDynamoConfig } from './IDynamoHelper';

class DynamoHelper {
	private _config: IDynamoConfig;

	constructor(config: IDynamoConfig) {
		this._config = config;
	}

	public get generateId() {
		// return customAlphabet(urlAlphabet, this._config.idLength)();
		return customAlphabet(this._config.idAlphabet, this._config.idLength)();
	}

	public async delete(params) {
		const dynamoDb = new AWS.DynamoDB.DocumentClient();
		return await dynamoDb.delete({
			...params,
			TableName: this._config.table,
		}).promise();
	}

	public async put(params) {
		const dynamoDb = new AWS.DynamoDB.DocumentClient();
		return await dynamoDb.put({
			...params,
			TableName: this._config.table,
		}).promise();
	}

	public async query(params) {
		const dynamoDb = new AWS.DynamoDB.DocumentClient();
		const { Items = [] } = await dynamoDb.query({
			...params,
			TableName: this._config.table,
		}).promise();
		return Items;
	}

	public async scan(params) {
		const dynamoDb = new AWS.DynamoDB.DocumentClient();
		const { Items = [] } = await dynamoDb.scan({
			...params,
			TableName: this._config.table,
		}).promise();
		return Items;
	}
}

export { DynamoHelper };
