import React, { useState, useRef, useEffect } from 'react';
import TaskEmptyState from './TaskEmptyState';
import TaskCard from './TaskCard';
import TaskSkeleton from './TaskSkeleton';

const GAP = 12; // matches space-y-3

const getId = (task, index) => task?._id ?? task?.id ?? index;

const TaskList = ({ filteredTasks, filter, isLoading, onUpdate, onDelete, onReorder }) => {
    const itemRefs = useRef(new Map());
    const dragInfo = useRef(null);
    const tasksRef = useRef(filteredTasks);
    const reorderRef = useRef(onReorder);

    // { id, fromIndex, overIndex, dy, shift }
    const [drag, setDrag] = useState(null);

    tasksRef.current = filteredTasks;
    reorderRef.current = onReorder;

    const startDrag = (e, index, id) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;

        const rects = tasksRef.current.map((task, i) => {
            const node = itemRefs.current.get(getId(task, i));
            if (!node) return null;
            const rect = node.getBoundingClientRect();
            // page coordinates so the math survives scrolling mid-drag
            return { top: rect.top + window.scrollY, height: rect.height };
        });

        if (!rects[index]) return;

        e.preventDefault();

        dragInfo.current = {
            id,
            fromIndex: index,
            overIndex: index,
            startPageY: e.pageY,
            rects,
        };

        setDrag({
            id,
            fromIndex: index,
            overIndex: index,
            dy: 0,
            shift: rects[index].height + GAP,
        });

        document.body.style.userSelect = 'none';
        document.body.style.cursor = 'grabbing';
    };

    useEffect(() => {
        if (!drag) return;

        const handleMove = (e) => {
            const info = dragInfo.current;
            if (!info) return;
            e.preventDefault();

            const { rects, fromIndex } = info;
            const dy = e.pageY - info.startPageY;
            const center = rects[fromIndex].top + rects[fromIndex].height / 2 + dy;

            let overIndex = fromIndex;
            if (dy > 0) {
                for (let i = fromIndex + 1; i < rects.length; i++) {
                    if (rects[i] && center > rects[i].top + rects[i].height / 2) overIndex = i;
                    else break;
                }
            } else if (dy < 0) {
                for (let i = fromIndex - 1; i >= 0; i--) {
                    if (rects[i] && center < rects[i].top + rects[i].height / 2) overIndex = i;
                    else break;
                }
            }

            info.overIndex = overIndex;
            setDrag((prev) => (prev ? { ...prev, dy, overIndex } : prev));
        };

        const handleEnd = () => {
            const info = dragInfo.current;
            dragInfo.current = null;
            setDrag(null);
            document.body.style.userSelect = '';
            document.body.style.cursor = '';

            if (!info || info.overIndex === info.fromIndex) return;

            const tasks = tasksRef.current;
            const source = tasks[info.fromIndex];
            const target = tasks[info.overIndex];
            if (!source || !target) return;

            reorderRef.current?.(getId(source, info.fromIndex), getId(target, info.overIndex));
        };

        window.addEventListener('pointermove', handleMove, { passive: false });
        window.addEventListener('pointerup', handleEnd);
        window.addEventListener('pointercancel', handleEnd);

        return () => {
            window.removeEventListener('pointermove', handleMove);
            window.removeEventListener('pointerup', handleEnd);
            window.removeEventListener('pointercancel', handleEnd);
        };
        // Keyed on the dragged id only: the handlers read live values from
        // dragInfo.current, so re-binding on every pointermove would be wasted work.
    }, [drag?.id]);

    // Never leave the page stuck in "grabbing" if we unmount mid-drag
    useEffect(() => () => {
        document.body.style.userSelect = '';
        document.body.style.cursor = '';
    }, []);

    if (isLoading) {
        return <TaskSkeleton count={4} />;
    }

    if (!filteredTasks || filteredTasks.length === 0) {
        return <TaskEmptyState filter={filter} />
    }

    const getItemStyle = (index, isActive) => {
        if (!drag) return undefined;

        if (isActive) {
            return {
                transform: `translate3d(0, ${drag.dy}px, 0) scale(1.02)`,
                transition: 'none',
                zIndex: 50,
                willChange: 'transform',
            };
        }

        const { fromIndex, overIndex, shift } = drag;
        let offset = 0;
        if (index > fromIndex && index <= overIndex) offset = -shift;
        else if (index < fromIndex && index >= overIndex) offset = shift;

        return {
            transform: `translate3d(0, ${offset}px, 0)`,
            transition: 'transform 220ms cubic-bezier(0.2, 0, 0, 1)',
        };
    };

    return (
        <div className="space-y-3">
            {filteredTasks.map((task, index) => {
                const id = getId(task, index);
                const isActive = drag?.id === id;

                return (
                    <div
                        key={id}
                        ref={(node) => {
                            if (node) itemRefs.current.set(id, node);
                            else itemRefs.current.delete(id);
                        }}
                        className="relative"
                        style={getItemStyle(index, isActive)}
                    >
                        <TaskCard
                            task={task}
                            index={index}
                            onUpdate={onUpdate}
                            onDelete={onDelete}
                            isDragging={isActive}
                            isSorting={!!drag}
                            dragHandleProps={{
                                onPointerDown: (e) => startDrag(e, index, id),
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
};

export default TaskList;
