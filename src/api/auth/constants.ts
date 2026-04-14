import { AxiosRequestConfig } from "axios";

export const config: AxiosRequestConfig & { skipAuthRefresh?: boolean } = {
    skipAuthRefresh: true,
};
