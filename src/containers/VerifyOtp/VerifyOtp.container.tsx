import { useState } from 'react';

import { Typography } from '@mui/material';
import TextField from '@mui/material/TextField';

import { DialogBox } from '@components';
import { theme } from '@theme';

import { VerifyOtpProps } from './VerifyOtp.types';

export const VerifyOtpDialog = ({
    open,
    setOpen,
    handleVerify,
    errorMsg,
    userMail
}: VerifyOtpProps) => {
    const [otp, setOtp] = useState<string>('');

    return (
        <DialogBox
            open={open}
            onClose={() => setOpen(false)}
            title={`Enter OTP sent to ${userMail}`}
            isSubmitDisabled={otp.length !== 6}
            onSubmit={() => handleVerify(Number(otp))}
            submitText='Verify'
        >
            <TextField
                type="text"
                label="OTP"
                fullWidth
                value={otp}
                onChange={(e) => {
                    const val = e.target.value;
                    setOtp(val);
                }}
            />
            <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.error.contrastText }}
            >
                {errorMsg}
            </Typography>
        </DialogBox>
    );
};
