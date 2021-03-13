interface IItemsRequest {
	subject: string;
	text: string;
}

interface IItemsResponse {
	Id: string;
	order: number;
	datetime: Date;
	subject: string;
	text: string;
}

export { IItemsRequest, IItemsResponse };
