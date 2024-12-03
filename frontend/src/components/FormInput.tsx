const FormInput = ({ name, type, label, errors, register }) => {
    return (
        <div>
            <label
                htmlFor={name}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input
                type={type}
                id={name}
                {...register(name)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {errors[name] && (
                <p className="mt-1 text-sm text-red-600">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
};

export default FormInput;
