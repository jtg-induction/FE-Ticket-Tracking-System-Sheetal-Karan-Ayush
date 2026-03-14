export type VerifyOtpProps = {
    open: boolean;
    setOpen: (val: boolean) => void;
    handleVerify: (val: number) => void;
    errorMsg: string;
};
