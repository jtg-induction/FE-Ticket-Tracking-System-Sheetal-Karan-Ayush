import { ExpandMore } from '@mui/icons-material';
import { List, ListItemText, Typography } from '@mui/material';

import {
    StyledAccordion,
    StyledAccordionDetails,
    StyledAccordionSummary,
    StyledBadge,
    StyledListItem,
    StyledListItemButton,
} from './SidebarList.style';
import { SidebarItemListProps } from './SidebarList.types';

export const SidebarItemList = ({
    item,
    IconComponent,
    isActive,
    isExpanded,
    hasChildren,
    count,
    onClick,
    children,
}: SidebarItemListProps) => {
    if (hasChildren) {
        return (
            <StyledAccordion
                elevation={0}
                expanded={isExpanded}
                onChange={onClick}
            >
                <StyledAccordionSummary
                    expandIcon={<ExpandMore fontSize="large" />}
                >
                    {IconComponent && <IconComponent />}
                    <Typography variant='body1'>
                        {item.title}
                    </Typography>
                </StyledAccordionSummary>

                <StyledAccordionDetails>
                    <List component="div" disablePadding>
                        {children}
                    </List>
                </StyledAccordionDetails>
            </StyledAccordion>
        );
    }

    return (
        <StyledListItem disablePadding>
            <StyledListItemButton onClick={onClick} isActive={isActive}>
                {IconComponent && <IconComponent />}
                <ListItemText primary={item.title} />
                {count > 0 && <StyledBadge badgeContent={count} />}
            </StyledListItemButton>
        </StyledListItem>
    );
};
