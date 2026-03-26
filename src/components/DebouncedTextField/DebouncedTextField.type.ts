import { TextFieldProps } from "@mui/material";

export interface DebouncedSearchFieldProps extends Omit<TextFieldProps, 'onChange'> {
    value?: string;
    delay?: number;
    onChange: (value: string) => void;
}
