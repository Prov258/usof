import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface VoteButtonProps {
    voteType: 'LIKE' | 'DISLIKE';
    onClick: () => void;
    disabled: boolean;
    active: boolean;
}

const VoteButton: React.FC<VoteButtonProps> = ({
    voteType,
    onClick,
    disabled,
    active,
}) => {
    const Icon = voteType === 'LIKE' ? ThumbsUp : ThumbsDown;
    const activeClass =
        voteType === 'LIKE'
            ? 'text-green-600 hover:bg-green-50'
            : 'text-red-600 hover:bg-red-50';
    const inactiveClass = 'text-gray-500 hover:bg-gray-100';

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded-full transition-colors ${active ? activeClass : inactiveClass} ${disabled && 'opacity-50 cursor-not-allowed'}`}
            title={
                !disabled
                    ? active
                        ? `Remove ${voteType.toLowerCase()}`
                        : voteType === 'LIKE'
                          ? 'Upvote'
                          : 'Downvote'
                    : 'Please login to vote'
            }
        >
            <Icon className="h-5 w-5" />
        </button>
    );
};

export default VoteButton;
