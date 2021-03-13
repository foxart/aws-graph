import { IItemsRequest, IItemsResponse } from './IItemsService';
import { asort, DynamoHelper, IDynamoConfig } from '../../helpers';

export class ItemsService {
	private static _instance: ItemsService;
	private db: DynamoHelper;

	private constructor(config: IDynamoConfig) {
		this.db = new DynamoHelper(config);
	}

	public static getInstance(config: IDynamoConfig): ItemsService {
		return this._instance || (this._instance = new ItemsService(config));
	}

	public async list(): Promise<IItemsResponse[]> {
		const result = await this.db.scan({});
		return <IItemsResponse[]>asort(result, 'order');
	}

	public async query(Id: string): Promise<IItemsResponse[]> {
		const params = {
			KeyConditionExpression: '#Id = :Id',
			ExpressionAttributeNames: {
				'#Id': 'Id',
			},
			ExpressionAttributeValues: {
				':Id': Id,
			},
			// ProjectionExpression: 'subscriptionId',
		};
		const result = await this.db.query(params);
		return <IItemsResponse[]>asort(result, 'order');
	}

	public async create(data: IItemsRequest): Promise<any> {
		const items = await this.list();
		const last = items.pop();
		const id = this.db.generateId;
		const params = {
			Item: {
				...data,
				Id: id,
				datetime: new Date().toISOString(),
				order: last?.order + 1 || 1,
			},
		};
		await this.db.put(params);
		return { id };
	}

	public async delete(id: string): Promise<any> {
		const items = await this.query(id);
		const last = items.pop();
		if (!last) {
			throw new Error(`record not found: ${id}`);
		}
		const params = {
			Key: {
				Id: id,
				order: last.order,
			},
		};
		await this.db.delete(params);
		return { id };
	}
}
