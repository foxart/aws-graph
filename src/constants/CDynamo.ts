import { IDynamoConfig } from '../helpers';

const CTables = {
	items: process.env.DYNAMO_GRAPH_ITEMS_TABLE,
};
const CDynamoItemsConfig: IDynamoConfig = {
	table: CTables.items,
	idAlphabet: '1234567890-abcdefghijklmnopqrstuvwxyz_ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	idLength: 16,
};
export { CDynamoItemsConfig };
