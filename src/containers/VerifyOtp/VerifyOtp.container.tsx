import { useState } from "react"

import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { AppDialog } from "@components/AppDialog/AppDialog.component";
import { theme } from "@theme";

import { VerifyOtpProps } from "./VerifyOtp.types";


export const VerifyOtpDialog = ({open, setOpen, handleVerify, errorMsg}: VerifyOtpProps) => {
    const [otp, setOtp] = useState<string>("");

    return (
        <AppDialog 
        open={open} 
        onClose={() => setOpen(false)} 
        title="Enter OTP" 
        actions={
            <Button 
                variant="contained" 
                onClick={() => handleVerify(Number(otp))}
                disabled={otp.length!==6}
            >
                Verify
            </Button>
        }
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
        <Typography variant='subtitle2' sx={{ color: theme.palette.error.contrastText }}>
            {errorMsg}
        </Typography>
        </AppDialog>
    );
}
