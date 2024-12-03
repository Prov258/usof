import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { RootState } from '../store';
import CommentForm from '../components/CommentForm';
import CommentList from '../components/CommentList';
import { fetchPostById } from '../store/slices/postsSlice';
import { fetchCommentsForPost } from '../store/slices/commentsSlice';
import VoteButtons from '../components/VoteButtons';
import Spinner from '../components/Spinner';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const { currentPost, isLoading } = useSelector(
        (state: RootState) => state.posts,
    );
    const { user } = useSelector((state: RootState) => state.auth);
    const { comments } = useSelector((state: RootState) => state.comments);

    useEffect(() => {
        dispatch(fetchCommentsForPost(id));
        dispatch(fetchPostById(id));
        setLoading(false);
    }, [id]);

    if (loading || isLoading) {
        return <Spinner />;
    }

    if (!currentPost) {
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
                        id={currentPost.id}
                        rating={currentPost.rating}
                        userVote={
                            currentPost?.likes?.length
                                ? currentPost.likes[0]?.type
                                : null
                        }
                    />

                    <div className="flex-1">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">
                            {currentPost.title}
                        </h1>

                        <div className="prose max-w-none mb-6">
                            {currentPost.content}
                        </div>

                        <div className="flex items-center space-x-4 mb-4">
                            {currentPost.categories.map(({ category }) => (
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
                                    src={`http://localhost:3000${currentPost.author.avatar}`}
                                    alt={currentPost.author.login}
                                    className="h-8 w-8 rounded-full"
                                />
                                <span>{currentPost.author.login}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>
                                    {formatDistanceToNow(
                                        new Date(currentPost.createdAt),
                                    )}{' '}
                                    ago
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {comments.length}{' '}
                    {comments.length === 1 ? 'Answer' : 'Answers'}
                </h2>

                <CommentList comments={comments} />

                {user && (
                    <div className="mt-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Your Answer
                        </h3>
                        <CommentForm postId={currentPost.id} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default PostDetail;
