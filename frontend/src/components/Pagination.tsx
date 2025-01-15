import React, { Fragment, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    const pages = useMemo(() => {
        const items: (number | string)[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                items.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 5; i++) {
                    items.push(i);
                }
                items.push('...', totalPages);
            } else if (currentPage >= totalPages - 2) {
                items.push(1, '...');
                for (let i = totalPages - 4; i <= totalPages; i++) {
                    items.push(i);
                }
            } else {
                items.push(1, '...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    items.push(i);
                }
                items.push('...', totalPages);
            }
        }
        return items;
    }, [currentPage, totalPages]);

    return (
        <nav className="flex items-center justify-between px-4 sm:px-0">
            <div className="flex w-0 flex-1">
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-5 w-5 mr-2" />
                    Previous
                </button>
            </div>

            <div className="hidden md:flex">
                {pages.map((page, index) => (
                    <Fragment key={index}>
                        {typeof page === 'number' ? (
                            <button
                                onClick={() => onPageChange(page)}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium ${
                                    currentPage === page
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-50'
                                } ${index === 0 ? 'rounded-l-md' : ''} ${
                                    index === pages.length - 1
                                        ? 'rounded-r-md'
                                        : ''
                                }`}
                            >
                                {page}
                            </button>
                        ) : (
                            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700">
                                {page}
                            </span>
                        )}
                    </Fragment>
                ))}
            </div>

            <div className="flex w-0 flex-1 justify-end">
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="h-5 w-5 ml-2" />
                </button>
            </div>
        </nav>
    );
};

export default Pagination;
