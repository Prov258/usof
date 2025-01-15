import React, { useCallback, useState } from 'react';
import ProfilePostFilters from '../../components/profile/ProfilePostFilters';
import type { PostFiltersType } from '../../types';
import { useGetPostsQuery } from '../../services/postApi';
import { PostsList } from '../../components/post/PostsList';

interface ProfilePostsProps {
    userId: number;
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ userId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<PostFiltersType>({
        title: '',
        categories: [],
        sortBy: 'createdAt',
        sortOrder: 'desc',
        status: 'all',
        authorId: userId,
    });

    const {
        data: postsData,
        isError,
        isLoading,
    } = useGetPostsQuery({ page: currentPage, filters });

    const handleFilterChange = (newFilters: PostFiltersType) => {
        setFilters(newFilters);
        setCurrentPage(1);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = useCallback((value: string) => {
        setFilters((prevFilters) => ({ ...prevFilters, title: value }));
        setCurrentPage(1);
    }, []);

    return (
        <div className="space-y-6">
            <ProfilePostFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
            />
            <PostsList
                postsData={postsData}
                isLoading={isLoading}
                isError={isError}
                handlePageChange={handlePageChange}
                editable={true}
            />
        </div>
    );
};

export default ProfilePosts;
