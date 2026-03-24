import { useMemo, useState } from 'react';

import { debounce } from 'lodash';
import { useNavigate, useParams } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import {
    Avatar,
    Box,
    Divider,
    Drawer,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    TextField,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@mui/material';
import Chip from '@mui/material/Chip';

import { useGetAllUsers } from '@features/project/useGetAllUsers';
import { theme } from '@theme';

import { UserSidebarProps } from './UserList.types';

export const UserSidebar = ({ open, onClose }: UserSidebarProps) => {
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const { projectKey } = useParams<{
        projectKey: string;
    }>();
    const [searchUserName, setSearchUserName] = useState<string>('');
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useGetAllUsers({
            projectKey: projectKey as string,
            userName: searchUserName.length > 0 ? searchUserName : undefined,
        });
    const users = data?.pages.flatMap((p) => p) ?? [];

    const debouncedSetSearch = useMemo(
        () =>
            debounce((value: string) => {
                setSearchUserName(value);
            }, 500),
        [],
    );
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            variant={isMobile ? 'temporary' : 'persistent'}
        >
            <Toolbar />
            <Box display="flex" flexDirection="column" height="100%">
                <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    padding={theme.spacing(2)}
                >
                    <Typography variant="h6">Project Users</Typography>
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Divider />

                {/* Search */}
                <Box padding={theme.spacing(0.5)}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search users..."
                        onChange={(e) => debouncedSetSearch(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                </Box>

                {/* User List */}
                <Box
                    flex={1}
                    paddingInline={theme.spacing(0.5)}
                    sx={{ overflowY: 'auto' }}
                    onScroll={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            void fetchNextPage();
                        }
                    }}
                >
                    {users.length === 0 ? (
                        <Typography
                            padding={theme.spacing(0.5)}
                            color={theme.palette.text.secondary}
                        >
                            No users found
                        </Typography>
                    ) : (
                        <List>
                            {users.map((user) => (
                                <ListItem
                                    key={user.user_id}
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() =>
                                        void navigate(
                                            `/project/${projectKey}/user?email=${encodeURIComponent(user.user_email)}`,
                                        )
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar>{user.user_name[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box
                                                display="flex"
                                                justifyContent="space-between"
                                            >
                                                <Typography
                                                    variant="body1"
                                                    sx={() => ({
                                                        ...theme.mixins.lineClamp(
                                                            1,
                                                        ),
                                                        maxWidth:
                                                            theme.spacing(40),
                                                    })}
                                                >
                                                    {user.user_name}{' '}
                                                </Typography>

                                                {user.role && (
                                                    <Chip
                                                        label={user.role}
                                                        size="small"
                                                        color="primary"
                                                        variant="outlined"
                                                        sx={{
                                                            fontSize:
                                                                theme.spacing(
                                                                    2.5,
                                                                ),
                                                        }}
                                                    />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                color="textSecondary"
                                                sx={() => ({
                                                    ...theme.mixins.lineClamp(
                                                        1,
                                                    ),
                                                    maxWidth: theme.spacing(50),
                                                })}
                                            >
                                                {user.user_email}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
            </Box>
        </Drawer>
    );
};
