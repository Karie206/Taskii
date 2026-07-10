import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Clock, Search, Command } from 'lucide-react';

/* ===== Sub-components ===== */

/* --- Live Clock --- */
const LiveClock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(id);
    }, []);

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    return (
        <div className="flex items-center gap-1.5 text-xs font-mono text-muted-foreground bg-muted/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
            <Clock className="size-3.5" />
            <span>{hours}</span>
            <span className="clock-separator">:</span>
            <span>{minutes}</span>
            <span className="clock-separator">:</span>
            <span>{seconds}</span>
        </div>
    );
};

/* --- Progress Ring --- */
const ProgressRing = ({ completed = 0, total = 0 }) => {
    const size = 48;
    const strokeWidth = 4;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative pulse-ring" title={`${percent}% completed`}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--muted))"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    style={{
                        transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: 'drop-shadow(0 0 4px hsl(var(--primary) / 0.4))',
                    }}
                />
            </svg>
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-primary">
                    {percent}%
                </span>
            </div>
        </div>
    );
};

/* --- Theme Toggle --- */
const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-full transition-all duration-300
                hover:bg-muted dark:hover:bg-slate-800
                hover:shadow-md active:scale-90
                group cursor-pointer"
            aria-label="Toggle theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            <div key={isDark ? 'moon' : 'sun'} className="theme-icon-spin">
                {isDark ? (
                    <Sun className="size-5 text-amber-400 group-hover:text-amber-300" />
                ) : (
                    <Moon className="size-5 text-slate-500 group-hover:text-slate-700" />
                )}
            </div>
        </button>
    );
};

/* --- Greeting Message --- */
const getGreeting = () => {
    const h = new Date().getHours();
    if (h >= 5 && h < 12) return { emoji: '🌅', text: 'Good morning! Ready to tackle today\'s tasks?' };
    if (h >= 12 && h < 17) return { emoji: '☀️', text: 'Good afternoon! Keep up the momentum!' };
    if (h >= 17 && h < 24) return { emoji: '🌙', text: 'Good evening! Let\'s wrap up the day!' };
    return { emoji: '🌃', text: 'Working late? You\'re a productivity machine!' };
};

/* ===== Main Header ===== */

const Header = ({ completedTaskCount = 0, activeTaskCount = 0 }) => {
    const greeting = getGreeting();
    const totalTasks = completedTaskCount + activeTaskCount;

    return (
        <div className="space-y-4">
            {/* Top bar: clock + controls */}
            <div className="flex items-center justify-between">
                <LiveClock />
                <div className="flex items-center gap-2">
                    {/* Ctrl+K search hint */}
                    <button
                        onClick={() => {
                            window.dispatchEvent(
                                new KeyboardEvent('keydown', {
                                    key: 'k',
                                    ctrlKey: true,
                                    bubbles: true,
                                })
                            );
                        }}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground
                            bg-muted/50 dark:bg-slate-800/50 px-3 py-1.5 rounded-full
                            hover:bg-muted dark:hover:bg-slate-700 transition-colors
                            backdrop-blur-sm cursor-pointer"
                        title="Search (Ctrl+K)"
                    >
                        <Search className="size-3.5" />
                        <span className="hidden sm:inline">Search</span>
                        <kbd className="ml-1 px-1.5 py-0.5 rounded bg-background dark:bg-slate-700 text-[10px] font-mono border border-border/50">
                            ⌘K
                        </kbd>
                    </button>
                    <ThemeToggle />
                </div>
            </div>

            {/* Title + Progress Ring */}
            <div className="flex items-center justify-center gap-4">
                {totalTasks > 0 && (
                    <ProgressRing completed={completedTaskCount} total={totalTasks} />
                )}
                <div className="text-center space-y-1">
                    <h1 className="text-4xl font-bold text-transparent bg-primary bg-clip-text">
                        Taskii
                    </h1>
                    {/* Animated greeting */}
                    <div className="animate-slide-up">
                        <p className="text-sm text-muted-foreground">
                            <span className="mr-1">{greeting.emoji}</span>
                            <span className="typewriter-text">{greeting.text}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;