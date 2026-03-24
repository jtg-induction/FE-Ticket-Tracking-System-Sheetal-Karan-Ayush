import { deleteComment } from '@api/comments/deleteCommentApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DeleteCommentFormData } from '../updateComment/updateComment.schema';

export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: DeleteCommentFormData) => deleteComment(payload),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
};
