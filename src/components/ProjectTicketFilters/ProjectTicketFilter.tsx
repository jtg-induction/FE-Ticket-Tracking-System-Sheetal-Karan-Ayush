import { MenuItem } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import {
    FilterField,
    FiltersContainer,
    FiltersWrapper,
    ResetButton,
    SmallFilterField,
    StyledDatePicker,
} from './ProjectTicketFilter.style';
import { ProjectTicketFilterProps } from './ProjectTicketFilters.types';

export const ProjectTicketFilters = ({
    filters,
    onChange,
    onReset,
}: ProjectTicketFilterProps) => (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <FiltersWrapper>
            <FiltersContainer>
                <FilterField
                    label="Search by Title"
                    size="small"
                    value={filters.title}
                    onChange={(e) => onChange('title', e.target.value)}
                />

                <FilterField
                    label="Search by Assignee"
                    size="small"
                    value={filters.assignee}
                    onChange={(e) => onChange('assignee', e.target.value)}
                />

                <StyledDatePicker
                    label="Search by Deadline"
                    value={filters.deadline}
                    onChange={(value) => onChange('deadline', value)}
                    slotProps={{
                        textField: {
                            size: 'small',
                        },
                    }}
                />

                <SmallFilterField
                    select
                    label="Status"
                    size="small"
                    value={filters.status}
                    onChange={(e) => onChange('status', e.target.value)}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value={1}>Open</MenuItem>
                    <MenuItem value={2}>In Progress</MenuItem>
                    <MenuItem value={3}>Closed</MenuItem>
                </SmallFilterField>

                <SmallFilterField
                    select
                    label="Sort"
                    size="small"
                    value={filters.sort}
                    onChange={(e) => onChange('sort', e.target.value)}
                >
                    <MenuItem value="latest">Latest</MenuItem>
                    <MenuItem value="oldest">Oldest</MenuItem>
                </SmallFilterField>

                <ResetButton variant="outlined" onClick={onReset}>
                    Reset
                </ResetButton>
            </FiltersContainer>
        </FiltersWrapper>
    </LocalizationProvider>
);
