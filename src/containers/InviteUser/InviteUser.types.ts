export type UserRole = 1 | 2

export type InviteUserProps = {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    projectId: number;
    projectKey: string;
};
