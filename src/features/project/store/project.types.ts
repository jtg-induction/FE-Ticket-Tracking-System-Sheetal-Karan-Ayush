import { ProjectFormData, ProjectResponse, ProjectUpdateData } from "../schema";

export type ProjectStore = {
    createFormData: ProjectFormData;
    updateFormData: ProjectUpdateData;
    projects: ProjectResponse[];
    project: ProjectResponse | null;
    setProjects: (projects: ProjectResponse[]) => void;
    addProject: (project: ProjectResponse) => void;
    removeProject: (id: string) => void;
    deleteTarget: ProjectResponse | null;
    setCreateFormData: (data: Partial<ProjectFormData>) => void;
    setUpdateFormData: (data: Partial<ProjectUpdateData>) => void;
    reset: () => void;
    setProject: (project: ProjectResponse) => void;
    setDeleteTarget: (project: ProjectResponse) => void;
    clearDeleteTarget: () => void;
};
