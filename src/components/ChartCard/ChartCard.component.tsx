import {
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    XAxisProps,
    YAxis,
} from 'recharts';

import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';

import { ChartCardProps } from './ChartCard.type';

const DEFAULT_COLORS = [
    '#1976d2',
    '#2e7d32',
    '#ed6c02',
    '#9c27b0',
    '#d32f2f',
    '#0288d1',
    '#7b1fa2',
    '#fbc02d',
];

export const ChartCard = <T extends Record<string, unknown>>({
    title,
    type,
    data,
    dataKey,
    xKey,
    colors = DEFAULT_COLORS,
    xAxisLabel,
}: ChartCardProps<T>) => {
    const theme = useTheme();
    const primaryColor = theme.palette.primary.main;

    if (!data || data.length === 0) {
        return (
            <Card
                sx={{
                    height: 350,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h6">{title}</Typography>
                    <Typography variant="body2" color="textSecondary">
                        No data available
                    </Typography>
                </CardContent>
            </Card>
        );
    }

    const lineLabelFormatter = (label: unknown) => {
        if (typeof label === 'number') {
            if (label < 0) return `${Math.abs(label)} days early`;
            if (label > 0) return `${label} days late`;
            return 'On time';
        }

        if (typeof label === 'string') {
            return label;
        }

        return '';
    };

    const renderChart = () => {
        switch (type) {
            case 'line': {
                const numericX = data.every(
                    (item) => !isNaN(Number(item[xKey as string])),
                );
                const hasNegative = data.some(
                    (item) => Number(item[xKey as string]) < 0,
                );
                const hasPositive = data.some(
                    (item) => Number(item[xKey as string]) > 0,
                );

                const xAxisProps: XAxisProps = {
                    dataKey: xKey as string,
                    tick: { fill: theme.palette.text.secondary, fontSize: 12 },
                };
                if (numericX) {
                    xAxisProps.type = 'number';
                    xAxisProps.domain = ['auto', 'auto'];
                    if (xAxisLabel) {
                        xAxisProps.label = {
                            value: xAxisLabel,
                            position: 'bottom',
                            offset: 0,
                            style: {
                                fill: theme.palette.text.secondary,
                                fontSize: 12,
                            },
                        };
                    }
                }

                return (
                    <LineChart data={data}>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={theme.palette.divider}
                        />
                        <XAxis {...xAxisProps} />
                        <YAxis
                            tick={{
                                fill: theme.palette.text.secondary,
                                fontSize: 12,
                            }}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: theme.palette.background.paper,
                                borderColor: theme.palette.divider,
                                color: theme.palette.text.primary,
                            }}
                            labelFormatter={lineLabelFormatter}
                        />
                        <Legend wrapperStyle={{ paddingTop: 10 }} />
                        <Line
                            type="monotone"
                            dataKey={dataKey as string}
                            stroke={primaryColor}
                            strokeWidth={2}
                            dot={{ fill: primaryColor, r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        {numericX && hasNegative && hasPositive && (
                            <ReferenceLine
                                x={0}
                                stroke={theme.palette.warning.main}
                                strokeDasharray="3 3"
                                label={{
                                    value: 'Deadline',
                                    position: 'top',
                                    fill: theme.palette.warning.main,
                                }}
                            />
                        )}
                    </LineChart>
                );
            }
            case 'pie':
                return (
                    <PieChart>
                        <Tooltip />
                        <Legend />
                        <Pie
                            data={data}
                            dataKey={dataKey as string}
                            nameKey={xKey as string}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                        >
                            {data.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={colors[index % colors.length]}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                );
            default:
                return null;
        }
    };

    return (
        <Card sx={{ height: 350, display: 'flex', flexDirection: 'column' }}>
            <CardContent
                sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}
            >
                <Typography variant="h6" sx={{ mb: 2 }}>
                    {title}
                </Typography>
                <Box sx={{ flex: 1, width: '100%', minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        {renderChart()}
                    </ResponsiveContainer>
                </Box>
            </CardContent>
        </Card>
    );
};
