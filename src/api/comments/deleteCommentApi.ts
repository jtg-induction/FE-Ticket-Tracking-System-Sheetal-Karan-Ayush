import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import { DeleteCommentFormData } from '@features/comments/updateComment/updateComment.schema';

/**
 * Deletes a comment by its ID.
 *
 * This function sends a DELETE request to the backend API to remove
 * a specific comment. If the request fails, the error is handled
 * using the centralized {@link handleApiError} utility.
 *
 * @param commentId - The unique identifier of the comment to be deleted
 *
 * @returns A promise that resolves to `void` if successful,
 * or returns the result of {@link handleApiError} in case of failure
 *
 * @throws Will propagate errors processed by {@link handleApiError}
 */
export const deleteComment = async (data: DeleteCommentFormData) => {
    try {
        await api.delete(
            `/api/tickets/${data.ticket_key}/comments/${data.comment_id}`,
        );
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
