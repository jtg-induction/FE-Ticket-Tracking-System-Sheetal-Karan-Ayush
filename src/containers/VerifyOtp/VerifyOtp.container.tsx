import { useState } from "react"

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import { AppDialog } from "@components/AppDialog/AppDialog.component";

import { VerifyOtpProps } from "./VerifyOtp.types";


export const VerifyOtpDialog = ({open, setOpen, handleVerify}: VerifyOtpProps) => {
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
        </AppDialog>
    );
}
