import React from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TaskListPagination = ({ currentPage, totalPages, onPageChange }) => {
    // if (totalPages <= 1) return null;

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="size-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <Button
                    key={page}
                    variant={page === currentPage ? "gradient" : "ghost"}
                    size="icon"
                    className="size-8 rounded-full"
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}

            <Button
                variant="ghost"
                size="icon"
                className="size-8"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="size-4" />
            </Button>
        </div>
    );
};

export default TaskListPagination;