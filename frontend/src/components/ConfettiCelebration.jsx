import { useEffect, useRef, useState } from 'react';

const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#a855f7', '#ec4899', '#06b6d4'];
const PARTICLE_COUNT = 120;
const DURATION = 3500;

const ConfettiCelebration = ({ trigger }) => {
    const canvasRef = useRef(null);
    const [active, setActive] = useState(false);
    const prevTrigger = useRef(false);

    useEffect(() => {
        // Only fire when trigger transitions from false to true
        if (trigger && !prevTrigger.current) {
            setActive(true);
        }
        prevTrigger.current = trigger;
    }, [trigger]);

    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 20,
            vy: Math.random() * -18 - 5,
            color: COLORS[Math.floor(Math.random() * COLORS.length)],
            size: Math.random() * 8 + 4,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 15,
            shape: Math.random() > 0.5 ? 'rect' : 'circle',
            opacity: 1,
        }));

        let startTime = Date.now();
        let animId;

        const draw = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / DURATION;

            if (progress >= 1) {
                setActive(false);
                cancelAnimationFrame(animId);
                return;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.vy += 0.4; // gravity
                p.y += p.vy;
                p.vx *= 0.99; // air resistance
                p.rotation += p.rotationSpeed;
                p.opacity = Math.max(0, 1 - progress * 1.2);

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rotation * Math.PI) / 180);
                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;

                if (p.shape === 'rect') {
                    ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
                } else {
                    ctx.beginPath();
                    ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            });

            animId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            if (animId) cancelAnimationFrame(animId);
        };
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[100] pointer-events-none"
            style={{ width: '100vw', height: '100vh' }}
        />
    );
};

export default ConfettiCelebration;
