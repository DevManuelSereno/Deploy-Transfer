export * from "./Brand.schema";
export * from "./Category.schema";
export * from "./Classification.schema";
export * from "./Company.schema";
export * from "./Documentation.schema";
export * from "./Gas.schema";
export * from "./GasStation.schema";
export * from "./GasSupply.schema";
export * from "./Occurrence.schema";
export * from "./Seriousness.schema";
export * from "./Status.schema";
export * from "./Vehicle.schema";

export interface GetData {
	url: string;
	query?: string;
	id?: number;
	signal?: AbortSignal;
}

export interface PostData<TForm> {
	url: string;
	data: TForm;
	signal?: AbortSignal;
}
export interface PutData<TForm> {
	url: string;
	data: TForm;
	id: number;
	signal?: AbortSignal;
}
export interface DeleteData {
	id: number;
	url: string;
	signal?: AbortSignal;
}

export interface DefaultAPIRequest {
	googleId?: string;
}

export interface DefaultAPI {
	id: number;
	createdAt: string;
	updateAt: string;
}
