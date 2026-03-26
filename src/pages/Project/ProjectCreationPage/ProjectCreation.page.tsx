import React, { useState } from 'react';

import axios from 'axios';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';

import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import {
    Alert,
    Button,
    CircularProgress,
    IconButton,
    Snackbar,
    TextField,
    Typography,
    useTheme,
} from '@mui/material';

import {
    projectCreateSchema,
    useCheckProjectKey,
    useCreateProject,
    useProjectStore,
} from '@features/project';

import { CardBox } from './projectCreationPage.style';

export const ProjectCreationPage = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [apiError, setApiError] = useState(false);
    const { createFormData, setCreateFormData, reset } = useProjectStore();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isUnique, setIsUnique] = useState<boolean>();
    const [showPassword, setShowPassword] = useState(false);
    const createProjectMutation = useCreateProject();
    const isSubmitting = createProjectMutation.isPending;
    const checkKeyMutation = useCheckProjectKey();
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const debouncedCheckKey = debounce(async (value: string) => {
        setLoading(true);
        try {
            const res = await checkKeyMutation.mutateAsync({
                key: value,
                formData: {
                    jira_url: createFormData.jira_url,
                    access_token: createFormData.access_token,
                    lead_email: createFormData.lead_email,
                },
            });
            setIsUnique(res.valid);
        } catch (error: unknown) {
            setApiError(true);
            if (axios.isAxiosError(error)) {
                if (error.response && error.response.status === 502) {
                    setSnackbarMessage(
                        'Unauthorized: Invalid Jira URL, Access Token, or Admin Email',
                    );
                } else {
                    setSnackbarMessage(
                        'Something went wrong, please try again.',
                    );
                }
            } else {
                setSnackbarMessage('Unauthorized: Invalid Jira URL, Access Token, or Admin Email');
            }
            setSnackbarOpen(true);
            setIsUnique(false);
        } finally {
            setLoading(false);
        }
    }, 500);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const { name, value } = e.target as {
            name: keyof typeof createFormData;
            value: string;
        };

        setCreateFormData({ [name]: value });
        setErrors((prev) => ({ ...prev, [name]: '' }));
        setApiError(false);
        if (name === 'jira_project_key' && value.length >= 2) {
            void debouncedCheckKey(value);
        }
    };
    const isInvalidFormat =
        createFormData.jira_project_key.length > 0 &&
        !/^[A-Za-z]{2,10}$/.test(createFormData.jira_project_key);

    const isKeyDisabled =
        !createFormData.jira_url ||
        !createFormData.access_token ||
        !createFormData.lead_email;

    const isSubmitDisabled =
        !createFormData.jira_project_key ||
        isInvalidFormat ||
        isUnique === false ||
        apiError ||
        isKeyDisabled ||
        isSubmitting;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = projectCreateSchema.safeParse(createFormData);

        if (!result.success) {
            const fieldErrors: Record<string, string> = {};
            result.error.issues.forEach((err) => {
                const field = err.path[0] as string;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return;
        }

        createProjectMutation.mutate(result.data, {
            onSuccess: (newProject) => {
                reset();
                setIsUnique(false);
                setErrors({});
                useProjectStore.getState().setProject(newProject);
                void navigate(`/project/${newProject.jira_project_key}`);
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardBox>
                <Typography variant="h2" textAlign="center">
                    Project Creation
                </Typography>
                <TextField
                    label="Title"
                    name="title"
                    value={createFormData.title}
                    onChange={handleChange}
                    error={!!errors.title}
                    helperText={errors.title}
                    fullWidth
                    required
                />
                <TextField
                    label="Description"
                    name="description"
                    multiline
                    rows={5}
                    value={createFormData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    fullWidth
                />
                <TextField
                    label="JIRA Instance URL"
                    name="jira_url"
                    value={createFormData.jira_url}
                    onChange={handleChange}
                    error={!!errors.jira_url}
                    helperText={errors.jira_url}
                    fullWidth
                    required
                />
                <TextField
                    label="Access token"
                    name="access_token"
                    type={showPassword ? 'text' : 'password'}
                    value={createFormData.access_token}
                    onChange={handleChange}
                    error={!!errors.access_token}
                    helperText={errors.access_token}
                    fullWidth
                    required
                    slotProps={{
                        input: {
                            endAdornment: (
                                <IconButton
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    edge="end"
                                >
                                    {showPassword ? (
                                        <VisibilityOff fontSize="small" />
                                    ) : (
                                        <RemoveRedEye fontSize="small" />
                                    )}{' '}
                                </IconButton>
                            ),
                        },
                    }}
                />
                <TextField
                    label="Admin email"
                    name="lead_email"
                    type="email"
                    value={createFormData.lead_email}
                    onChange={handleChange}
                    error={!!errors.lead_email}
                    helperText={errors.lead_email}
                    fullWidth
                    required
                />
                <TextField
                    label="Key"
                    name="jira_project_key"
                    value={createFormData.jira_project_key}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={!!errors.jira_project_key}
                    sx={{
                        '& .MuiInputBase-root': {
                            borderColor:
                                isUnique && !isInvalidFormat
                                    ? theme.palette.success.main
                                    : theme.palette.error.main,
                            '&:hover': {
                                borderColor:
                                    isUnique && !isInvalidFormat
                                        ? theme.palette.success.main
                                        : theme.palette.error.dark,
                            },
                        },
                        '& .MuiFormHelperText-root': {
                            color:
                                isUnique && !isInvalidFormat
                                    ? theme.palette.primary.contrastText
                                    : theme.palette.error.contrastText,
                        },
                    }}
                    helperText={
                        isUnique === false
                              ? 'Key already exists'
                              : ''
                    }
                    slotProps={{
                        input: {
                            endAdornment: loading ? (
                                <CircularProgress size={18} />
                            ) : null,
                        },
                    }}
                    disabled={isKeyDisabled}
                />{' '}
                <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isSubmitDisabled}
                >
                    {isSubmitting ? (
                        <CircularProgress size={22} color="inherit" />
                    ) : (
                        'Submit'
                    )}
                </Button>
                <Snackbar
                    open={snackbarOpen}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <Alert
                        onClose={() => setSnackbarOpen(false)}
                        severity="error"
                    >
                        {snackbarMessage}
                    </Alert>
                </Snackbar>
            </CardBox>
        </form>
    );
};
