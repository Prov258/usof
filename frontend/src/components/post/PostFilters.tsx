import React from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { PostFiltersType } from '../../types';
import { SearchBar } from '../form/SearchBar';
import { Box, Button, Group, Select, SimpleGrid } from '@mantine/core';
import CategorySelect from '../form/CategorySelect';

interface PostFiltersProps {
    filters: PostFiltersType;
    onFilterChange: (newFilter: Partial<PostFiltersType>) => void;
    onSearch: (value: string) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({
    filters,
    onFilterChange,
    onSearch,
}) => {
    const [showFilters, setShowFilters] = React.useState(false);

    return (
        <Box mb="md">
            <Group>
                <Box style={{ flexGrow: 1 }}>
                    <SearchBar onSearch={onSearch} />
                </Box>

                <Button
                    variant="transparent"
                    leftSection={<SlidersHorizontal size={20} />}
                    onClick={() => setShowFilters(!showFilters)}
                >
                    Filters
                </Button>
            </Group>

            {showFilters && (
                <SimpleGrid cols={{ base: 1, md: 3 }} mt="md">
                    <CategorySelect
                        onChange={onFilterChange}
                        categoryValues={filters.categories}
                    />
                    <Select
                        label="Sort By"
                        allowDeselect={false}
                        data={[
                            { value: 'rating', label: 'Rating' },
                            { value: 'createdAt', label: 'Create Date' },
                        ]}
                        value={filters.sortBy}
                        onChange={(value) =>
                            onFilterChange({
                                sortBy: value as
                                    | 'rating'
                                    | 'createdAt'
                                    | undefined,
                            })
                        }
                    />
                    <Select
                        label="Sort Order"
                        allowDeselect={false}
                        data={[
                            { value: 'desc', label: 'Descending' },
                            { value: 'asc', label: 'Ascending' },
                        ]}
                        value={filters.sortOrder}
                        onChange={(value) =>
                            onFilterChange({
                                sortOrder: value as 'desc' | 'asc' | undefined,
                            })
                        }
                    />
                </SimpleGrid>
            )}
        </Box>
    );
};

export default PostFilters;
