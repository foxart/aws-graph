import { customAlphabet } from 'nanoid';
import { IGraphRequest, IGraphResponse } from './graph.interface';
import { asort, DynamoHelper } from '../../helpers';

const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 16);

export class GraphService {
	private db: DynamoHelper;

	constructor(table) {
		this.db = new DynamoHelper(table);
	}

	public async list(): Promise<IGraphResponse[]> {
		const { Items = [] } = await this.db.scan({});
		return <IGraphResponse[]>asort(Items, 'order');
	}

	public async query(Id: string): Promise<IGraphResponse[]> {
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
		const { Items = [] } = await this.db.query(params);
		return <IGraphResponse[]>asort(Items, 'order');
	}

	public async create(data: IGraphRequest): Promise<any> {
		const items = await this.list();
		const last = items.pop();
		const id = nanoid();
		const params = {
			Item: {
				...data,
				Id: id,
				datetime: new Date().toString(),
				order: last?.order + 1 || 1,
			},
		};
		await this.db.put(params);
		return { id };
	}

	public async remove(id: string): Promise<any> {
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
