import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { SquarePen, CheckCircle2, Circle, Calendar, Trash2, Check, X } from "lucide-react";
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

const TaskCard = ({ task, index, onUpdate, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [loading, setLoading] = useState(false);
    const [showActions, setShowActions] = useState(false);

    const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

    const handleToggle = async () => {
        try {
            const newStatus = task.status === 'complete' ? 'active' : 'complete';
            await axios.put(`${API_URL}/api/tasks/${task._id}`, {
                status: newStatus,
                completedAt: newStatus === 'complete' ? new Date() : null
            });
            onUpdate();
        } catch {
            toast.error("Update failed!")
        }
    };

    const handleEdit = async () => {
        if (!editTitle.trim()) return toast.error("Title can't be empty!");
        try {
            setLoading(true);
            await axios.put(`${API_URL}/api/tasks/${task._id}`, { title: editTitle });
            toast.success("Update successfully!");
            setIsEditing(false);
            onUpdate();
        } catch {
            toast.error("Update failed!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${API_URL}/api/tasks/${task._id}`);
            toast.success("Delete successfully!");
            onDelete();
        } catch {
            toast.error("Delete failed!");
        }
    };

    return (
        <Card
            className={cn(
                "p-4 bg-gradient-card border-0 shadow-custom hover:shadow-custom-lg transition-all duration-200 animate-fade-in group/card",
                task.status === "complete" && "opacity-75"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
            onMouseEnter={() => !isTouchDevice() && setShowActions(true)}
            onMouseLeave={() => !isTouchDevice() && setShowActions(false)}
            onClick={() => isTouchDevice() && setShowActions(prev => !prev)}
        >
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon"
                    className={cn(
                        "flex-shrink-0 size-8 rounded-full transition-all duration-200",
                        task.status === "complete"
                            ? "text-success hover:text-success/80 hover:bg-success/20"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/20"
                    )}
                    onClick={(e) => { e.stopPropagation(); handleToggle(); }}
                >
                    {task.status === "complete" ? <CheckCircle2 className="size-5" /> : <Circle className="size-5" />}
                </Button>

                <div className="flex-1 min-w-0">
                    {isEditing ? (
                        <Input
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                            className="h-8 text-base"
                            autoFocus
                            onClick={(e) => e.stopPropagation()}
                        />
                    ) : (
                        <p className={cn(
                            "text-base transition-all duration-200",
                            task.status === "complete" ? "line-through text-muted-foreground" : "text-foreground"
                        )}>
                            {task.title}
                        </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                        <Calendar className="size-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                            {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                        {task.completedAt && (
                            <>
                                <span className="text-xs text-muted-foreground"> - </span>
                                <Calendar className="size-3 text-success" />
                                <span className="text-xs text-success">
                                    {new Date(task.completedAt).toLocaleDateString()}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className={cn(
                    "flex gap-2 transition-all duration-200",
                    showActions
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-2 pointer-events-none"
                )}>
                    {isEditing ? (
                        <>
                            <Button variant="ghost" size="icon"
                                className="size-8 text-success hover:text-success hover:bg-transparent"
                                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                                disabled={loading}
                            >
                                <Check className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon"
                                className="size-8 text-muted-foreground hover:text-destructive hover:bg-transparent"
                                onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditTitle(task.title); }}
                            >
                                <X className="size-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="icon"
                                className="size-8 text-muted-foreground hover:text-info hover:bg-transparent"
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                            >
                                <SquarePen className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon"
                                className="size-8 text-muted-foreground hover:text-destructive hover:bg-transparent"
                                onClick={(e) => { e.stopPropagation(); handleDelete(); }}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default TaskCard;