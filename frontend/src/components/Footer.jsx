import React from 'react';

const Footer = ({ completedTaskCount = 0, activeTaskCount = 0 }) => {
    return <>
        {completedTaskCount + activeTaskCount > 0 && (
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    {completedTaskCount > 0 && activeTaskCount === 0
                        ? `🏆 Amazing! You've completed all ${completedTaskCount} tasks. Take a break, you earned it!`
                        : completedTaskCount > 0
                            ? `🎉 Great job! You've completed ${completedTaskCount} out of ${completedTaskCount + activeTaskCount} tasks. Keep it up!`
                            : `You have ${activeTaskCount} task${activeTaskCount > 1 ? "s" : ""} remaining. You got this!`
                    }
                </p>
            </div>
        )}
    </>
};

export default Footer;