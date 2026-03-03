import axios, {
    AxiosError,
    AxiosHeaders,
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';

const PATH = import.meta.env.VITE_API_SERVER_URL as string;

type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
}

export const api: AxiosInstance = axios.create({
    baseURL: PATH,
});

const refreshTokenApi = async (): Promise<string> => {
    const previousRefreshToken = localStorage.getItem('refresh_token');

    if (!previousRefreshToken) {
        throw new Error('No refresh token found');
    }

    const response: AxiosResponse<RefreshTokenResponse> = await api.post(
        '/api/auth/refresh',
        {
            refresh_token: previousRefreshToken,
        },
    );

    const { accessToken, refreshToken } = response.data;

    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);

    return accessToken;
};

api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            (config.headers as AxiosHeaders)['Authorization'] = `Bearer ${token}`;
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
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            __isRetrying?: boolean;
        };;
        const status = error.response ? error.response.status : null;

        if (status === 401 &&  originalRequest && !originalRequest.__isRetrying) {
              originalRequest.__isRetrying = true;

            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const newAccessToken = await refreshTokenApi();

                    api.defaults.headers['Authorization'] =
                        `Bearer ${newAccessToken}`;

                    failedQueue.forEach((cb) => cb(newAccessToken));
                    failedQueue = [];
                } finally {
                    isRefreshing = false;
                }
            }

            return new Promise((resolve) => {
                failedQueue.push((newAccessToken: string) => {
                    (originalRequest.headers as AxiosHeaders)['Authorization'] =
                        `Bearer ${newAccessToken}`;
                    resolve(api(originalRequest));
                });
            });
        }

        return Promise.reject(error);
    },
);
