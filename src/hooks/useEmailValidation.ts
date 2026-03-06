import { useState } from "react";
import { isValidEmail } from "utils/validators/email";


export const useEmailValidation = () => {
    const [email, setEmail] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setIsInvalid(value.length > 0 && !isValidEmail(value));
    };
    return {
        email,
        isInvalid,
        handleChange,
    }

};