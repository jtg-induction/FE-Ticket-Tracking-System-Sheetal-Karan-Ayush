import { UserReportFilters } from '@pages';
import { useMutation } from '@tanstack/react-query';

import { getUserReportPdf } from './api';

type UseUserReportPdfProps = {
    onSuccess?: () => void;
    onError?: (error: Error) => void;
};
type UseUserReportPdfVariables = {
    filters: UserReportFilters;
    email?: string;
    projectKey?: string;
};
export const useUserReportPdf = (options?: UseUserReportPdfProps) => {
    const mutation = useMutation({
        mutationFn: ({
            filters,
            email,
            projectKey,
        }: UseUserReportPdfVariables) =>
            getUserReportPdf(filters, email as string, projectKey),
        onSuccess: (blob: Blob, variables) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `user_report_${variables.email}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            options?.onSuccess?.();
        },
        onError: (error: Error) => {
            options?.onError?.(error);
        },
    });

    return {
        downloadPdf: mutation.mutate,
        isLoading: mutation.isPending,
        isError: mutation.isError,
        error: mutation.error,
    };
};
