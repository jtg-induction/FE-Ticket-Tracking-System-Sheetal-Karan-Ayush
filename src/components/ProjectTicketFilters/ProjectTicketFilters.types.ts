import dayjs from 'dayjs';

export type Filters = {
    title: string | undefined;
    assignee: string | undefined;
    deadline: dayjs.Dayjs | undefined;
    status: number | undefined;
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
