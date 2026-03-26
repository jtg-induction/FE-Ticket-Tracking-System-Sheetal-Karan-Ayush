import DownloadIcon from '@mui/icons-material/Download';
import UserSidebarIcon from '@mui/icons-material/PeopleAlt';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import { Badge, Typography } from '@mui/material';

import { ClampedTooltipText } from '@components';
import { theme } from '@theme';

import { ProjectHeaderProps } from './ProjectDashboard.type';
import {
    DeleteIcon,
    EditIcon,
    IconBox,
    StatusBadge,
    StyledButton,
    StyledHeader,
    StyledLeftBox,
    StyledLowerBox,
    StyledRightBox,
    StyledUpperBox,
} from './ProjectDashboardHeader.style';

export const ProjectHeader = ({
    project,
    isDeveloper,
    onEdit,
    onDelete,
    onImport,
    onCreate,
    onDownload,
    onToggleUsers,
    onInvite,
}: ProjectHeaderProps) => (
    <StyledHeader>
        <StyledUpperBox>
            <StyledLeftBox>
                <ClampedTooltipText variant="h2" lines={2}>
                    {project?.title}
                </ClampedTooltipText>
                <StatusBadge
                    label={project?.status === 2 ? 'Archived' : 'Active'}
                    ownerState={{ archived: project?.status === 2 }}
                />
                {!isDeveloper && (
                    <IconBox>
                        <EditIcon onClick={onEdit} />
                        <DeleteIcon onClick={onDelete} />
                    </IconBox>
                )}
                <Badge />
            </StyledLeftBox>

            <StyledRightBox>
                {!isDeveloper && project?.status !== 2 && (
                    <>
                        <StyledButton variant="contained" onClick={onImport}>
                            Import ticket
                        </StyledButton>
                        <StyledButton variant="contained" onClick={onCreate}>
                            Create ticket
                        </StyledButton>
                        <StyledButton
                            sx={{ padding: theme.spacing(0) }}
                            onClick={onInvite}
                        >
                            <PersonAddAltIcon />
                        </StyledButton>
                    </>
                )}
                <StyledButton
                    sx={{ padding: theme.spacing(0) }}
                    onClick={onDownload}
                >
                    <DownloadIcon />
                </StyledButton>
                <StyledButton
                    sx={{ padding: theme.spacing(0) }}
                    onClick={onToggleUsers}
                >
                    <UserSidebarIcon />
                </StyledButton>
            </StyledRightBox>
        </StyledUpperBox>
        <StyledLowerBox>
            <Typography variant="body2">{project?.description}</Typography>
        </StyledLowerBox>
    </StyledHeader>
);
