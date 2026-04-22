import { handleApiError } from "api/apiErrorHandling/handleApiError";

import { api } from "@api";
import { AuthResponse, authResponseSchema } from "@features/auth";
import { LoginInput } from "@features/auth/loginSchema";

import { config } from "../constants";

/**
 * Logs in a user by sending their email and password to the authentication API.
 * 
 * This function takes the `LoginInput` data (email and password), sends a POST request
 * to the API, and returns a parsed `AuthResponse`. If the response does not match the
 * expected schema or if there is any error during the API call, an error is thrown and handled
 * by the `handleApiError` function.
 *
 * @param data - The login input data containing the user's email and password.
 * @returns A promise that resolves to the `AuthResponse` object, containing authentication details.
 * 
 * @throws Will throw an error if the server response is invalid or if an error occurs during the API call.
 */

export const loginUser = async (payload: LoginInput): Promise<AuthResponse> => {
    try {
        const response = await api.post("/api/auth/login", payload, config);        
        const parsed = authResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error("Invalid server response ");
        }
        return parsed.data
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
