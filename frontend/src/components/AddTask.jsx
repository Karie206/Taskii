import React, { useState } from 'react';
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

const AddTask = ({ onTaskAdded }) => {
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
        <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
            <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                    type="text"
                    placeholder="Add a new task..."
                    className="h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                />

                <Button
                    variant="gradient"
                    size="xl"
                    className="px-6"
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