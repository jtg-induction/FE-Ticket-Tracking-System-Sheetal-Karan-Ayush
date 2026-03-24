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
    ticket?: TicketResponse;
    updateFormData: TicketUpdateFormData;
    setTicket: (newTicket: TicketResponse) => void;
    setCreateFormData: (data: Partial<TicketFormData>) => void;
    setTickets: (newTickets: TicketResponse[]) => void;
    addTickets: (newTickets: TicketResponse[]) => void;
    setUpdateFormData: (data: Partial<TicketUpdateFormData>) => void;
    reset: () => void;
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
    createFormData: initialCreateFormData,
    getAllTicketsFormData: initialGetAllTicketsFormData,
    updateFormData: initialUpdateFormData,
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
    reset: () =>
        set({
            createFormData: initialCreateFormData,
            updateFormData: initialUpdateFormData,
        }),
});

export const useTicketStore = create<TicketStore>(storeCreator);
