import { handleApiError } from "@api/apiErrorHandling";
import { api } from "@api/axios";
import { UpdateCommentFormData } from "@features/comments/updateComment/updateComment.schema";

/**
 * Updates an existing comment by its ID.
 *
 * This function sends a PATCH request to the backend API to update
 * a specific comment with the provided data.
 *
 * @param data - The payload required to update a comment, including:
 * - `comment_id`: Unique identifier of the comment to update
 * - Other fields to be updated (e.g., content)
 *
 * @throws Will throw an error if:
 * - The API request fails (handled via {@link handleApiError})
 */
export const updateComment = async (
    data: UpdateCommentFormData,
) => {
    try {
        await api.patch(
            `/api/tickets/${data.ticket_key}/comments/${data.comment_id}`,
            data,
        );
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
