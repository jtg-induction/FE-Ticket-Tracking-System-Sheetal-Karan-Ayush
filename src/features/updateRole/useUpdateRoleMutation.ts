import { updateRole } from '@api/updateRole/updateRoleApi';
import { useMutation } from '@tanstack/react-query';

export const useUpdateUserRoleMutation = () =>
useMutation({
    mutationFn: updateRole,
});
