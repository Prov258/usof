import React from 'react';
import { Link } from 'react-router-dom';
import VoteButtons from '../form/VoteButtons';
import { Clock, Edit } from 'lucide-react';
import Spinner from '../Spinner';
import { formatDistanceToNow } from 'date-fns';
import { Paginated, Post } from '../../types';
import { url } from '../../utils/funcs';
import Pagination from '../Pagination';

interface PostsListsProps {
    postsData: Paginated<Post>;
    isLoading: boolean;
    isError: boolean;
    handlePageChange: (page: number) => void;
    editable: boolean;
}

export const PostsList: React.FC<PostsListsProps> = ({
    postsData: postsData,
    isLoading,
    isError,
    handlePageChange,
    editable = false,
}) => {
    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-red-600">
                    Failed to load posts
                </h2>
            </div>
        );
    }

    return (
        <>
            {postsData.data.map((post: Post) => (
                <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start space-x-4">
                        <VoteButtons
                            type={'post'}
                            id={post.id}
                            rating={post.rating}
                            userVote={post?.likes}
                        />
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <Link
                                    to={`/posts/${post.id}`}
                                    className="block"
                                >
                                    <h2 className="text-xl font-semibold text-gray-900 hover:text-indigo-600">
                                        {post.title}
                                    </h2>
                                </Link>
                                {editable && (
                                    <Link
                                        to={`/posts/${post.id}/edit`}
                                        className="flex items-center text-gray-500 hover:text-indigo-600"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Link>
                                )}
                            </div>
                            <p className="mt-2 text-gray-600 line-clamp-2">
                                {post.content}
                            </p>

                            <div className="mt-4 flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    {post.categories.map((category) => (
                                        <span
                                            key={category.id}
                                            className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                        >
                                            {category.title}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={url(post.author.avatar)}
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
            {postsData.meta.pageCount > 1 && (
                <Pagination
                    currentPage={postsData.meta.page}
                    totalPages={postsData.meta.pageCount}
                    onPageChange={handlePageChange}
                />
            )}
        </>
    );
};
