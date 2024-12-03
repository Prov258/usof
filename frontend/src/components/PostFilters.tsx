import React from 'react';
import { useForm } from 'react-hook-form';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import { PostFiltersType } from '../types';

interface PostFiltersProps {
    onFilterChange: (filters: PostFiltersType) => void;
}

export default function PostFilters({ onFilterChange }: PostFiltersProps) {
    // const { categories } = useSelector((state: RootState) => state.categories);
    // const [showFilters, setShowFilters] = React.useState(false);
    const { register, watch } = useForm<PostFiltersType>({
        defaultValues: {
            title: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        },
    });

    React.useEffect(() => {
        const subscription = watch((value) => {
            onFilterChange(value as PostFiltersType);
        });
        return () => subscription.unsubscribe();
    }, [watch, onFilterChange]);

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        {...register('title')}
                        placeholder="Search posts..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                {/* <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>Filters</span>
                </button> */}
            </div>

            {/* {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Categories
                        </label>
                        <select
                            multiple
                            {...register('categories')}
                            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Sort By
                        </label>
                        <select
                            {...register('sortBy')}
                            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        >
                            <option value="rating">rating</option>
                            <option value="createdAt">createdAt</option>
                        </select>
                    </div>
                </div>
            )} */}
        </div>
    );
}
