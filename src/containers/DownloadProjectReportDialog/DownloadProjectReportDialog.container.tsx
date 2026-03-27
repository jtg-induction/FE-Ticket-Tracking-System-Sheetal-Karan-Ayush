import { useEffect, useState } from 'react';

import dayjs, { Dayjs } from 'dayjs';
import { useParams } from 'react-router-dom';

import 'dayjs/locale/en-in';

import { Alert, Autocomplete, Box, Button, Chip, MenuItem, TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useDownloadProjectReport } from '@api/reports/downloadProjectReport';
import { ticketFiltersSchema } from '@features/reports/projectReport.schema';
import { useReportStore } from '@features/reports/store/projectReportStore';

export const DownloadProjectReportDialog = () => {

    const { projectKey } = useParams<{ projectKey: string }>();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const { filters, setFilter, resetFilters } = useReportStore();
    const { mutate: download, isPending } = useDownloadProjectReport();

    useEffect(() => {
        if (projectKey && filters.project_key !== projectKey) {
            setFilter('project_key', projectKey);
        }
    }, [projectKey, filters.project_key, setFilter]);


    const handleDownload = () => {
        const result = ticketFiltersSchema.safeParse(filters);

        if (!result.success) {
            setErrorMessage(result.error.issues[0].message);
            return;
        }

        setErrorMessage(null);
        download(result.data);
    };

    const handleDateChange = (key: keyof typeof filters, value: Dayjs | null) => {
        const formatted = value ? dayjs(value).format('YYYY-MM-DD') : null;
        setFilter(key, formatted);
    };


    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en-in'>
            <Box display={'flex'} flexDirection={'column'} gap={2} padding={2}>

                <Box display={'flex'} gap={2}>
                    <Autocomplete
                        multiple
                        freeSolo
                        options={[]}
                        value={filters.assignee || []}
                        onChange={(_, newValue: string[]) => setFilter('assignee', newValue)}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Chip label={option} {...getTagProps({ index })} key={index} />
                            ))
                        }
                        renderInput={(params) => (
                            <TextField {...params} label="Search by Assignee" placeholder="Type email and hit Enter" />
                        )}
                        sx={{ flex: 5 }}
                    />

                    <TextField
                        sx={{ flex: 1 }}
                        select
                        label="Group By User"
                        value={String(filters.group_by_user) || ""}
                        onChange={(e) => setFilter('group_by_user', e.target.value === 'true')}
                    >

                        <MenuItem value="false">No</MenuItem>
                        <MenuItem value="true">Yes</MenuItem>
                    </TextField>

                </Box>

                <Box display={'flex'} gap={2}>
                    <TextField
                        sx={{ flex: 1 }}
                        select
                        label="Status"
                        slotProps={{
                            select: { multiple: true }
                        }}
                        value={filters.status || []}
                        onChange={(e) => setFilter('status', e.target.value as unknown as number[])}
                    >

                        <MenuItem value={1}>Open</MenuItem>
                        <MenuItem value={2}>In Progress</MenuItem>
                        <MenuItem value={3}>Resolved</MenuItem>
                        <MenuItem value={4}>Archived</MenuItem>
                    </TextField>

                    <TextField
                        sx={{ flex: 1 }}
                        select
                        label="Priority"
                        slotProps={{
                            select: { multiple: true }
                        }}
                        value={filters.priority || []}
                        onChange={(e) => setFilter('priority', e.target.value as unknown as number[])}
                    >
                        <MenuItem value={1}>High</MenuItem>
                        <MenuItem value={2}>Medium</MenuItem>
                        <MenuItem value={3}>Low</MenuItem>
                    </TextField>

                    <TextField
                        sx={{ flex: 1 }}
                        select
                        label="Type"
                        slotProps={{
                            select: { multiple: true }
                        }}
                        value={filters.type || []}
                        onChange={(e) => setFilter('type', e.target.value as unknown as number[])}
                    >

                        <MenuItem value={1}>Task</MenuItem>
                        <MenuItem value={2}>Bug</MenuItem>
                        <MenuItem value={3}>Story</MenuItem>
                        <MenuItem value={4}>Epic</MenuItem>
                        <MenuItem value={5}>SubTask</MenuItem>
                    </TextField>

                    <DatePicker
                        sx={{
                            flex: 1,
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-error fieldset': {
                                    borderColor: 'error',
                                },
                            },
                            '& .MuiInputLabel-root.Mui-error': {
                                color: 'error.contrastText',
                            },
                        }}
                        label="Search by Deadline"
                        value={filters.deadline ? dayjs(filters.deadline) : null}
                        onChange={(val) => handleDateChange('deadline', val)}
                        slotProps={{
                            actionBar: {
                                actions: ['clear'],
                            },
                        }}
                    />
                </Box>

                <Box display={'flex'} gap={2}>


                    <DatePicker
                        sx={{ flex: 1 }}
                        label="Created after"
                        value={filters.created_start_date ? dayjs(filters.created_start_date) : null}
                        onChange={(val) => handleDateChange('created_start_date', val)}
                        maxDate={dayjs()}
                        slotProps={{
                            actionBar: {
                                actions: ['clear'],
                            },
                        }}
                    />
                    <DatePicker
                        sx={{ flex: 1 }}
                        label="Created before"
                        value={filters.created_end_date ? dayjs(filters.created_end_date) : null}
                        onChange={(val) => handleDateChange('created_end_date', val)}
                        maxDate={dayjs()}
                        minDate={filters.created_start_date ? dayjs(filters.created_start_date) : undefined}
                        slotProps={{
                            actionBar: {
                                actions: ['clear'],
                            },
                        }}
                    />

                    <DatePicker
                        sx={{ flex: 1 }}
                        label="Completed after"
                        value={filters.completed_start_date ? dayjs(filters.completed_start_date) : null}
                        maxDate={dayjs()}
                        onChange={(val) => handleDateChange('completed_start_date', val)}
                        slotProps={{
                            actionBar: {
                                actions: ['clear'],
                            },
                        }}
                    />
                    <DatePicker
                        sx={{ flex: 1 }}
                        label="Completed before"
                        value={filters.completed_end_date ? dayjs(filters.completed_end_date) : null}
                        onChange={(val) => handleDateChange('completed_end_date', val)}
                        maxDate={dayjs()}
                        minDate={filters.completed_start_date ? dayjs(filters.completed_start_date) : undefined}
                        slotProps={{
                            actionBar: {
                                actions: ['clear'],
                            },
                        }}
                    />
                </Box>

                <Box display={'flex'} gap={2} justifyContent={'center'} mt={2}>
                    <Button
                        variant="outlined"
                        onClick={resetFilters}
                        disabled={isPending}
                    >
                        Reset
                    </Button>

                    <Button
                        variant="contained"
                        onClick={handleDownload}
                        disabled={isPending}
                    >
                        {isPending ? 'Generating PDF...' : 'Download Report'}
                    </Button>

                    {errorMessage && (
                        <Alert severity="error" onClose={() => setErrorMessage(null)}>
                            {errorMessage}
                        </Alert>
                    )}

                </Box>

            </Box>
        </LocalizationProvider>
    );
};
