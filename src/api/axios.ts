import axios, {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

const PATH = import.meta.env.VITE_API_SERVER_URL as string;

type RefreshTokenResponse = {
    access_token: string;
    refresh_token: string;
}
export interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    __isRetrying?: boolean;
    skipAuthRefresh?: boolean;
}
export const api: AxiosInstance = axios.create({
    baseURL: PATH,
});

const refreshTokenApi = async (): Promise<string> => {
    const previousRefreshToken = localStorage.getItem('refresh_token');

    if (!previousRefreshToken) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw new Error('No refresh token found');
    }

    const response: AxiosResponse<RefreshTokenResponse> = await api.post(
        '/api/auth/refresh',
        {
            token: previousRefreshToken,
        },
    );
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token, refresh_token } = response.data;

    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);

    return access_token;
};

api.interceptors.request.use(
    (config: CustomAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            (config.headers as AxiosHeaders)['Authorization'] = `Bearer ${ token }`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error),
);

let isRefreshing = false;
let failedQueue: Array<(accessToken: string) => void> = [];

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

            return new Promise((resolve, reject) => {
                failedQueue.push((newAccessToken: string) => {
                    (originalRequest.headers as AxiosHeaders)['Authorization'] =
                        `Bearer ${ newAccessToken }`;
                    resolve(api(originalRequest));
                });

                if (!isRefreshing) {
                    isRefreshing = true;
                    refreshTokenApi()
                        .then((newAccessToken) => {
                            api.defaults.headers['Authorization'] =
                                `Bearer ${ newAccessToken }`;
                            failedQueue.forEach((cb) => cb(newAccessToken));
                            failedQueue = [];
                        })
                        .catch((err) => {
                            failedQueue = [];
                            if (err instanceof Error) {
                                reject(err);
                            } else {
                                reject(new Error(JSON.stringify(err)));
                            }
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
