import { inviteUserApi } from '@api';
import { useMutation } from '@tanstack/react-query';

export const useInviteUserMutation = () =>
    useMutation({
        mutationFn: inviteUserApi,
    });
