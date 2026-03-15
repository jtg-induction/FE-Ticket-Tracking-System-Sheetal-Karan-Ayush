import { create, StateCreator } from 'zustand';

import { TicketPriority, TicketStatus, TicketType } from '../common';
import {
    TicketFormData,
    TicketResponse,
} from '../createTicket/createTicket.schema';
import { GetAllTicketsFormData } from '../getAllTickets/getAllTickets.schema';
import { TicketUpdateFormData } from '../updateTicket/updateTicket.schema';

type TicketStore = {
    createFormData: TicketFormData;
    tickets: TicketResponse[];
    ticket: TicketResponse | undefined;
    updateFormData: TicketUpdateFormData;
    // projects: ProjectResponse[];
    // project: ProjectResponse | null;
    setTicket: (newTicket: TicketResponse) => void;
    // addProject: (project: ProjectResponse) => void;
    // removeProject: (id: string) => void;
    // deleteTarget: ProjectResponse | null;
    setCreateFormData: (data: Partial<TicketFormData>) => void;
    setTickets: (newTickets: TicketResponse[]) => void;
    addTickets: (newTickets: TicketResponse[]) => void;
    setUpdateFormData: (data: Partial<TicketUpdateFormData>) => void;
    reset: () => void;
    // setProject: (project: ProjectResponse) => void;
    // setDeleteTarget: (project: ProjectResponse) => void;
    // clearDeleteTarget: () => void;
};

const initialCreateFormData: TicketFormData = {
    title: '',
    description: undefined,
    ticket_type: TicketType.BUG,
    status: TicketStatus.OPEN,
    priority: TicketPriority.LOW,
    assignee: '',
    labels: [],
    project_key: '',
    // deadline: undefined,
};

const initialUpdateFormData: TicketUpdateFormData = {
    ticket_key: '',
    project_key: '',
};

const initialGetAllTicketsFormData: GetAllTicketsFormData = {
    sort: 'latest',
    limit: 20,
};

const storeCreator: StateCreator<TicketStore> = (set) => ({
    // projects: [],
    createFormData: initialCreateFormData,
    getAllTicketsFormData: initialGetAllTicketsFormData,
    updateFormData: initialUpdateFormData,
    // project: null,
    // deleteTarget: null,
    tickets: [],
    ticket: undefined,
    setTicket: (newTicket) => set({ ticket: newTicket }),
    setTickets: (newTickets) => set({ tickets: newTickets }),
    addTickets: (newTickets) =>
        set((state) => ({ tickets: [...state.tickets, ...newTickets] })),
    setCreateFormData: (data) =>
        set((state) => ({
            createFormData: { ...state.createFormData, ...data },
        })),

    setUpdateFormData: (data: Partial<TicketUpdateFormData>) =>
        set((state) => ({
            updateFormData: { ...state.updateFormData, ...data },
        })),
    // setProjects: (projects) => set({ projects }),
    // setProject: (project: ProjectResponse) => set({ project }),
    // addProject: (project) =>
    //     set((state) => ({
    //         projects: [...state.projects, project],
    //     })),

    // removeProject: (id) =>
    //     set((state) => ({
    //         projects: state.projects.filter((p) => p.id !== id),
    //     })),
    // setDeleteTarget: (project: ProjectResponse) =>
    //     set({ deleteTarget: project }),

    // clearDeleteTarget: () => set({ deleteTarget: null }),

    reset: () =>
        set({
            createFormData: initialCreateFormData,
            updateFormData: initialUpdateFormData,
            // project: null,
            // deleteTarget: null,
        }),
});

export const useTicketStore = create<TicketStore>(storeCreator);
