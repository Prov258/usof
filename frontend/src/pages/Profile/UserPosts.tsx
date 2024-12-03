import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, setCurrentPage } from '../../store/slices/postsSlice';
import { RootState } from '../../store';
import PostList from './PostList';
import UserPostFilters from './UserPostFilters';
import type { PostFiltersType as FilterType } from '../../types';
import { useDebounce } from '../../hooks/useDebounce';
import Spinner from '../../components/Spinner';

interface UserPostsProps {
    userId: number;
}

export default function UserPosts({ userId }: UserPostsProps) {
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce(inputValue, 300);
    const dispatch = useDispatch();
    const { posts, isLoading, currentPage, totalPages } = useSelector(
        (state: RootState) => state.posts,
    );
    const [filters, setFilters] = useState<FilterType>({
        title: '',
        categories: [],
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: 'all',
        authorId: userId,
    });

    useEffect(() => {
        dispatch(fetchPosts({ page: currentPage, filters }));
    }, [dispatch, userId, filters, currentPage]);

    const handleFilterChange = (newFilters: FilterType) => {
        setFilters(newFilters);
        dispatch(setCurrentPage(1));
    };

    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
    };

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
        dispatch(setCurrentPage(1));
    };

    useEffect(() => {
        dispatch(
            fetchPosts({
                page: currentPage,
                filters: { ...filters, title: debouncedInputValue },
            }),
        );
    }, [debouncedInputValue]);

    if (isLoading && !posts.length) {
        return <Spinner />;
    }

    return (
        <div className="space-y-6">
            <UserPostFilters
                filters={filters}
                onFilterChange={setFilters}
                onHandleInputChange={handleInputChange}
                inputValue={inputValue}
            />
            <PostList
                posts={posts}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
            />
        </div>
    );
}
