import { handleApiError } from "@api/apiErrorHandling";
import { api } from "@api/axios";
import { CommentResponse, commentResponseSchema, CreateCommentFormData } from "@features/comments/createComment/createComment.schema";

export const createComment = async (
    data: CreateCommentFormData,
): Promise<CommentResponse> => {
    try {
        const response = await api.post(
            `/ticket/${data.ticket_key}/comments`,
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
