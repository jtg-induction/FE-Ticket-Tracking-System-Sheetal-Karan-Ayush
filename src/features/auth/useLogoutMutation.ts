import { useNavigate } from "react-router-dom";

import { logoutUser } from "@api/auth/logout/logoutUser";
import { useMutation,useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "./store";

export const useLogout = () => {
    const queryClient = useQueryClient();
    const clearAuth = useAuthStore((s) => s.clearAuth);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: logoutUser,
        
        onSettled: () => {
            clearAuth();

            queryClient.clear();

            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');

            void navigate('/login');
        },
    });
};
