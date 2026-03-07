import { Typography } from '@mui/material';

import { StyledHeroCard } from './HeroCard.styles';

export const HeroCard = () => {
    return (
        <StyledHeroCard>
            <Typography variant="h1" color="common.white">
                Simplify Support with TaskVault
            </Typography>
            <Typography variant="h3" color="common.white">
                Manage, prioritize, and resolve tickets faster with a
                centralized system built for modern teams.
            </Typography>
        </StyledHeroCard>
    );
};
