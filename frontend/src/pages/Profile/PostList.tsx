import { Link } from 'react-router-dom';
import { ThumbsUp, MessageCircle, Clock, Edit } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Post } from '../../types';
import Pagination from '../../components/Pagination';

interface PostListProps {
    posts: Post[];
    totalPages: number;
    currentPage: number;
}

export default function PostList({
    posts,
    currentPage,
    totalPages,
    handlePageChange,
}: PostListProps) {
    if (!posts.length) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">No posts found</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {posts.map((post) => (
                <div
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                    <div className="flex items-start space-x-4">
                        <div className="flex flex-col items-center space-y-2">
                            <div className="flex flex-col items-center text-gray-500">
                                <ThumbsUp className="h-6 w-6" />
                                <span className="text-sm font-medium">
                                    {post.rating}
                                </span>
                            </div>
                            <div className="flex flex-col items-center text-gray-500">
                                <MessageCircle className="h-6 w-6" />
                                <span className="text-sm">
                                    {post.commentsCount}
                                </span>
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <Link
                                    to={`/posts/${post.id}`}
                                    className="text-xl font-semibold text-gray-900 hover:text-indigo-600"
                                >
                                    {post.title}
                                </Link>
                                <Link
                                    to={`/posts/${post.id}/edit`}
                                    className="flex items-center text-gray-500 hover:text-indigo-600"
                                >
                                    <Edit className="h-5 w-5" />
                                </Link>
                            </div>

                            <p className="mt-2 text-gray-600 line-clamp-2">
                                {post.content}
                            </p>

                            <div className="mt-4 flex items-center space-x-2">
                                {post.categories.map(({ category }) => (
                                    <span
                                        key={category.id}
                                        className="px-2 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                    >
                                        {category.title}
                                    </span>
                                ))}
                            </div>

                            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                <span
                                    className={`px-2 py-1 rounded-full text-sm ${
                                        post.status === 'active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-800'
                                    }`}
                                >
                                    {post.status}
                                </span>
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

            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
        </div>
    );
}
