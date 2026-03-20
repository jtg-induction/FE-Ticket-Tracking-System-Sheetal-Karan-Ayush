import { create } from 'zustand';

import { ProjectReportFilters } from '../projectReport.schema';


type Store = {
    filters: ProjectReportFilters;
    setFilter: <K extends keyof ProjectReportFilters>(
        key: K, 
        value: ProjectReportFilters[K]
    ) => void;
    resetFilters: () => void;
};

const initialFilters: ProjectReportFilters = {
    project_key: '',
    assignee: null,
    status: null,
    priority: null,

    deadline: null,

    created_start_date: null,
    created_end_date: null,

    completed_start_date: null,
    completed_end_date: null,

    group_by_user: false,
};

export const useReportStore = create<Store>((set) => ({
    filters: initialFilters,

    setFilter: (key, value) =>
        set((state) => ({
            filters: { ...state.filters, [key]: value },
        })),

    resetFilters: () => set({ filters: initialFilters }),
}));
