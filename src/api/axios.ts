import axios, {
    AxiosError,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

const PATH = import.meta.env.VITE_API_SERVER_URL as string;

export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    __isRetrying?: boolean;
    skipAuthRefresh?: boolean;
}

export const api: AxiosInstance = axios.create({
    baseURL: PATH,
    withCredentials: true,
});


const refreshTokenApi = async (): Promise<void> => {
    try {
        await api.post('/api/auth/refresh', {}, {
            skipAuthRefresh: true
        } as CustomAxiosRequestConfig);
    } catch (error) {
        throw error;
    }
};

api.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => config,
    (error: AxiosError) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<() => void> = [];

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as CustomAxiosRequestConfig;
        const status = error.response?.status ?? null;

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest.__isRetrying &&
            !originalRequest.skipAuthRefresh
        ) {
            originalRequest.__isRetrying = true;

            return new Promise((resolve) => {
                failedQueue.push(() => {
                    resolve(api(originalRequest));
                });

                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshTokenApi()
                        .then(() => {
                            failedQueue.forEach((cb) => cb());
                            failedQueue = [];
                        })
                        .catch((err: unknown) => {
                            failedQueue = [];

                            const errorObject = err instanceof Error
                                ? err
                                : new Error(typeof err === 'string' ? err : 'Authentication Refresh Failed');

                            return Promise.reject(errorObject);
                        })
                        .finally(() => {
                            isRefreshing = false;
                        });
                }
            });
        }

        return Promise.reject(error);
    },
);
