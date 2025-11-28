import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
	headers: {
		"ngrok-skip-browser-warning": "1",
	},
});

export default api;
