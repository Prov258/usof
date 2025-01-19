import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostFiltersType as FilterType } from '../types/index';
import { PostsList } from '../components/post/PostsList';
import { useGetPostsQuery } from '../services/postApi';
import PostFilters from '../components/post/PostFilters';

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterType>({
        title: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    const {
        data: postsData,
        isError,
        isLoading,
    } = useGetPostsQuery({ page: currentPage, filters });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = useCallback((value: string) => {
        setFilters((prevFilters) => ({ ...prevFilters, title: value }));
        setCurrentPage(1);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-900">Questions</h1>
                <Link
                    to="/create-post"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Ask Question
                </Link>
            </div>

            <PostFilters
                filters={filters}
                onFilterChange={setFilters}
                onSearch={handleSearch}
            />

            <div className="space-y-4">
                <PostsList
                    postsData={postsData}
                    isLoading={isLoading}
                    isError={isError}
                    handlePageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default Home;
