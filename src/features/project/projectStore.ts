import { create, StateCreator } from 'zustand';

import { ProjectFormData, ProjectUpdateData } from './schema';

type ProjectStore = {
    formData: ProjectFormData | ProjectUpdateData;
    project: ProjectFormData | null; 
    deleteTarget: ProjectFormData | null; 
    setFormData: (data: Partial<ProjectFormData>) => void;
    reset: () => void;
    setProject: (project: ProjectFormData) => void;
    setDeleteTarget: (project: ProjectFormData) => void;
    clearDeleteTarget: () => void;
};

const initialState: ProjectFormData = {
    title: '',
    description: '',
    jira_url: '',
    access_token: '',
    lead_email: '',
    jira_project_key: '',
};

const storeCreator: StateCreator<ProjectStore> = (set) => ({
    formData: initialState,
    project: null,
    deleteTarget: null,
    setFormData: (data: Partial<ProjectFormData>) =>
        set((state: ProjectStore) => ({
            formData: { ...state.formData, ...data },
        })),
    reset: () =>
        set({ formData: initialState, project: null, deleteTarget: null }),
    setProject: (project: ProjectFormData | ProjectUpdateData) => set({ project }),
    setDeleteTarget: (project: ProjectFormData) =>
        set({ deleteTarget: project }),
    clearDeleteTarget: () => set({ deleteTarget: null }),
});

export const useProjectStore = create<ProjectStore>(storeCreator);
