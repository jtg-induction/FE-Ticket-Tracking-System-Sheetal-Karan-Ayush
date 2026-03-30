import { handleApiError } from "@api/apiErrorHandling";
import { api } from "@api/axios";
import { getAllProjectUsersResponseSchema, GetAllUsersRequest, GetAllUsersResponse, ProjectResponse } from "@features/project/schema";

export const getAllUsers =  async (
    data: GetAllUsersRequest,
): Promise<GetAllUsersResponse> => {
    try {
        const response = await api.get<ProjectResponse>(
            `/projects/${data.projectKey}/users`, {
                params: { user_name: data.userName, offset: data.offset, limit: data.limit },
            }
        );

        const parsed = getAllProjectUsersResponseSchema.safeParse(response.data);
        
        if (!parsed.success) {
            throw new Error('Invalid server response ');
        }
        return parsed.data;

    } catch (error: unknown) {
        return handleApiError(error);
    }
};
