import { useState, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import {
    Search, Plus, Sun, Moon, Filter, ListTodo, CheckCircle2,
    Zap, X, Command
} from 'lucide-react';

const CommandPalette = ({ tasks = [], onFilterChange, onAddTaskFocus }) => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { isDark, toggleTheme } = useTheme();

    // Ctrl+K shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setOpen(prev => !prev);
                setQuery('');
                setSelectedIndex(0);
            }
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const actions = [
        {
            id: 'add-task',
            label: 'Add new task',
            icon: <Plus className="size-4" />,
            category: 'Actions',
            action: () => { setOpen(false); onAddTaskFocus?.(); }
        },
        {
            id: 'toggle-theme',
            label: isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode',
            icon: isDark ? <Sun className="size-4" /> : <Moon className="size-4" />,
            category: 'Actions',
            action: () => { toggleTheme(); setOpen(false); }
        },
        {
            id: 'filter-all',
            label: 'Show all tasks',
            icon: <ListTodo className="size-4" />,
            category: 'Filters',
            action: () => { onFilterChange?.('All'); setOpen(false); }
        },
        {
            id: 'filter-active',
            label: 'Show active tasks',
            icon: <Filter className="size-4" />,
            category: 'Filters',
            action: () => { onFilterChange?.('Active'); setOpen(false); }
        },
        {
            id: 'filter-completed',
            label: 'Show completed tasks',
            icon: <CheckCircle2 className="size-4" />,
            category: 'Filters',
            action: () => { onFilterChange?.('Completed'); setOpen(false); }
        },
    ];

    // Search tasks + filter actions
    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);

    const filteredActions = actions.filter(a =>
        a.label.toLowerCase().includes(query.toLowerCase())
    );

    const allItems = [
        ...(query ? filteredTasks.map(t => ({
            id: `task-${t._id}`,
            label: t.title,
            icon: t.status === 'complete'
                ? <CheckCircle2 className="size-4 text-emerald-500" />
                : <ListTodo className="size-4 text-blue-500" />,
            category: 'Tasks',
            action: () => setOpen(false),
            subtitle: t.status === 'complete' ? 'Completed' : 'Active'
        })) : []),
        ...filteredActions
    ];

    // Keyboard navigation
    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => Math.min(prev + 1, allItems.length - 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => Math.max(prev - 1, 0));
        } else if (e.key === 'Enter' && allItems[selectedIndex]) {
            e.preventDefault();
            allItems[selectedIndex].action();
        }
    }, [allItems, selectedIndex]);

    if (!open) return null;

    // Group items by category
    const grouped = allItems.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    let flatIndex = -1;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={() => setOpen(false)}
            />

            {/* Palette */}
            <div className="relative w-full max-w-lg mx-4 overflow-hidden border shadow-2xl rounded-2xl bg-white dark:bg-slate-900 border-border/50 dark:border-slate-700 animate-in slide-in-from-top-4 fade-in duration-300">
                {/* Search input */}
                <div className="flex items-center gap-3 px-4 border-b border-border/50 dark:border-slate-700">
                    <Search className="size-5 text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        placeholder="Search tasks, actions..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 py-4 text-base bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                        autoFocus
                    />
                    <button
                        onClick={() => setOpen(false)}
                        className="p-1 transition-colors rounded-lg hover:bg-muted"
                    >
                        <X className="size-4 text-muted-foreground" />
                    </button>
                </div>

                {/* Results */}
                <div className="max-h-72 overflow-y-auto p-2">
                    {allItems.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                            <Zap className="mx-auto mb-2 size-8 opacity-50" />
                            <p className="text-sm">No results found</p>
                        </div>
                    ) : (
                        Object.entries(grouped).map(([category, items]) => (
                            <div key={category}>
                                <p className="px-3 py-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                                    {category}
                                </p>
                                {items.map((item) => {
                                    flatIndex++;
                                    const idx = flatIndex;
                                    return (
                                        <button
                                            key={item.id}
                                            onClick={item.action}
                                            onMouseEnter={() => setSelectedIndex(idx)}
                                            className={`flex items-center gap-3 w-full px-3 py-2.5 text-left rounded-xl transition-all duration-150 ${idx === selectedIndex
                                                ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                                : 'text-foreground hover:bg-muted'
                                                }`}
                                        >
                                            <span className={`p-1.5 rounded-lg ${idx === selectedIndex
                                                ? 'bg-primary/20 dark:bg-primary/30'
                                                : 'bg-muted dark:bg-slate-800'
                                                }`}>
                                                {item.icon}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.label}</p>
                                                {item.subtitle && (
                                                    <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                                                )}
                                            </div>
                                            {idx === selectedIndex && (
                                                <span className="text-xs text-muted-foreground">↵</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))
                    )}
                </div>

                {/* Footer hint */}
                <div className="flex items-center justify-between px-4 py-2.5 text-xs border-t border-border/50 dark:border-slate-700 text-muted-foreground bg-muted/30 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-muted dark:bg-slate-700 font-mono text-[10px]">↑↓</kbd>
                            Navigate
                        </span>
                        <span className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-muted dark:bg-slate-700 font-mono text-[10px]">↵</kbd>
                            Select
                        </span>
                    </div>
                    <span className="flex items-center gap-1">
                        <kbd className="px-1.5 py-0.5 rounded bg-muted dark:bg-slate-700 font-mono text-[10px]">Esc</kbd>
                        Close
                    </span>
                </div>
            </div>
        </div>
    );
};

export default CommandPalette;
