import { Typography, useTheme } from '@mui/material';

import { StyledHeroCard } from './HeroCard.styles';

export const HeroCard = () => {
    const theme = useTheme();
    return (
        <StyledHeroCard>
            <Typography variant="h1" color={theme.palette.common.white}>
                Simplify Support with TaskVault
            </Typography>
            <Typography variant="h3" color={theme.palette.common.white}>
                Manage, prioritize, and resolve tickets faster with a
                centralized system built for modern teams.
            </Typography>
        </StyledHeroCard>
    );
};
