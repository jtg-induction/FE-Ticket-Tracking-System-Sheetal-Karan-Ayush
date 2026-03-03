import React, { useState } from 'react';

import { debounce } from 'lodash';

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
    const { formData, setFormData, reset } = useProjectStore();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isUnique, setIsUnique] = useState<boolean | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const createProjectMutation = useCreateProject();
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
                    jira_url: formData.jira_url,
                    access_token: formData.access_token,
                    lead_email: formData.lead_email,
                },
            });
            setIsUnique(res.valid);
        } catch(error) {
             if (error.response && error.response.status === 502) {
                 setSnackbarMessage(
                     'Unauthorized: Invalid Jira URL, Access Token, or Admin Email',
                 );
             } else {
                 setSnackbarMessage('Something went wrong, please try again.');
             }
             setSnackbarOpen(true); 
            setIsUnique(null);
        } finally {
            setLoading(false);
        }
    }, 500);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const { name, value } = e.target as {
            name: keyof typeof formData;
            value: string;
        };

        setFormData({ [name]: value });
        setErrors((prev) => ({ ...prev, [name]: '' }));

        if (name === 'jira_project_key' && value.length >= 2) {
            void debouncedCheckKey(value);
        }
    };
    const isInvalidFormat =
        formData.jira_project_key.length > 0 &&
        !/^[A-Za-z]{2,10}$/.test(formData.jira_project_key);

    const isSubmitDisabled =
        !formData.jira_project_key || isInvalidFormat || isUnique === false;

    const isKeyDisabled =
        !formData.jira_url || !formData.access_token || !formData.lead_email;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const result = projectCreateSchema.safeParse(formData);

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
            onSuccess: () => {
                reset();
                setIsUnique(null);
                setErrors({});
            },
        });
    };

    return (
        <CardBox component="form" onSubmit={handleSubmit}>
            <Typography variant="h2" textAlign="center">
                Project Creation
            </Typography>
            <TextField
                label="Title"
                name="title"
                value={formData.title}
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
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                fullWidth
            />
            <TextField
                label="JIRA Instance URL"
                name="jira_url"
                value={formData.jira_url}
                onChange={handleChange}
                error={!!errors.jira_url}
                helperText={errors.jira_url}
                fullWidth
                required
            />
            <TextField
                label="Access token"
                name="access_token"
                type={showPassword ? 'text' : 'password'} // Toggle type based on state
                value={formData.access_token}
                onChange={handleChange}
                error={!!errors.access_token}
                helperText={errors.access_token}
                fullWidth
                required
                slotProps={{
                    input: {
                        endAdornment: (
                            <IconButton
                                onClick={() => setShowPassword((prev) => !prev)} // Toggle visibility
                                edge="end"
                            >
                                {showPassword ? (
                                    <VisibilityOff size={18} />
                                ) : (
                                    <RemoveRedEye size={18} />
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
                value={formData.lead_email}
                onChange={handleChange}
                error={!!errors.lead_email}
                helperText={errors.lead_email}
                fullWidth
                required
            />
            <TextField
                label="Key"
                name="jira_project_key"
                value={formData.jira_project_key}
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
                    isInvalidFormat
                        ? 'Key must contain only 2-10 letters'
                        : isUnique === false
                          ? 'Key already exists'
                          : isUnique === true
                            ? 'Key is available ✓'
                            : 'Key must be unique with 2-10 letters'
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
                Submit
            </Button>
            <Snackbar
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="error">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </CardBox>
    );
};
