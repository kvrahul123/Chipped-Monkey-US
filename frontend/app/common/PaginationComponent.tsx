import React from 'react';
import { Pagination } from 'react-bootstrap';

const PaginationComponent = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const handlePageChange = (pageNumber) => {
        if (pageNumber !== currentPage) {
            onPageChange(pageNumber);
        }
    };

    const renderPaginationItems = () => {
        const paginationItems = [];
        const maxVisiblePages = 5;
        let startPage, endPage;

        if (totalPages <= maxVisiblePages) {
            startPage = 1;
            endPage = totalPages;
        } else {
            const halfVisiblePages = Math.floor(maxVisiblePages / 2);
            if (currentPage <= halfVisiblePages) {
                startPage = 1;
                endPage = maxVisiblePages;
            } else if (currentPage + halfVisiblePages >= totalPages) {
                startPage = totalPages - maxVisiblePages + 1;
                endPage = totalPages;
            } else {
                startPage = currentPage - halfVisiblePages;
                endPage = currentPage + halfVisiblePages;
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            paginationItems.push(
                <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => handlePageChange(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }

        return paginationItems;
    };

    return (
        <Pagination className="justify-content-center mt-3">
            <Pagination.Prev
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                disabled={currentPage === 1}
            />
            {renderPaginationItems()}
            <Pagination.Next
                onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
                disabled={currentPage === totalPages}
            />
        </Pagination>
    );
};

export default PaginationComponent;
