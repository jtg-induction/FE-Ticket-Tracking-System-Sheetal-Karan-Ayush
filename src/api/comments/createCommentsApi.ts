import { handleApiError } from "@api/apiErrorHandling";
import { api } from "@api/axios";
import { CommentResponse, commentResponseSchema, CreateCommentFormData } from "@features/comments/createComment/createComment.schema";

/**
 * Creates a new comment for a specific ticket within a project.
 *
 * This function sends a POST request to the backend API to create a comment,
 * validates the response using a Zod schema, and returns the parsed result.
 *
 * @param data - The payload required to create a comment, including:
 * - `project_key`: Unique identifier for the project
 * - `ticket_key`: Unique identifier for the ticket
 * - Other comment-related fields (e.g., content)
 *
 * @returns A promise that resolves to a validated {@link CommentResponse}
 *
 * @throws Will throw an error if:
 * - The API response does not match the expected schema
 * - The API request fails (handled via {@link handleApiError})
 */
export const createComment = async (
    data: CreateCommentFormData,
): Promise<CommentResponse> => {
    try {
        const response = await api.post(
            `/project/${data.project_key}/ticket/${data.ticket_key}/comments`,
            data,
        );
        const parsed = commentResponseSchema.safeParse(response.data);

        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
