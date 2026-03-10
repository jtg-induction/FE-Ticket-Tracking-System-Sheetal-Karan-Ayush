import { handleApiError } from "api/apiErrorHandling/handleApiError";

import { api } from "@api";
import { AuthResponse, authResponseSchema } from "@features/auth";

import { type SignupInput } from "./signup.types";


/**
 * Signs up a new user by sending their information (name, email, password, avatarID) to the authentication API.
 *
 * This function takes the `SignupInput` data, sends a POST request to the `/api/auth/signup` endpoint,
 * and returns the parsed `AuthResponse` if the server response is valid. If the response does not match
 * the expected schema or an error occurs during the API call, an error is thrown and handled by the
 * `handleApiError` function.
 *
 * @param data - The signup input data containing the user's name, email, password and avatarID.
 * @returns A promise that resolves to the `AuthResponse` object containing authentication details.
 * 
 * @throws Will throw an error if the server response is invalid or if an error occurs during the API call.
 */

export const signupUser = async (data: SignupInput): Promise<AuthResponse> => {
    try {
        const payload = {
            name: data.name, email: data.email, password: data.password, avatar_id: 1,
        }
        const response = await api.post("/api/auth/signup", payload);
        const parsed = authResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error("Invalid server response ");
        }
        return parsed.data
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
