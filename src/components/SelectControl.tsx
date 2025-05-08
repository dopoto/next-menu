import Select from 'react-select'
import { type ReactNode } from 'react'

export type SelectControlOptions = Array<{value: string, label: ReactNode, searchLabel?: string}>;

export interface SelectControlProps {
    options: SelectControlOptions;
    id?: string;
    name?: string;
    value?: { value: string; label: ReactNode };
    onChange?: (value: { value: string; label: ReactNode } | null) => void;
    placeholder?: string;
    isDisabled?: boolean;
    className?: string;
}

export function SelectControl({
    options,
    id,
    name,
    value,
    onChange,
    placeholder,
    isDisabled,
    className,
    ...props
}: SelectControlProps) {
    return (
        <Select 
            options={options}
            isSearchable={true}
            inputId={id}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            isDisabled={isDisabled}
            className={className}
            filterOption={(option, inputValue) => {
                const searchLabel = (option.data as SelectControlOptions[0]).searchLabel?.toLowerCase() ?? '';
                return searchLabel.includes(inputValue.toLowerCase());
            }}
            {...props}
        />
    )
}