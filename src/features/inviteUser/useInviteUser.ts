import { inviteUserApi } from "@api";
import { useMutation } from "@tanstack/react-query";


export const useInviteUser = () => useMutation({
        mutationFn: inviteUserApi,
    })
