import { useEffect, useState } from 'react';

import { BugReport, Menu } from '@mui/icons-material';
import {
    Avatar,
    Typography,
    useMediaQuery,
    useTheme
} from '@mui/material';

import { Searchbar } from '@components';

import {
    HamburgerButton,
    HeaderStyled,
    StyledLeftBox,
    StyledRightBox,
    StyledToolbar,
} from './Header.styles';
import { HeaderProps } from './Header.types';

export const Header = ({ isMenuOpen, setMenuOpen }: HeaderProps) => {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('sm'));

    // --- 2. State Variables ---
    const [searchText, setSearchText] = useState('');
    const [selectedProduct, setSelectedProduct] = useState(null);

    /**
     * Handles the selection of a product from the search results
     * @param product - The product object or null
     */
    const handleSelect = (project) => {
        if (!product) return;
    };
    useEffect(() => {
        if (isDesktop) {
            setMenuOpen(true);
        } else {
            setMenuOpen(false);
        }
    }, [isDesktop, setMenuOpen]);

    return (
        <HeaderStyled component={'header'} elevation={1}>
            <StyledToolbar>
                <StyledLeftBox to={'/'}>
                    {isDesktop && (
                        <>
                            <Avatar
                                alt="TaskVault"
                                sx={{ bgcolor: 'primary.main' }}
                            >
                                <BugReport />
                            </Avatar>
                            <Typography
                                variant="h2"
                                color={theme.palette.grey[900]}
                            >
                                TaskVault
                            </Typography>
                        </>
                    )}
                    {!isDesktop && (
                        <HamburgerButton
                            component={'button'}
                            isOpen={isMenuOpen}
                            onClick={() => setMenuOpen(!isMenuOpen)}
                        >
                            <Menu fontSize="large" />
                        </HamburgerButton>
                    )}
                    <Searchbar
                        options={[]}
                        value={selectedProduct}
                        onSelect={handleSelect}
                        onSearch={setSearchText}
                        getOptionLabel={(option) => option.name}
                        isOptionEqualToValue={(option, value) =>
                            option.id === value.id
                        }
                    />
                </StyledLeftBox>
                <StyledRightBox>
                    <Avatar alt="TaskVault"></Avatar>
                </StyledRightBox>
            </StyledToolbar>
        </HeaderStyled>
    );
};
