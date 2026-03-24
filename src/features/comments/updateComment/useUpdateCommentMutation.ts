import { updateComment } from '@api/comments/updateCommentApi';
import { useMutation } from '@tanstack/react-query';

import { UpdateCommentFormData } from './updateComment.schema';

export const useUpdateCommentMutation = () => useMutation({
        mutationFn: (data: UpdateCommentFormData) => updateComment(data),
    });
