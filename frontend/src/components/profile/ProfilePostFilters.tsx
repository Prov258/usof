import React, { useEffect } from 'react';
import type { PostFiltersType } from '../../types';
import { useForm } from 'react-hook-form';
import CategorySelect from '../CategorySelect';
import { SearchBar } from '../form/SearchBar';

interface ProfilePostFiltersProps {
    filters: PostFiltersType;
    onFilterChange: (filters: PostFiltersType) => void;
    onSearch: (value: string) => void;
}

const ProfilePostFilters: React.FC<ProfilePostFiltersProps> = ({
    filters,
    onFilterChange,
    onSearch,
}) => {
    const { register, watch, control } = useForm<PostFiltersType>({
        defaultValues: filters,
    });

    useEffect(() => {
        const subscription = watch((value) => {
            onFilterChange(value as PostFiltersType);
        });
        return () => subscription.unsubscribe();
    }, [watch, onFilterChange]);

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <SearchBar onSearch={onSearch} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <CategorySelect control={control} error={undefined} />
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
};

export default ProfilePostFilters;
