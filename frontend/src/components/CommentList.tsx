import { ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '../types';
import VoteButtons from './VoteButtons';

interface CommentListProps {
    comments: Comment[];
}

const CommentList = ({ comments }: CommentListProps) => {
    return (
        <div className="space-y-6">
            {comments.map((comment) => (
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
                                        src={`http://localhost:3000${comment.author.avatar}`}
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

export default CommentList;
