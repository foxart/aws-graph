import { APIGatewayProxyResult } from 'aws-lambda';
import { GraphService, IGraphRequest, IGraphResponse } from '../../services';
import { ControllerHelper } from '../../helpers';

export class GraphController extends ControllerHelper {
	public service: GraphService;

	constructor() {
		super();
		this.service = new GraphService(process.env.AWS_GRAPH_TABLE);
	}

	public list = async (event, context) => {
		const result: IGraphResponse[] = await this.service.list();
		return this.response.ok<APIGatewayProxyResult>({
			body: result,
		});
	};
	public create = async (event, context) => {
		const data: IGraphRequest = this.request.body(event);
		const result = await this.service.create(data);
		return this.response.ok<APIGatewayProxyResult>({
			body: result,
		});
	};
	public remove = async (event, context) => {
		const { id } = this.request.path(event);
		const result = await this.service.remove(id);
		return this.response.ok<APIGatewayProxyResult>({
			body: result,
		});
	};
}
