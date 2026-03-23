import { handleApiError } from "@api/apiErrorHandling";
import { api } from "@api/axios";


export const deleteComment = async (
    commentId: number
) => {
    try {
        await api.delete(
            `/api/tickets/comments/${commentId}`,
        );
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
