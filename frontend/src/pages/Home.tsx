import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { PostFiltersType as FilterType } from '../types/index';
import { PostsList } from '../components/post/PostsList';
import { useGetPostsQuery } from '../services/postApi';
import PostFilters from '../components/post/PostFilters';
import { Button, Container, Group, Stack, Title } from '@mantine/core';
import { PlusSquare } from 'lucide-react';

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterType>({
        title: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        categories: [],
    });
    const {
        data: postsData,
        isError,
        isLoading,
    } = useGetPostsQuery({ page: currentPage, filters });

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = useCallback((value: string) => {
        setFilters((prevFilters) => ({ ...prevFilters, title: value }));
        setCurrentPage(1);
    }, []);

    const handleFilterChange = useCallback((newFilter: Partial<FilterType>) => {
        setFilters((prevFilters) => ({ ...prevFilters, ...newFilter }));
        setCurrentPage(1);
    }, []);

    return (
        <Container size="lg">
            <Group justify="space-between" mb="lg">
                <Title order={2}>Questions</Title>
                <Button
                    variant="light"
                    leftSection={<PlusSquare size={20} />}
                    component={Link}
                    to="/create-post"
                >
                    Ask Question
                </Button>
            </Group>

            <PostFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onSearch={handleSearch}
            />

            <Stack>
                <PostsList
                    postsData={postsData}
                    isLoading={isLoading}
                    isError={isError}
                    handlePageChange={handlePageChange}
                />
            </Stack>
        </Container>
    );
};

export default Home;
