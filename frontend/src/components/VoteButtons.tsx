import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { votePost } from '../store/slices/postsSlice';
import { voteComment } from '../store/slices/commentsSlice';
import type { RootState } from '../store';

interface VoteButtonsProps {
    type: 'post' | 'comment';
    id: number;
    rating: number;
    userVote?: 'LIKE' | 'DISLIKE' | null;
}

export default function VoteButtons({
    type,
    id,
    rating,
    userVote,
}: VoteButtonsProps) {
    const dispatch = useDispatch();
    const { user } = useSelector((state: RootState) => state.auth);

    const handleVote = async (voteType: 'LIKE' | 'DISLIKE') => {
        if (!user) {
            return;
        }

        try {
            // If user clicks the same vote type, remove the vote
            const newVoteType = userVote === voteType ? null : voteType;

            if (type === 'post') {
                dispatch(votePost({ id, voteType: newVoteType }));
            } else {
                dispatch(voteComment({ id, voteType: newVoteType }));
            }
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-2">
            <button
                onClick={() => handleVote('LIKE')}
                disabled={!user || userVote === 'DISLIKE'}
                className={`p-2 rounded-full transition-colors ${
                    userVote === 'LIKE'
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-500 hover:bg-gray-100'
                } ${(!user || userVote === 'DISLIKE') && 'opacity-50 cursor-not-allowed'}`}
                title={
                    !user
                        ? 'Please login to vote'
                        : userVote === 'DISLIKE'
                          ? 'Remove your downvote first'
                          : userVote === 'LIKE'
                            ? 'Remove upvote'
                            : 'Upvote'
                }
            >
                <ThumbsUp className="h-5 w-5" />
            </button>

            <span
                className={`font-medium ${rating > 0 ? 'text-green-600' : rating < 0 ? 'text-red-600' : 'text-gray-600'}`}
            >
                {rating}
            </span>

            <button
                onClick={() => handleVote('DISLIKE')}
                disabled={!user || userVote === 'LIKE'}
                className={`p-2 rounded-full transition-colors ${
                    userVote === 'DISLIKE'
                        ? 'text-red-600 hover:bg-red-50'
                        : 'text-gray-500 hover:bg-gray-100'
                } ${(!user || userVote === 'LIKE') && 'opacity-50 cursor-not-allowed'}`}
                title={
                    !user
                        ? 'Please login to vote'
                        : userVote === 'LIKE'
                          ? 'Remove your upvote first'
                          : userVote === 'DISLIKE'
                            ? 'Remove downvote'
                            : 'Downvote'
                }
            >
                <ThumbsDown className="h-5 w-5" />
            </button>
        </div>
    );
}
