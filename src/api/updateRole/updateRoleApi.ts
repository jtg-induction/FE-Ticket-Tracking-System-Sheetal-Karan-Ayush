import { handleApiError } from "@api/apiErrorHandling";
import { api } from "@api/axios";
import { UpdateRoleFormData } from "@features/updateRole/updateRole.schema";


export const updateRole = async (
    data: UpdateRoleFormData,
): Promise<void> => {
    try {
        await api.patch(
            `/projects/${data.project_key}/users/${data.user_id}`
        );
    } catch (error: unknown) {
        return handleApiError(error);
    }
};
