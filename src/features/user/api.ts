import { handleApiError } from '@api/apiErrorHandling';
import { api } from '@api/axios';
import {
    UserBasicDetails,
    UserReportFilters,
    UserReportResponse,
} from '@pages';
import {
    PRIORITY_MAP,
    STATUS_MAP,
    TICKET_TYPE_MAP,
} from '@pages/Project/UserProjectReport/userProjectReport.config';

const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    }

    try {
        const result = handleApiError(error as never);
        return typeof result === 'string'
            ? result
            : 'An unknown error occurred';
    } catch {
        return 'An error occurred while handling the error';
    }
};

const buildReportParams = (
    filters: UserReportFilters,
    email: string,
): {
    email: string;
    sort: string;
    created_from?: string;
    created_to?: string;
    deadline_from?: string;
    deadline_to?: string;
    status?: number[];
    priority?: number[];
    ticket_type?: number[];
    limit?: number;
    cursor?: string;
} => {
   
    const status = filters.status?.map((s) => STATUS_MAP[s]) ?? [];

    const priority =
        filters.priority?.map((p) => PRIORITY_MAP[p]) ?? [];

    const ticketType =
        filters.ticketType?.map((t) => TICKET_TYPE_MAP[t]) ??
        [];

    const params = {
        email,
        sort: filters.sort ?? 'latest',
        created_from: filters.createdFrom,
        created_to: filters.createdTo,
        deadline_from: filters.deadlineFrom,
        deadline_to: filters.deadlineTo,
        ...(status.length > 0 && { status }),
        ...(priority.length > 0 && { priority }),
        ...(ticketType.length > 0 && { ticket_type: ticketType }),
    };

    return params;
};


export const getUserReport = async (
    filters: UserReportFilters,
    email: string,
    cursor?: string,
): Promise<UserReportResponse> => {
    try {
        const params = buildReportParams(filters, email);

        const response = await api.get<UserReportResponse>(
            '/user/full-details',
            {
                params: {
                    ...params,
                    limit: filters.limit ?? 10,
                    cursor,
                },
                paramsSerializer: { indexes: null },
            },
        );

        return response.data;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error));
    }
};

export const getUserBasicDetails = async (): Promise<UserBasicDetails> => {
    try {
        const response = await api.get<UserBasicDetails>('/user');
        return response.data;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error));
    }
};

export const getUserReportPdf = async (
    filters: UserReportFilters,
    email: string,
): Promise<Blob> => {
    try {
        const params = buildReportParams(filters, email);

        const response = await api.get<Blob>('/user-report', {
            params,
            paramsSerializer: { indexes: null },
            responseType: 'blob',
        });

        return response.data;
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error));
    }
};
