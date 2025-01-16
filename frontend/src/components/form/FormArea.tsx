import React from 'react';

interface FormAreaProps {
    name: string;
    label: string;
    rows: number;
    placeholder: string;
    errors: any;
    register: any;
}

const FormArea: React.FC<FormAreaProps> = ({
    name,
    label,
    rows,
    placeholder,
    errors,
    register,
}) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <textarea
                id={name}
                rows={rows}
                {...register(name)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                placeholder={placeholder}
            />
            {errors[name] && (
                <p className="mt-1 text-sm text-red-600">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
};

export default FormArea;
