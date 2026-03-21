import { useMutation } from '@tanstack/react-query';

import { api } from '../axios';
import { ProjectReportFilters } from '@features/reports/projectReport.schema';

const buildQueryParams = (filters: ProjectReportFilters) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value === null || value === undefined) return;

        if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, String(v)));
        } else {
            params.append(key, String(value));
        }
    });

    return params;
};

export const useDownloadProjectReport = () => useMutation({
        mutationFn: async (filters: ProjectReportFilters) => {
            const params = buildQueryParams(filters);

            const response = await api.get(
                `/api/project/${filters.project_key}/reports/download`,
                {
                    params,
                    responseType: 'blob',
                },
            );

            const url = window.URL.createObjectURL(
                new Blob([response.data], { type: 'application/pdf' }),
            );
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'project_report.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
    });
