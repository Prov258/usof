import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { RootState } from '../../store';
import CommentForm from '../../components/comment/CommentForm';
import CommentsList from '../../components/comment/CommentsList';
import VoteButtons from '../../components/form/VoteButtons';
import Spinner from '../../components/Spinner';
import { postsApi } from '../../services/postApi';
import { url } from '../../utils/funcs';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { data: post, isLoading, isError } = postsApi.useGetPostByIdQuery(id);
    const { user } = useSelector((state: RootState) => state.auth);

    if (isLoading) {
        return <Spinner />;
    }

    if (!post || isError) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900">
                    Post not found
                </h2>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex space-x-4">
                    <VoteButtons
                        type={'post'}
                        id={post.id}
                        rating={post.rating}
                        userVote={post?.likes}
                    />

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {post.title}
                        </h1>

                        <div className="prose max-w-none mb-6">
                            {post.content}
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                            {post.categories.map((category) => (
                                <span
                                    key={category.id}
                                    className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                >
                                    {category.title}
                                </span>
                            ))}
                        </div>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                            <div className="flex items-center space-x-2">
                                <img
                                    src={url(post.author.avatar)}
                                    alt={post.author.login}
                                    className="h-8 w-8 rounded-full"
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

            <div className="mt-8">
                {user && (
                    <div className="mb-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Your Answer
                        </h3>
                        <CommentForm postId={post.id} />
                    </div>
                )}

                <CommentsList postId={post.id} />
            </div>
        </div>
    );
};

export default PostDetail;
