import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { cn } from "../lib/utils";
import { SquarePen, CheckCircle2, Circle, Calendar, Trash2, Check, X, Clock, GripVertical } from "lucide-react";
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL;

const TaskCard = ({ task, index, onUpdate, onDelete, dragHandleProps, isDragging, isSorting }) => {
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
                "p-4 rounded-xl border border-border/60 bg-gradient-card shadow-custom hover:shadow-custom-lg transition-[box-shadow,border-color,opacity] duration-200 animate-fade-in group/card",
                task.status === "complete" && "opacity-75",
                isSorting && !isDragging && "pointer-events-none",
                isDragging && "opacity-100 shadow-custom-lg border-primary/50 ring-2 ring-primary/20 cursor-grabbing"
            )}
            style={isDragging ? undefined : { animationDelay: `${index * 50}ms` }}
            onMouseEnter={() => !isTouchDevice() && setShowActions(true)}
            onMouseLeave={() => !isTouchDevice() && setShowActions(false)}
            onClick={() => isTouchDevice() && setShowActions(prev => !prev)}
        >
            <div className="flex items-center gap-3">
                <span
                    role="button"
                    tabIndex={-1}
                    aria-label="Drag to reorder"
                    title="Drag to reorder"
                    className={cn(
                        "flex-shrink-0 p-1 -ml-1 rounded-md touch-none select-none transition-colors duration-200 hover:bg-muted hover:text-foreground",
                        isDragging
                            ? "cursor-grabbing text-foreground"
                            : "cursor-grab text-muted-foreground/40 group-hover/card:text-muted-foreground"
                    )}
                    onClick={(e) => e.stopPropagation()}
                    {...dragHandleProps}
                >
                    <GripVertical className="size-4" />
                </span>

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
                            className="h-8 text-base rounded-lg"
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
                            {new Date(task.createdAt).toLocaleString('vi-VN', {
                                day: '2-digit',
                                month: '2-digit',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                        {task.completedAt && (
                            <>
                                <span className="text-xs text-muted-foreground"> - </span>
                                <Clock className="size-3 text-success" />
                                <span className="text-xs text-success">
                                    {new Date(task.completedAt).toLocaleString('vi-VN', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className={cn(
                    "flex gap-2 transition-all duration-200",
                    showActions && !isDragging
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 translate-y-2 pointer-events-none"
                )}>
                    {isEditing ? (
                        <>
                            <Button variant="ghost" size="icon"
                                className="size-8 rounded-lg text-success hover:text-success hover:bg-transparent"
                                onClick={(e) => { e.stopPropagation(); handleEdit(); }}
                                disabled={loading}
                            >
                                <Check className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon"
                                className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-transparent"
                                onClick={(e) => { e.stopPropagation(); setIsEditing(false); setEditTitle(task.title); }}
                            >
                                <X className="size-4" />
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="icon"
                                className="size-8 rounded-lg text-muted-foreground hover:text-info hover:bg-transparent"
                                onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
                            >
                                <SquarePen className="size-4" />
                            </Button>
                            <Button variant="ghost" size="icon"
                                className="size-8 rounded-lg text-muted-foreground hover:text-destructive hover:bg-transparent"
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