import React, { useEffect, useRef, useState } from 'react';

import { Box, Tooltip, Typography } from '@mui/material';

interface ClampedTooltipTextProps {
    children: string;
    lines?: number;
    variant?: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    maxWidth?: string | number;
}

export const ClampedTooltipText: React.FC<ClampedTooltipTextProps> = ({
    children,
    lines = 2,
    variant = 'body1',
    maxWidth = '100%',
}) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isClamped, setIsClamped] = useState(false);

    useEffect(() => {
        const element = textRef.current;
        if (!element) return;

        const checkClamping = () => {
            setIsClamped(element.scrollHeight > element.clientHeight);
        };

        checkClamping();
        window.addEventListener('resize', checkClamping);
        return () => window.removeEventListener('resize', checkClamping);
    }, [children, lines]);

    return (
        <Tooltip title={isClamped ? children : ''} arrow>
            <Box sx={{ maxWidth, overflow: 'hidden' }}>
                <Typography
                    ref={textRef}
                    variant={variant}
                    sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: lines,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                >
                    {children}
                </Typography>
            </Box>
        </Tooltip>
    );
};
