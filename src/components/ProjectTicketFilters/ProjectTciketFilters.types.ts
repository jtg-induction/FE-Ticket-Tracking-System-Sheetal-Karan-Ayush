import dayjs from 'dayjs';

export type Filters = {
    title: string;
    assignee: string;
    deadline: dayjs.Dayjs | null;
    status: string;
    sort: string;
}

export type ProjectTicketFilterProps = {
    filters: Filters;
    onChange: (field: keyof Filters, value: any) => void;
    onReset: () => void;
}
