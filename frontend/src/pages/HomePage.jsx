import Header from '../components/Header';
import AddTask from '../components/AddTask';
import DateTimeFilter from '../components/DateTimeFilter';
import StatsAndFilters from '../components/StatsAndFilters';
import TaskList from '../components/TaskList';
import TaskListPagination from '../components/TaskListPagination';
import Footer from '../components/Footer';
import { useState } from 'react';
import { FilterType, DateFilter } from '../lib/data';
import { useEffect } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import ParticleBackground from '../components/ParticleBackground';

const gridBackground = {
    backgroundImage: `
    linear-gradient(to right, #e2e8f0 1px, transparent 1px),
    linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
  `,
    backgroundSize: '20px 30px',
    WebkitMaskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
    maskImage: 'radial-gradient(ellipse 80% 50% at 50% 0%, #000 70%, transparent 100%)',
};

const HomePage = () => {
    const [filter, setFilter] = useState(FilterType.all);
    const [dateFilter, setDateFilter] = useState('all'); // dùng key
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 4;
    const [taskBuffer, setTaskBuffer] = useState([]);

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
    }


    return (
        <div className="min-h-screen w-full bg-white relative">
            <div className="absolute inset-0 z-0" style={gridBackground} />
            <ParticleBackground />

            <div className="relative z-10 container pt-8 mx-auto">
                <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
                    <Header />
                    <AddTask onTaskAdded={fetchTasks} />
                    <StatsAndFilters
                        filter={filter}
                        onFilterChange={setFilter}
                        activeTaskCount={activeTaskCount}
                        completedTaskCount={completedTaskCount}
                    />
                    <TaskList filteredTasks={paginatedTasks} filter={filter} onUpdate={fetchTasks} onDelete={fetchTasks} />
                    <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                        <TaskListPagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                        <DateTimeFilter dateFilter={dateFilter} onDateFilterChange={setDateFilter} />
                    </div>

                    <Footer activeTaskCount={activeTaskCount} completedTaskCount={completedTaskCount} />
                </div>
            </div>
        </div>
    );
};

export default HomePage;