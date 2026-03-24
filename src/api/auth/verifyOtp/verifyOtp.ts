import { api } from '@api';
import { handleApiError } from '@api/apiErrorHandling';
import { type AuthResponse, authResponseSchema } from '@features/auth';

import { OtpInput } from './verifyOtp.types';

/**
 * Verifies the OTP (One Time Password) provided by the user.
 *
 * This function sends the provided `email` and `otp` to the backend API (`/api/auth/verify-email`)
 * to validate the OTP. If the server responds with a valid authentication response, the function
 * returns an `AuthResponse` object. If the response does not match the expected schema or if
 * an error occurs, the function throws an appropriate error.
 *
 * @param data - An object containing the `email` (string) and `otp` (string) fields.
 * @returns A promise that resolves to the `AuthResponse` object upon successful verification.
 * @throws Will throw an error if the server response is invalid or if an API request error occurs.
 */

export const verifyOtp = async (payload: OtpInput): Promise<AuthResponse> => {
    try {
        const response = await api.post('/api/auth/verify-email', payload);
        const parsed = authResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
