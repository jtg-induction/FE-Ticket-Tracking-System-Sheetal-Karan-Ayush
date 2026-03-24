import { AxiosHeaders } from 'axios';

import { CustomAxiosRequestConfig } from '@api/axios';

export const config: CustomAxiosRequestConfig = {
    skipAuthRefresh: true,
    headers: new AxiosHeaders(),
};
