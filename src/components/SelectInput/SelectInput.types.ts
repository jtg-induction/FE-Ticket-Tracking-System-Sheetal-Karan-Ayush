type Option = {
    label: string;
    value: number;
};

export type SelectInputProps = {
    label: string;
    value: number;
    onChange: (value: number) => void;
    options: Option[];
    required?: boolean;
    fullWidth?: boolean;
};
