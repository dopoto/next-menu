import { type ReactNode } from 'react';
import Select, { type StylesConfig } from 'react-select';
import { cn } from '~/lib/utils';

export type SelectControlOptions = Array<{ value: string; label: ReactNode; searchLabel?: string }>;

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
    const customStyles: StylesConfig = {
        control: (provided) => ({
            ...provided,
            backgroundColor: 'var(--background)',
            borderColor: 'var(--border)',
            '&:hover': {
                borderColor: 'var(--border)',
            },
            zIndex: 99,
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: 'var(--background)',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? 'var(--accent)' : 'var(--background)',
            color: state.isFocused ? 'var(--accent-foreground)' : 'inherit',
        }),
    };

    return (
        <Select
            options={options}
            isSearchable={true}
            inputId={id}
            name={name}
            value={value}
            onChange={(newValue) => {
                if (onChange) {
                    onChange(newValue as { value: string; label: ReactNode } | null);
                }
            }}
            placeholder={placeholder}
            isDisabled={isDisabled}
            className={cn('rounded-md', className)}
            filterOption={(option, inputValue) => {
                const searchLabel = (option.data as SelectControlOptions[0]).searchLabel?.toLowerCase() ?? '';
                return searchLabel.includes(inputValue.toLowerCase());
            }}
            styles={customStyles}
            theme={(theme) => ({
                ...theme,
                colors: {
                    ...theme.colors,
                    neutral0: 'hsl(var(--background))',
                    neutral20: 'hsl(var(--border))',
                    neutral30: 'hsl(var(--border))',
                },
            })}
            {...props}
        />
    );
}
