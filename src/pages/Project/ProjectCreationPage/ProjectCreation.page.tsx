import React, { useCallback, useState } from 'react';

import axios from 'axios';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { RemoveRedEye, VisibilityOff } from '@mui/icons-material';
import {
    Alert,
    Button,
    CircularProgress,
    Collapse,
    IconButton,
    Snackbar,
    Typography,
} from '@mui/material';

import { useSnackbarStore } from '@components';
import {
    projectCreateSchema,
    useCheckProjectKey,
    useCreateProject,
    useProjectStore,
} from '@features/project';
import { StyledErrorTextField } from '@pages/Register/Register.styles';

import { CardBox, TipsBox } from './projectCreationPage.style';

export const ProjectCreationPage = () => {
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbarStore();
    const [apiError, setApiError] = useState(false);
    const { createFormData, setCreateFormData, reset } = useProjectStore();
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isUnique, setIsUnique] = useState<boolean>();
    const [showPassword, setShowPassword] = useState(false);
    const createProjectMutation = useCreateProject();
    const isSubmitting = createProjectMutation.isPending;
    const checkKeyMutation = useCheckProjectKey();
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const validateField = (
        name: keyof typeof createFormData,
        value: string,
    ): string => {
        const schema = projectCreateSchema.shape[name] as z.ZodTypeAny;
        if (!schema) return '';
        const result = schema.safeParse(value);
        if (!result.success) {
            return result.error.issues[0]?.message ?? '';
        }
        return '';
    };

    const debouncedCheckKey = useCallback(
        debounce(async (value: string) => {
            setLoading(true);
            try {
                const currentData = useProjectStore.getState().createFormData;
                const res = await checkKeyMutation.mutateAsync({
                    key: value,
                    formData: {
                        jira_url: currentData.jira_url,
                        access_token: currentData.access_token,
                        lead_email: currentData.lead_email,
                    },
                });
                setIsUnique(res.valid);
            } catch (error: unknown) {
                setApiError(true);
                let message = 'Something went wrong, please try again.';
                if (
                    axios.isAxiosError(error) &&
                    error.response?.status === 502
                ) {
                    message =
                        'Unauthorized: Invalid Jira URL, Access Token, or Admin Email';
                }
                setSnackbarMessage(message);
                setSnackbarOpen(true);
                setIsUnique(false);
            } finally {
                setLoading(false);
            }
        }, 500),
        [checkKeyMutation],
    );

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const { name, value } = e.target as {
            name: keyof typeof createFormData;
            value: string;
        };

        const currentData = useProjectStore.getState().createFormData;
        const updatedData = { ...currentData, [name]: value };
        setCreateFormData(updatedData);

        setApiError(false);
        setTouched((prev) => ({ ...prev, [name]: true }));

        const error = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: error }));

        if (name === 'jira_project_key' && value.length >= 2 && !error) {
            void debouncedCheckKey(value);
        } else if (name === 'jira_project_key') {
            setIsUnique(undefined);
        }
    };

    const isInvalidFormat =
        createFormData.jira_project_key.length > 0 &&
        !/^[A-Za-z]{2,10}$/.test(createFormData.jira_project_key);

    const isKeyDisabled =
        !!validateField('jira_url', createFormData.jira_url) ||
        !!validateField('access_token', createFormData.access_token) ||
        !!validateField('lead_email', createFormData.lead_email);

    const isSubmitDisabled =
        !createFormData.jira_project_key ||
        isInvalidFormat ||
        isUnique === false ||
        apiError ||
        isKeyDisabled ||
        isSubmitting;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const allFields = Object.keys(
            createFormData,
        ) as (keyof typeof createFormData)[];
        const allTouched = allFields.reduce(
            (acc, field) => ({ ...acc, [field]: true }),
            {} as Record<string, boolean>,
        );
        setTouched(allTouched);

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
                setTouched({});
                showSnackbar('Project created successfully.', 'success');
                useProjectStore.getState().setProject(newProject);
                void navigate(`/project/${newProject.jira_project_key}`);
            },
            onError: () => {
                showSnackbar('Failed to create project. Please try again...', 'error');
            },
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardBox>
                <Typography variant="h2" textAlign="center">
                    Project Creation
                </Typography>
                <StyledErrorTextField
                    label="Title"
                    name="title"
                    value={createFormData.title}
                    onChange={handleChange}
                    error={touched.title && !!errors.title}
                    helperText={touched.title ? errors.title : ''}
                    fullWidth
                    required
                />
                <StyledErrorTextField
                    label="Description"
                    name="description"
                    multiline
                    rows={5}
                    value={createFormData.description}
                    onChange={handleChange}
                    error={touched.description && !!errors.description}
                    helperText={touched.description ? errors.description : ''}
                    fullWidth
                />
                <StyledErrorTextField
                    label="JIRA Instance URL"
                    name="jira_url"
                    value={createFormData.jira_url}
                    onChange={handleChange}
                    error={touched.jira_url && !!errors.jira_url}
                    helperText={touched.jira_url ? errors.jira_url : ''}
                    fullWidth
                    required
                />
                <StyledErrorTextField
                    label="Access token"
                    name="access_token"
                    type={showPassword ? 'text' : 'password'}
                    value={createFormData.access_token}
                    onChange={handleChange}
                    error={touched.access_token && !!errors.access_token}
                    helperText={touched.access_token ? errors.access_token : ''}
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
                                    )}
                                </IconButton>
                            ),
                        },
                    }}
                />
                <StyledErrorTextField
                    label="Admin email"
                    name="lead_email"
                    type="email"
                    value={createFormData.lead_email}
                    onChange={handleChange}
                    error={touched.lead_email && !!errors.lead_email}
                    helperText={touched.lead_email ? errors.lead_email : ''}
                    fullWidth
                    required
                />
                <StyledErrorTextField
                    label="Key"
                    name="jira_project_key"
                    value={createFormData.jira_project_key}
                    onChange={handleChange}
                    fullWidth
                    required
                    error={
                        (touched.jira_project_key &&
                            !createFormData.jira_project_key) ||
                        isInvalidFormat ||
                        isUnique === false
                    }
                    helperText={
                        !createFormData.jira_project_key &&
                        touched.jira_project_key
                            ? 'Key cannot be blank'
                            : isInvalidFormat
                              ? errors.jira_project_key
                              : isUnique === false
                                ? 'Key already exists'
                                : isUnique === true
                                  ? 'Key is available ✓'
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
                />
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
                <Collapse in>
                    <TipsBox>
                        <Typography
                            variant="subtitle2"
                            fontWeight="bold"
                            gutterBottom
                        >
                            Pro Tips
                        </Typography>
                        <ul
                            style={{
                                margin: 0,
                                paddingLeft: '1.5rem',
                            }}
                        >
                            <li>
                                Use a short, memorable project key (e.g.,
                                &quot;DEV&quot;, &quot;MARKET&quot;)
                            </li>
                            <li>
                                Your access token needs{' '}
                                <strong>write permissions</strong> for project
                                creation
                            </li>
                            <li>
                                The admin email must be a valid user in your
                                Jira instance
                            </li>
                        </ul>
                    </TipsBox>
                </Collapse>
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
