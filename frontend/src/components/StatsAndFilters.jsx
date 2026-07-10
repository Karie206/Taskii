import React from 'react';
import { FilterType } from '../lib/data';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Filter } from 'lucide-react';

const StatsAndFilters = ({ completedTaskCount = 0, activeTaskCount = 0, filter = FilterType.all, onFilterChange }) => {
    return (<div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-3">
            <Badge variant="secondary" className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 backdrop-blur-sm transition-colors">
                {activeTaskCount} {FilterType.active}
            </Badge>

            <Badge variant="secondary" className="bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 backdrop-blur-sm transition-colors">
                {completedTaskCount} {FilterType.completed}
            </Badge>

            <Badge variant="secondary" className="bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 border-violet-200 dark:border-violet-800 backdrop-blur-sm transition-colors">
                {activeTaskCount + completedTaskCount} {FilterType.all}
            </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-2 sm:flex-row">
            {
                Object.keys(FilterType).map((type) => (
                    <Button
                        key={type}
                        variant={filter === FilterType[type] ? "gradient" : "ghost"}
                        size="sm"
                        className="capitalize cursor-pointer rounded-full hover:bg-primary/10 [&:not([data-variant='gradient'])]:hover:text-primary"
                        onClick={() => onFilterChange(FilterType[type])}
                    >
                        <Filter className="size-4" />
                        {FilterType[type]}
                    </Button>
                ))
            }

        </div>
    </div>
    );
};

export default StatsAndFilters;