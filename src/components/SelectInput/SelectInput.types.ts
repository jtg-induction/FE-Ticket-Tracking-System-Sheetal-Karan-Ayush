type Option = {
    label: string;
    value: number;
};

export type SelectInputProps = {
    label: string;
    name?: string;
    error?: boolean;
    value: number;
    helperText?: string;
    onChange: (value: number) => void;
    options: Option[];
    required?: boolean;
    fullWidth?: boolean;
};
