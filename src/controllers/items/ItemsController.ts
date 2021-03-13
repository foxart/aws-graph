import { IItemsRequest, IItemsResponse, ItemsService } from '../../services';
import { ControllerHelper } from '../../helpers';
import { CDynamoItemsConfig } from '../../constants/CDynamo';

class ItemsController extends ControllerHelper {
	public service: ItemsService;

	constructor() {
		super();
		this.service = ItemsService.getInstance(CDynamoItemsConfig);
	}

	public async list() {
		const { id } = this.getPath;
		const result: IItemsResponse[] = await this.service.list();
		return this.res.ok(result);
	}

	public async create() {
		const data = <IItemsRequest>this.getBody;
		const result = await this.service.create(data);
		return this.res.ok(result);
	}

	public async delete() {
		const { id } = this.getPath;
		try {
			const result = await this.service.delete(id);
			return this.res.ok(result);
		} catch (e) {
			return this.res.serverError(e);
		}
	}
}

export { ItemsController };
