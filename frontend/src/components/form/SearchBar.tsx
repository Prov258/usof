import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '@mantine/core';

interface SearchBarProps {
    onSearch: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
    const [inputValue, setInputValue] = useState('');
    const debouncedInputValue = useDebounce(inputValue, 300);

    useEffect(() => {
        onSearch(debouncedInputValue);
    }, [debouncedInputValue, onSearch]);

    return (
        <Input
            type="text"
            placeholder="Search questions by title..."
            leftSection={<Search className="h-5 w-5 text-gray-400" />}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            size="md"
            radius="md"
        ></Input>
    );
};
