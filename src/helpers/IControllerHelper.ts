enum EStatusCode {
	OK = 200,
	NOT_FOUND = 404,
	INTERNAL_SERVER_ERROR = 500,
}

interface IBody {
	[key: string]: any;
}

interface IReqPath {
	[key: string]: string;
}

interface IReqQuery {
	[key: string]: string;
}

interface IReq<T> {
	body?: IBody;
	pathParameters?: IReqPath;
	queryStringParameters?: IReqQuery;
}

interface IResHeaders {
	[key: string]: string;
}

interface IRes<T> {
	statusCode: EStatusCode;
	body?: IBody | string;
	headers?: IResHeaders;
	isBase64Encoded?: boolean;
}

export { EStatusCode, IReq, IReqPath, IReqQuery, IBody, IResHeaders, IRes };
