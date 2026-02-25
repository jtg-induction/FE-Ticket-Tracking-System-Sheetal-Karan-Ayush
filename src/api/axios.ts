import axios, { AxiosInstance} from 'axios';

const PATH = import.meta.env.VITE_API_SERVER_URL as string;

export const api: AxiosInstance = axios.create({
    baseURL: PATH,
});
