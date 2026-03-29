import { CircularProgress, Grid2 } from '@mui/material';

import { ChartCard } from '@components';

import { ProjectChartsProps, TransformedPriorityItem, TransformedStatusItem } from './ProjectChart.type';
import { TicketPriorityMap, TicketStatusMap } from './ProjectCharts.config';
import {
    ChartLoadingContainer,
    LineChartLoadingContainer,
} from './ProjectCharts.style';

export const ProjectCharts = ({
    statusData,
    statusLoading,
    priorityData,
    priorityLoading,
    deadlineData,
    deadlineLoading,
}: ProjectChartsProps) => {

    const getStatusString = (status: number): string =>
        TicketStatusMap[status] ?? 'Unknown';
    const getPriorityString = (priority: number): string =>
        TicketPriorityMap[priority] ?? 'Unknown';
    const transformedStatusData: TransformedStatusItem[] | undefined =
        statusData?.map((item) => ({
            status: getStatusString(item.status),
            count: item?.count,
        }));

    const transformedPriorityData: TransformedPriorityItem[] | undefined =
        priorityData?.map((item) => ({
            priority: getPriorityString(item.priority),
            count: item.count,
            height: 400,
        }));
    
     const showStatusChart =
         statusLoading ||
         (transformedStatusData && transformedStatusData.length > 0);
     const showPriorityChart =
         priorityLoading ||
         (transformedPriorityData && transformedPriorityData.length > 0);
     const showDeadlineChart =
         deadlineLoading || (deadlineData && deadlineData.length > 0);

    return (
        <Grid2 container spacing={3} sx={{ mt: 1 }}>
            {showStatusChart && (
                <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    {statusLoading ? (
                        <ChartLoadingContainer>
                            <CircularProgress />
                        </ChartLoadingContainer>
                    ) : transformedStatusData ? (
                        <ChartCard
                            title="Ticket by Status"
                            type="pie"
                            data={transformedStatusData}
                            dataKey="count"
                            xKey="status"
                        />
                    ) : null}
                </Grid2>
            )}

            {showPriorityChart && (
                <Grid2 size={{ xs: 12, sm: 6, md: 6, lg: 6 }}>
                    {priorityLoading ? (
                        <ChartLoadingContainer>
                            <CircularProgress />
                        </ChartLoadingContainer>
                    ) : transformedPriorityData ? (
                        <ChartCard
                            title="Ticket by Priority"
                            type="pie"
                            data={transformedPriorityData}
                            dataKey="count"
                            xKey="priority"
                        />
                    ) : null}
                </Grid2>
            )}

            {showDeadlineChart && (
                <Grid2 size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    {deadlineLoading ? (
                        <LineChartLoadingContainer>
                            <CircularProgress />
                        </LineChartLoadingContainer>
                    ) : deadlineData && deadlineData.length > 0 ? (
                        <ChartCard
                            title="Ticket Deadline Performance"
                            type="line"
                            data={deadlineData}
                            dataKey="count"
                            xKey="day_difference"
                            xAxisLabel="Days difference (negative = early, positive = late)"
                        />
                    ) : null}
                </Grid2>
            )}
        </Grid2>
    );
};
