import { ProjectResponse } from "@features/project/schema";

export type ProjectHeaderProps = {
    project: ProjectResponse;
    isDeveloper: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onImport: () => void;
    onCreate: () => void;
    onDownload: () => void;
    onToggleUsers: () => void;
    onInvite: () => void;
}
