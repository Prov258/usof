import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { ActionIcon } from '@mantine/core';

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
    const activeColor = voteType === 'LIKE' ? 'green' : 'red';
    const inactiveColor = 'gray';

    return (
        <ActionIcon
            variant="subtle"
            radius="xl"
            c={active ? activeColor : inactiveColor}
            disabled={disabled}
            onClick={onClick}
            title={
                !disabled
                    ? active
                        ? `Remove ${voteType.toLowerCase()}`
                        : voteType === 'LIKE'
                          ? 'Upvote'
                          : 'Downvote'
                    : 'Please login or remove another vote'
            }
        >
            <Icon size={20} />
        </ActionIcon>
    );
};

export default VoteButton;
