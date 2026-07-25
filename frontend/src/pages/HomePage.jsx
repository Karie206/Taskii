import Header from '../components/Header';
import AddTask from '../components/AddTask';
import DateTimeFilter from '../components/DateTimeFilter';
import StatsAndFilters from '../components/StatsAndFilters';
import TaskList from '../components/TaskList';
import TaskListPagination from '../components/TaskListPagination';
import Footer from '../components/Footer';
import CommandPalette from '../components/CommandPalette';
import ConfettiCelebration from '../components/ConfettiCelebration';
import ScrollToTop from '../components/ScrollToTop';
import ParticleBackground from '../components/ParticleBackground';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { FilterType, DateFilter } from '../lib/data';
import { toast } from 'sonner';
import axios from 'axios';

const HomePage = () => {
    const { isDark } = useTheme();
    const [filter, setFilter] = useState(FilterType.all);
    const [dateFilter, setDateFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;
    const [taskBuffer, setTaskBuffer] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const addTaskInputRef = useRef(null);

    // Grid background — theme-aware
    const gridBackground = {
        backgroundImage: isDark
            ? `linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)`
            : `linear-gradient(to right, #e2e8f0 1px, transparent 1px),
               linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
        backgroundSize: '20px 30px',
        WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
        maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
        transition: 'background-image 0.3s ease',
    };

    const filteredByDate = taskBuffer.filter(t => {
        const created = new Date(t.createdAt);
        const now = new Date();
        if (dateFilter === 'today') return created.toDateString() === now.toDateString();
        if (dateFilter === 'week') {
            const weekAgo = new Date(now);
            weekAgo.setDate(now.getDate() - 7);
            return created >= weekAgo;
        }
        if (dateFilter === 'month') return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        return true;
    });
    const activeTaskCount = filteredByDate.filter(t => t.status === 'active').length;
    const completedTaskCount = filteredByDate.filter(t => t.status === 'complete').length;
    const filteredTasks = filter === FilterType.all
        ? filteredByDate
        : filteredByDate.filter(t => {
            if (filter === FilterType.completed) return t.status === 'complete';
            if (filter === FilterType.active) return t.status === 'active';
            return true;
        });

    const totalPages = Math.ceil(filteredTasks.length / ITEMS_PER_PAGE);
    const paginatedTasks = filteredTasks.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Confetti trigger: all tasks completed and there is at least one
    const allCompleted = taskBuffer.length > 0 && taskBuffer.every(t => t.status === 'complete');

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tasks`)
            setTaskBuffer(res.data.data)
            console.log(res.data.data)
        }
        catch (err) {
            console.log(err)
            toast.error("Failed to fetch tasks")
        }
        finally {
            // Skeleton only shows on the first load, not on every refetch
            setIsLoading(false)
        }
    }

    const handleReorder = async (sourceId, targetId) => {
        const previous = taskBuffer;
        const from = previous.findIndex(t => t._id === sourceId);
        const to = previous.findIndex(t => t._id === targetId);
        if (from === -1 || to === -1 || from === to) return;

        const reordered = [...previous];
        const [moved] = reordered.splice(from, 1);
        reordered.splice(to, 0, moved);

        // Optimistic update, rolled back if the request fails
        setTaskBuffer(reordered);

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/tasks/reorder`, {
                ids: reordered.map(t => t._id)
            });
        } catch (err) {
            console.log(err);
            setTaskBuffer(previous);
            toast.error(err?.response?.data?.message ?? "Failed to reorder tasks");
        }
    };

    const handleAddTaskFocus = () => {
        addTaskInputRef.current?.focus();
    };

    return (
        <div className={`min-h-screen w-full relative transition-colors duration-300 ${isDark ? 'bg-[hsl(222.2,84%,4.9%)]' : 'bg-white'}`}>
            <div className="absolute inset-0 z-0" style={gridBackground} />
            <ParticleBackground />

            <div className="relative z-10 container pt-8 mx-auto">
                <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
                    <Header
                        completedTaskCount={completedTaskCount}
                        activeTaskCount={activeTaskCount}
                    />
                    <AddTask onTaskAdded={fetchTasks} inputRef={addTaskInputRef} />
                    <StatsAndFilters
                        filter={filter}
                        onFilterChange={setFilter}
                        activeTaskCount={activeTaskCount}
                        completedTaskCount={completedTaskCount}
                    />
                    <TaskList
                        filteredTasks={paginatedTasks}
                        filter={filter}
                        isLoading={isLoading}
                        onUpdate={fetchTasks}
                        onDelete={fetchTasks}
                        onReorder={handleReorder}
                    />
                    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                        <TaskListPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        <DateTimeFilter dateFilter={dateFilter} onDateFilterChange={setDateFilter} />
                    </div>

                    <Footer activeTaskCount={activeTaskCount} completedTaskCount={completedTaskCount} />
                </div>
            </div>

            {/* New feature components */}
            <CommandPalette
                tasks={taskBuffer}
                onFilterChange={setFilter}
                onAddTaskFocus={handleAddTaskFocus}
            />
            <ConfettiCelebration trigger={allCompleted} />
            <ScrollToTop />
        </div>
    );
};

export default HomePage;