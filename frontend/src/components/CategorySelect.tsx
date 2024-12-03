import React from 'react';
import { useController, Control, Controller } from 'react-hook-form';
import type { Category } from '../types';
import Select from 'react-select';

interface CategorySelectProps {
    categories: Category[];
    selectedCategories?: Category[];
    control: Control<any>;
    error?: string;
}

const CategorySelect = ({
    categories,
    control,
    error,
}: CategorySelectProps) => {
    return (
        <div>
            <label
                htmlFor="categories"
                className="block text-sm font-medium text-gray-700"
            >
                Categories
            </label>
            <Controller
                name={'categories'}
                control={control}
                render={({ field }) => {
                    return (
                        <Select
                            {...field}
                            options={categories.map((category) => ({
                                value: category.title,
                                label: category.title,
                            }))}
                            isMulti
                            isClearable
                            onChange={(selected) => {
                                // Transform the selected options to an array of values
                                field.onChange(
                                    selected
                                        ? selected.map((option) => option.value)
                                        : [],
                                );
                            }}
                            value={
                                field.value
                                    ? field.value.map((value: string) => ({
                                          value,
                                          label: value, // Assuming label is the same as value in this example
                                      }))
                                    : []
                            }
                        />
                    );
                }}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default CategorySelect;
