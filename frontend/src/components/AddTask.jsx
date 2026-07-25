import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

const AddTask = ({ onTaskAdded, inputRef }) => {
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!title.trim()) return toast.error("Please enter a task name!");

        try {
            setLoading(true);

            await axios.post(`${API_URL}/api/tasks`, {
                title: title.trim()
            });

            setTitle('');
            toast.success("Task added!");
            onTaskAdded();
        } catch (err) {
            console.error(err);
            toast.error("Failed to add task!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="p-6 transition-colors border rounded-xl border-border/60 bg-gradient-card shadow-custom-lg dark:bg-slate-900/80 dark:border-slate-700/50">
            <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                    ref={inputRef}
                    type="text"
                    placeholder="Add a new task..."
                    className="h-12 text-base transition-colors border rounded-xl bg-slate-50 dark:bg-slate-800 dark:text-foreground dark:border-slate-700 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />

                <Button
                    variant="gradient"
                    size="xl"
                    className="px-6 rounded-xl"
                    onClick={handleAdd}
                    disabled={loading}
                >
                    {loading ? "Adding..." : "Add Task"}
                </Button>
            </div>
        </Card>
    );
};

export default AddTask;