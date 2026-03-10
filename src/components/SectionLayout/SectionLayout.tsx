import { Typography } from '@mui/material';

import {
    StyledSectionBox,
    StyledSectionHeaderBox,
    StyledSectionMainBox,
} from './SectionLayout.styles';
import { SectionLayoutProps } from './SectionLayout.types';
export const SectionLayout = ({
    title,
    subtitle,
    headerAction,
    children,
}: SectionLayoutProps) => (
    <StyledSectionBox>
        <StyledSectionHeaderBox>
            <div>
                <Typography variant="h2">{title}</Typography>
                {subtitle && (
                    <Typography variant="body2" color="text.secondary">
                        {subtitle}
                    </Typography>
                )}
            </div>

            {headerAction && headerAction}
        </StyledSectionHeaderBox>

        <StyledSectionMainBox>{children}</StyledSectionMainBox>
    </StyledSectionBox>
);
