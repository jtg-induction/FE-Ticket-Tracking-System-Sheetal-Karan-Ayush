import { useState } from 'react';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    useTheme,
} from '@mui/material';

import { JiraImportDialogProps } from './JiraImportDialog.types';

export const JiraImportDialog = ({
    open,
    handleClose,
}: JiraImportDialogProps) => {
    const JIRA_TICKET_KEY_REGEX = /^[A-Z][A-Z0-9]+-\d+$/;
    const theme = useTheme();

    const [jiraKey, setJiraKey] = useState('');
    const [error, setError] = useState(false);

    const handleImport = () => {
        if (!error && jiraKey) {
            //TODO: call backend
            handleClose();
        }
    };

    const handleChange = (value: string) => {
        setJiraKey(value);
        setError(!JIRA_TICKET_KEY_REGEX.test(value.trim().toUpperCase()));
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Import Jira Ticket</DialogTitle>

            <DialogContent>
                <TextField
                    required
                    fullWidth
                    placeholder="e.g. PROJ-123"
                    value={jiraKey}
                    onChange={(e) => handleChange(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleImport()}
                    error={error}
                    helperText={
                        error
                            ? 'Invalid Jira ticket key format'
                            : 'Example: ABC-123'
                    }
                    sx={{
                        '& .MuiFormHelperText-root.Mui-error': {
                            color: theme.palette.error.contrastText,
                        },
                        '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline':
                            {
                                borderColor: theme.palette.error.contrastText,
                            },
                    }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button
                    variant="contained"
                    onClick={handleImport}
                    disabled={error || !jiraKey.trim()}
                >
                    Import
                </Button>
            </DialogActions>
        </Dialog>
    );
};
