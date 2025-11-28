import type { AxiosError } from "axios";
import { toast } from "sonner";
import api from "@/lib/api";
import type { DeleteData, GetData, PostData, PutData } from "@/types/models";

/**
 * Função genérica para realizar requisições GET.
 * Parâmetros:
 * - url: endpoint da API
 * - query: parâmetros opcionais para consulta
 * - id: id opcional para buscar um item específico
 * - signal: controle de abortamento da requisição
 *
 * Tipos genéricos:
 * - TReturn: tipo esperado do retorno da API
 */
export const getData = async <TReturn>(val: GetData) => {
	const { url, query, id, signal } = val;
	const params = query ? `?${query}` : "";
	const idParam = id ? `/${id}` : "";
	const { data } = await api.get<TReturn>(`${url}${idParam}${params}`, {
		signal,
	});
	return data;
};

/**
 * Função genérica para realizar requisições POST.
 * Parâmetros:
 * - url: endpoint da API
 * - data: corpo da requisição (dados do formulário)
 * - signal: controle de abortamento da requisição
 *
 * Tipos genéricos:
 * - TReturn: tipo esperado do retorno da API
 * - TForm: tipo dos dados enviados no corpo da requisição
 */
export const postData = async <TReturn, TForm>(val: PostData<TForm>) => {
	const { url, data: dataForm, signal } = val;

	const isFormData =
		typeof FormData !== "undefined" && dataForm instanceof FormData;
	const dataRequest = isFormData ? dataForm : JSON.stringify(dataForm);

	const { data } = await api.post<TReturn>(url, dataRequest, {
		signal,
		headers: isFormData ? {} : { "Content-Type": "application/json" },
	});
	return data;
};

/**
 * Função genérica para realizar requisições PUT.
 * Parâmetros:
 * - url: endpoint da API
 * - id: identificador do recurso a ser atualizado
 * - data: corpo da requisição (dados do formulário)
 * - signal: controle de abortamento da requisição
 *
 * Tipos genéricos:
 * - TReturn: tipo esperado do retorno da API
 * - TForm: tipo dos dados enviados no corpo da requisição
 */
export const putData = async <TReturn, TForm>(val: PutData<TForm>) => {
	const { url, data: dataForm, id, signal } = val;
	const { data } = await api.put<TReturn>(`${url}/${id}`, dataForm, { signal });
	return data;
};

/**
 * Função genérica para realizar requisições DELETE.
 * Parâmetros:
 * - url: endpoint da API
 * - id: identificador do recurso a ser removido
 * - signal: controle de abortamento da requisição
 *
 * Tipos genéricos:
 * - TReturn: tipo esperado do retorno da API
 */
export const deleteData = async <TReturn>(val: DeleteData) => {
	const { url, id, signal } = val;
	const { data } = await api.delete<TReturn>(`${url}/${id}`, { signal });
	return data;
};

/**
 * Função para tratar erros de requisições e exibir mensagens no toast.
 * Parâmetros:
 * - error: erro retornado pela requisição {error: string; message: string; statusCode: number}
 * - message: mensagem personalizada opcional
 */
export const toastErrorsApi = (
	error: AxiosError<{ error: string; message: string; statusCode: number }>,
	message?: string,
) => {
	console.error(error);
	if (error?.response) {
		if (message) return toast.error(message);
		if (error.response?.data?.message)
			return toast.error(error.response?.data?.message);
	} else toast.error("Erro ao se comunicar com o servidor (erro desconhecido)");
};
