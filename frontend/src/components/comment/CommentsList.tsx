import React from 'react';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import VoteButtons from '../form/VoteButtons';
import { useGetCommentsQuery } from '../../services/commentApi';
import Spinner from '../Spinner';
import { url } from '../../utils/funcs';

interface CommentsListProps {
    postId: number;
}

const CommentsList: React.FC<CommentsListProps> = ({ postId }) => {
    const {
        data: commentsData,
        isLoading,
        isError,
    } = useGetCommentsQuery(postId);

    if (isLoading) {
        return <Spinner />;
    }

    if (isError) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-red-600">
                    Failed to load comments
                </h2>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {commentsData?.data.length}{' '}
                {commentsData?.data.length === 1 ? 'Answer' : 'Answers'}
            </h2>
            {commentsData?.data.map((comment) => (
                <div
                    key={comment.id}
                    className="bg-white rounded-lg shadow-md p-6"
                >
                    <div className="flex space-x-4">
                        <VoteButtons
                            type={'comment'}
                            id={comment.id}
                            rating={comment.rating}
                            userVote={
                                comment?.likes?.length
                                    ? comment.likes[0]?.type
                                    : null
                            }
                        />

                        <div className="flex-1">
                            <div className="prose max-w-none mb-4">
                                {comment.content}
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                    <img
                                        src={url(comment.author.avatar)}
                                        alt={comment.author.login}
                                        className="h-6 w-6 rounded-full"
                                    />
                                    <span>{comment.author.login}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Clock className="h-4 w-4" />
                                    <span>
                                        {formatDistanceToNow(
                                            new Date(comment.createdAt),
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
    );
};

export default CommentsList;
