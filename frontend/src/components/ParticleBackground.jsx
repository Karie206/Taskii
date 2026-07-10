import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';

const ParticleBackground = () => {
    const canvasRef = useRef(null);
    const { isDark } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const COUNT = 80;
        const DIST = 130;
        const particles = Array.from({ length: COUNT }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            r: Math.random() * 2 + 1,
        }));

        // Theme-aware colors
        const dotColor = isDark
            ? 'rgba(74, 222, 128, 0.7)'   // bright neon green in dark mode
            : 'rgba(100, 200, 150, 0.6)';  // soft green in light mode

        const getLineColor = (opacity) => isDark
            ? `rgba(74, 222, 128, ${opacity * 0.4})`
            : `rgba(100, 200, 150, ${opacity * 0.3})`;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw dot
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = dotColor;
                ctx.fill();

                // Add glow in dark mode
                if (isDark) {
                    ctx.shadowBlur = 8;
                    ctx.shadowColor = 'rgba(74, 222, 128, 0.5)';
                } else {
                    ctx.shadowBlur = 0;
                }

                // Draw lines between nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const q = particles[j];
                    const dx = p.x - q.x;
                    const dy = p.y - q.y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < DIST) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(q.x, q.y);
                        ctx.strokeStyle = getLineColor(1 - d / DIST);
                        ctx.lineWidth = 0.8;
                        ctx.shadowBlur = 0;
                        ctx.stroke();
                    }
                }
            }
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
        };
    }, [isDark]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-0 pointer-events-none"
        />
    );
};

export default ParticleBackground;