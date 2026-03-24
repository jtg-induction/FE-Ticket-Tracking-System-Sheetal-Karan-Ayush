import dayjs from 'dayjs';

export type Filters = {
    title?: string;
    assignee?: string;
    deadline?: dayjs.Dayjs;
    status?: number;
    sort: string;
};

export type ProjectTicketFilterProps = {
    filters: Filters;
    onChange: (
        field: keyof Filters,
        value: string | dayjs.Dayjs | null,
    ) => void;
    onReset: () => void;
};
