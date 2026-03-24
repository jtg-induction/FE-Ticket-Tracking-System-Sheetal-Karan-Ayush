import { createComment } from '@api/comments/createCommentsApi';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { CreateCommentFormData } from './createComment.schema';

export const useCreateCommentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateCommentFormData) => createComment(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['comments'] });
        },
    });
};
