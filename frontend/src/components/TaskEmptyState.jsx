import React from 'react';
import { Card } from './ui/card';
import { Circle } from 'lucide-react';


const TaskEmptyState = ({ filter }) => {
    return (
        <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md">
            <div className="space-y-3">
                <Circle className="mx-auto size-12 text-muted-foreground" />
                <div className="space-y-1">
                    <h3 className="font-medium text-foreground">
                        {filter === "Active"
                            ? "No Active tasks."
                            : filter === "Completed"
                                ? "No Completed tasks yet."
                                : "No tasks yet."}
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        {filter === "All"
                            ? "Add your first task to get started!"
                            : `Switch to "All" to see tasks that are ${filter === "Active" ? "Completed." : "in progress."
                            }`}
                    </p>
                </div>
            </div>

        </Card>
    );
};

export default TaskEmptyState;