import { AxiosError } from 'axios';
import { ZodError } from 'zod';

import type { ApiErrorResponse } from './handleApiError.types';

export const handleApiError = (error: unknown): never => {
    if(error instanceof ZodError) {
        throw new Error("Response Validation failed");
    }
    if(error instanceof AxiosError) {
        const errorMsg = (error.response?.data as ApiErrorResponse)?.detail;
        throw new Error(errorMsg ?? "Request Failed");
    }
    throw error;
}
