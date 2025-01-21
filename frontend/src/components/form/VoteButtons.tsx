import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import VoteButton from './VoteButton';
import { useVotePostMutation } from '../../services/postApi';
import { useVoteCommentMutation } from '../../services/commentApi';
import { Stack, Text } from '@mantine/core';

interface VoteButtonsProps {
    type: 'post' | 'comment';
    id: number;
    rating: number;
    userVote?: 'LIKE' | 'DISLIKE' | null;
}

const VoteButtons: React.FC<VoteButtonsProps> = ({
    type,
    id,
    rating,
    userVote,
}) => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [votePost] = useVotePostMutation();
    const [voteComment] = useVoteCommentMutation();

    const handleVote = async (voteType: 'LIKE' | 'DISLIKE') => {
        if (!user) return;

        // If user clicks the same vote type, remove the vote
        const newVoteType = userVote === voteType ? null : voteType;

        try {
            if (type === 'post') {
                await votePost({ id, type: newVoteType });
            } else {
                await voteComment({ id, type: newVoteType });
            }
        } catch (error) {
            console.error('Failed to vote:', error);
        }
    };

    return (
        <Stack align="center" gap={3}>
            <VoteButton
                voteType="LIKE"
                onClick={() => handleVote('LIKE')}
                disabled={!user || userVote === 'DISLIKE'}
                active={userVote === 'LIKE'}
            />

            <Text
                fw={500}
                c={rating > 0 ? 'green' : rating < 0 ? 'red' : 'dark'}
            >
                {rating}
            </Text>

            <VoteButton
                voteType="DISLIKE"
                onClick={() => handleVote('DISLIKE')}
                disabled={!user || userVote === 'LIKE'}
                active={userVote === 'DISLIKE'}
            />
        </Stack>
    );
};

export default VoteButtons;
