export interface IGraphRequest {
	subject: string;
	text: string;
}

export interface IGraphResponse {
	Id: string;
	order: number;
	datetime: Date;
	subject: string;
	text: string;
}
