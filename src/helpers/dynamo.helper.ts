import * as AWS from 'aws-sdk';

class DynamoHelper {
	private table: string;

	constructor(table: string) {
		this.table = table;
	}

	public async scan(params) {
		const dynamoDb = new AWS.DynamoDB.DocumentClient();
		return dynamoDb.scan({
			TableName: this.table,
			...params,
		}).promise();
	}

	public async query(params) {
		const dynamoDb = new AWS.DynamoDB.DocumentClient();
		return dynamoDb.query({
			TableName: this.table,
			...params,
		}).promise();
	}

	public async put(params) {
		const dynamoDb = new AWS.DynamoDB.DocumentClient();
		return dynamoDb.put({
			TableName: this.table,
			...params,
		}).promise();
	}

	public async delete(params) {
		const dynamoDb = new AWS.DynamoDB.DocumentClient();
		return dynamoDb.delete({
			TableName: this.table,
			...params,
		}).promise();
	}
}

export { DynamoHelper };
