import React from 'react';
import type { Category } from '../../types';
import { useGetCategoriesQuery } from '../../services/categoryApi';
import { Center, Loader, MultiSelect, Text } from '@mantine/core';

interface CategorySelectProps {
    selectedCategories?: Category[];
    error?: string;
    onChange: (value: { categories: string[] }) => void;
    categoryValues?: string[];
}

const CategorySelect: React.FC<CategorySelectProps> = ({
    error,
    selectedCategories,
    onChange,
    categoryValues,
}) => {
    const {
        data: categoriesData,
        isLoading,
        isError,
    } = useGetCategoriesQuery();

    if (isLoading) {
        return (
            <Center h="200">
                <Loader color="blue" size="lg" />
            </Center>
        );
    }

    if (isError) {
        return (
            <Center h="200">
                <Text c="red" size="xl" fw={700}>
                    Failed to load categories
                </Text>
            </Center>
        );
    }

    return (
        <MultiSelect
            label="Categories"
            placeholder="Pick value"
            clearable
            searchable
            data={categoriesData?.data.map((c) => ({
                value: c.title,
                label: c.title,
            }))}
            value={categoryValues}
            defaultValue={selectedCategories?.map((c) => c.title)}
            onChange={(value) => onChange({ categories: value })}
            error={error}
        />
    );
};

export default CategorySelect;
