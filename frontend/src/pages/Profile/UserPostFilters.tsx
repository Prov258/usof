import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import type { PostFiltersType } from '../../types';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import CategorySelect from '../../components/CategorySelect';

interface UserPostFiltersProps {
    filters: PostFiltersType;
    onFilterChange: (filters: PostFiltersType) => void;
}

export default function UserPostFilters({
    filters,
    onFilterChange,
    onHandleInputChange,
    inputValue,
}: UserPostFiltersProps) {
    const { categories } = useSelector((state: RootState) => state.categories);
    const { register, watch, control } = useForm<PostFiltersType>({
        defaultValues: filters,
    });

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        const subscription = watch((value) => {
            onFilterChange(value as PostFiltersType);
        });
        return () => subscription.unsubscribe();
    }, [watch, onFilterChange]);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={onHandleInputChange}
                    placeholder="Search questions by title..."
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CategorySelect
                    categories={categories}
                    control={control}
                    error={undefined}
                />
                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categories
                    </label>
                    <select
                        {...register('categories')}
                        multiple
                        className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.title}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div> */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                    </label>
                    <select
                        {...register('sortBy')}
                        className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="createdAt">createdAt</option>
                        <option value="rating">rating</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                    </label>
                    <select
                        {...register('sortOrder')}
                        className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        {...register('status')}
                        className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div> */}
            </div>
        </div>
    );
}
