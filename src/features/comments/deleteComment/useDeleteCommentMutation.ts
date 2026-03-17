import { deleteComment } from '@api/comments/deleteCommentApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';


export const useDeleteCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId: number) => deleteComment(commentId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
};
