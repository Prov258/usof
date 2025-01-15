import React from 'react';
import { useForm } from 'react-hook-form';
import { SlidersHorizontal } from 'lucide-react';
import { PostFiltersType } from '../types';
import CategorySelect from './CategorySelect';
import { SearchBar } from './form/SearchBar';

interface PostFiltersProps {
    onFilterChange: (filters: PostFiltersType) => void;
    onSearch: (value: string) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({
    onFilterChange,
    onSearch,
}) => {
    const [showFilters, setShowFilters] = React.useState(false);
    const { register, control, watch } = useForm<PostFiltersType>({
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
                <div className="flex-1">
                    <SearchBar onSearch={onSearch} />
                </div>

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-indigo-600"
                >
                    <SlidersHorizontal className="h-5 w-5" />
                    <span>Filters</span>
                </button>
            </div>

            {showFilters && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm">
                    <CategorySelect control={control} error={''} />

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
            )}
        </div>
    );
};

export default PostFilters;
