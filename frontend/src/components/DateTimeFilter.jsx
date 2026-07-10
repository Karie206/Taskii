import React from 'react';
import { DateFilter } from '../lib/data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const DateTimeFilter = ({ dateFilter, onDateFilterChange }) => {
    return (
        <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="w-36 h-9 text-sm bg-white dark:bg-slate-800 dark:text-foreground dark:border-slate-700 border-border/50 transition-colors">
                <SelectValue placeholder="All time" />
            </SelectTrigger>
            <SelectContent>
                {Object.entries(DateFilter).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                        {value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default DateTimeFilter;