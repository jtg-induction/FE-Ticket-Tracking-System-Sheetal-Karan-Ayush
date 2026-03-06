import { create, StateCreator } from 'zustand';

import { ProjectFormData, ProjectResponse, ProjectUpdateData } from './schema';

type ProjectStore = {
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

const initialCreateFormData: ProjectFormData = {
    title: '',
    description: '',
    jira_url: '',
    access_token: '',
    lead_email: '',
    jira_project_key: '',
};

const initialUpdateFormData: ProjectUpdateData = {
    title: '',
    description: '',
    status: 1,
};

const storeCreator: StateCreator<ProjectStore> = (set) => ({
    projects: [],
    createFormData: initialCreateFormData,
    updateFormData: initialUpdateFormData,
    project: null,
    deleteTarget: null,
    setCreateFormData: (data: Partial<ProjectFormData>) =>
        set((state) => ({
            createFormData: { ...state.createFormData, ...data },
        })),

    setUpdateFormData: (data: Partial<ProjectUpdateData>) =>
        set((state) => ({
            updateFormData: { ...state.updateFormData, ...data },
        })),
    setProjects: (projects) => set({ projects }),
    setProject: (project: ProjectResponse) => set({ project }),
    addProject: (project) =>
        set((state) => ({
            projects: [...state.projects, project],
        })),

    removeProject: (id) =>
        set((state) => ({
            projects: state.projects.filter((p) => p.id !== id),
        })),
    setDeleteTarget: (project: ProjectResponse) =>
        set({ deleteTarget: project }),

    clearDeleteTarget: () => set({ deleteTarget: null }),

    reset: () =>
        set({
            createFormData: initialCreateFormData,
            updateFormData: initialUpdateFormData,
            project: null,
            deleteTarget: null,
        }),
});

export const useProjectStore = create<ProjectStore>(storeCreator);
