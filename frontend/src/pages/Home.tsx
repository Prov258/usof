import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    ThumbsUp,
    MessageCircle,
    Clock,
    ThumbsDown,
    Search,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fetchPosts, setCurrentPage } from '../store/slices/postsSlice';
import type { RootState } from '../store';
import PostFilters from '../components/PostFilters';
import { PostFiltersType as FilterType } from '../types/index';
import Pagination from '../components/Pagination';
import VoteButtons from '../components/VoteButtons';
import { useDebounce } from '../hooks/useDebounce';
import Spinner from '../components/Spinner';

const Home = () => {
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce(inputValue, 300);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { posts, isLoading, error, currentPage, totalPages } = useSelector(
        (state: RootState) => state.posts,
    );

    const [filters, setFilters] = useState<FilterType>({
        title: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    useEffect(() => {
        dispatch(fetchPosts({ page: currentPage, filters }));
        setLoading(false);
    }, [dispatch, currentPage, filters]);

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

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-red-600">
                    Error: {error}
                </h2>
            </div>
        );
    }

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

            <div className="relative">
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Search questions by title..."
                    className="w-full px-4 py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <div className="space-y-4">
                {isLoading ||
                    posts.map((post) => (
                        <div
                            key={post.id}
                            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start space-x-4">
                                <VoteButtons
                                    type={'post'}
                                    id={post.id}
                                    rating={post.rating}
                                    userVote={
                                        post?.likes?.length
                                            ? post.likes[0]?.type
                                            : null
                                    }
                                />
                                <div className="flex-1">
                                    <Link
                                        to={`/posts/${post.id}`}
                                        className="block"
                                    >
                                        <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                                            {post.title}
                                        </h2>
                                    </Link>
                                    <p className="mt-2 text-gray-600 line-clamp-2">
                                        {post.content}
                                    </p>

                                    <div className="mt-4 flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            {post.categories.map(
                                                ({ category }) => (
                                                    <span
                                                        key={category.id}
                                                        className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                                    >
                                                        {category.title}
                                                    </span>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <img
                                                src={`http://localhost:3000${post.author.avatar}`}
                                                alt={post.author.login}
                                                className="h-6 w-6 rounded-full"
                                            />
                                            <span>{post.author.login}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {formatDistanceToNow(
                                                    new Date(post.createdAt),
                                                )}{' '}
                                                ago
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
};

export default Home;
