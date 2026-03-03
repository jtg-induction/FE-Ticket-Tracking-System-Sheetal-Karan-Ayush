import React, { useState } from 'react';

import {
    Button,
    CircularProgress,
    TextField,
    Typography,
} from '@mui/material';

import { CardBox } from './ProjectCreationPage.style';

interface FormData {
    title: string;
    description: string;
    jira_instance_url: string;
    access_token: string;
    admin_email: string;
    key:string;
}

export const ProjectCreationPage = () => {
    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
        jira_instance_url: '',
        access_token: '',
        admin_email: '',
        key: '',
    });
    const [isUnique, setIsUnique] = useState<boolean | null>(null);
     const [loading, setLoading] = useState(false);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setIsUnique(null);
    };
    const isInvalidFormat =
        formData.key.length > 0 && !/^[A-Za-z]{2,10}$/.test(formData.key);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
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
                fullWidth
            />

            <TextField
                label="JIRA Instance URL"
                name="jira_instance"
                value={formData.jira_instance_url}
                onChange={handleChange}
                fullWidth
                required
            />

            <TextField
                label="Access token"
                name="access_token"
                type="password"
                value={formData.access_token}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Admin email"
                name="admin_email"
                type="email"
                value={formData.admin_email}
                onChange={handleChange}
                fullWidth
                required
            />
            <TextField
                label="Key"
                name="key"
                value={formData.key}
                onChange={handleChange}
                fullWidth
                required
                error={isInvalidFormat || isUnique === false}
                color={isUnique ? 'success' : 'primary'}
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
            />
            <Button type="submit" variant="contained" size="large">
                Submit
            </Button>
        </CardBox>
    );
};
