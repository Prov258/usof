import React from 'react';
import { Control, Controller } from 'react-hook-form';
import type { Category } from '../types';
import Select from 'react-select';
import { useGetCategoriesQuery } from '../services/categoryApi';
import Spinner from './Spinner';

interface CategorySelectProps {
    selectedCategories?: Category[];
    control: Control<any>;
    error?: string;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ control, error }) => {
    const {
        data: categoriesData,
        isLoading,
        isError,
    } = useGetCategoriesQuery();

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-red-600">
                    Failed to load categories
                </h2>
            </div>
        );
    }

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
                            options={categoriesData?.data.map((category) => ({
                                value: category.title,
                                label: category.title,
                            }))}
                            isMulti
                            isClearable
                            onChange={(selected) => {
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
                                          label: value,
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
