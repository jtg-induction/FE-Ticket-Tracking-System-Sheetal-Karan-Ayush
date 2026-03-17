import { handleApiError } from "@api/apiErrorHandling";
import { api } from "@api/axios";
import { UpdateCommentFormData } from "@features/comments/updateComment/updateComment.schema";

export const updateComment = async (
    data: UpdateCommentFormData,
) => {
    try {
        await api.patch(
            `/ticket/comments/${data.comment_id}`,
            data,
        );
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
