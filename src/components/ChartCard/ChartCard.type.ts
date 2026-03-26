type ChartType = 'line' | 'bar' | 'pie';

export type ChartCardProps<T> = {
    title: string;
    type: ChartType;
    data: T[] | undefined;
    dataKey: keyof T;
    xKey?: keyof T;
    colors?: string[];
    xAxisLabel?: string;
    tickFormatter?: (value: number) => string;
};
