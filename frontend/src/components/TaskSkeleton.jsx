import React from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const TaskSkeleton = ({ count = 4 }) => {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, index) => (
                <Card
                    key={index}
                    className="p-4 border rounded-xl border-border/60 bg-gradient-card shadow-custom animate-fade-in"
                    style={{ animationDelay: `${index * 60}ms` }}
                >
                    <div className="flex items-center gap-4">
                        {/* drag handle + toggle */}
                        <Skeleton className="size-4 rounded" />
                        <Skeleton className="rounded-full size-8" />

                        {/* title + meta */}
                        <div className="flex-1 min-w-0 space-y-2">
                            <Skeleton
                                className="h-4 rounded"
                                style={{ width: `${55 + ((index * 13) % 35)}%` }}
                            />
                            <div className="flex items-center gap-2">
                                <Skeleton className="rounded size-3" />
                                <Skeleton className="w-32 h-3 rounded" />
                            </div>
                        </div>

                        {/* actions */}
                        <div className="flex gap-2">
                            <Skeleton className="rounded-lg size-8" />
                            <Skeleton className="rounded-lg size-8" />
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
};

export default TaskSkeleton;
