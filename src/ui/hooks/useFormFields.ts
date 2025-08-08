import { useState, ChangeEvent } from "react";

/**
 * useFormFields - Custom hook for managing form fields generically
 */
function useFormFields<T extends Record<string, string>>(initialFields: T) {
    const [fields, setFields] = useState<T>(initialFields);

    const onChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        let fieldValue: string = value;
        setFields((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));
    };

    return { fields, onChange, setFields };
}

export default useFormFields;
