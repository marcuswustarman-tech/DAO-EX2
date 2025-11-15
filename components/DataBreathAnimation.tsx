'use client';

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  phase: number;
}

export default function DataBreathAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const mouseRef = useRef({ x: 0, y: 0 });
  const curveProgressRef = useRef(0);
  const curveVisibleRef = useRef(false);
  const nextCurveTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 初始化粒子（数百个）
    const initParticles = () => {
      const particles: Particle[] = [];
      const particleCount = Math.min(300, Math.floor((canvas.width * canvas.height) / 5000));

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.3 + 0.1,
          phase: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = particles;
      nextCurveTimeRef.current = Date.now() + Math.random() * 15000 + 10000; // 10-25秒随机间隔
    };
    initParticles();

    // 鼠标移动交互
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // 动画循环
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const currentTime = Date.now();

      // 更新和绘制粒子
      particles.forEach((particle, index) => {
        // 轻微的交互效果
        const dx = mouseRef.current.x - particle.x;
        const dy = mouseRef.current.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 100) {
          const force = (100 - distance) / 100;
          particle.vx -= (dx / distance) * force * 0.05;
          particle.vy -= (dy / distance) * force * 0.05;
        }

        // 更新位置
        particle.x += particle.vx;
        particle.y += particle.vy;

        // 边界检测
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        // 限制在画布内
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));

        // 缓慢回归自然速度
        particle.vx *= 0.99;
        particle.vy *= 0.99;
        if (Math.abs(particle.vx) < 0.1) particle.vx += (Math.random() - 0.5) * 0.02;
        if (Math.abs(particle.vy) < 0.1) particle.vy += (Math.random() - 0.5) * 0.02;

        // 微弱的呼吸效果
        particle.phase += 0.01;
        const breathOpacity = particle.opacity + Math.sin(particle.phase) * 0.05;

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${breathOpacity})`;
        ctx.fill();

        // 偶尔的同步闪烁
        if (Math.random() < 0.001) {
          const nearbyParticles = particles.filter((p, i) => {
            if (i === index) return false;
            const dist = Math.sqrt((p.x - particle.x) ** 2 + (p.y - particle.y) ** 2);
            return dist < 150;
          });
          nearbyParticles.forEach(p => {
            p.phase = particle.phase;
          });
        }
      });

      // 绘制金色曲线
      if (currentTime >= nextCurveTimeRef.current && !curveVisibleRef.current) {
        curveVisibleRef.current = true;
        curveProgressRef.current = 0;
      }

      if (curveVisibleRef.current) {
        curveProgressRef.current += 0.008;

        if (curveProgressRef.current <= 1) {
          // 绘制优美的金色曲线（类似盈利曲线）
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 175, 55, ${Math.sin(curveProgressRef.current * Math.PI)})`;
          ctx.lineWidth = 2;

          const startX = canvas.width * 0.3;
          const startY = canvas.height * 0.6;
          const endX = canvas.width * 0.7;
          const endY = canvas.height * 0.4;

          for (let i = 0; i <= curveProgressRef.current; i += 0.01) {
            const x = startX + (endX - startX) * i;
            const baseY = startY + (endY - startY) * i;
            // 添加一些波动，但整体向上
            const wave = Math.sin(i * Math.PI * 3) * 20 * (1 - i);
            const y = baseY + wave;

            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.stroke();
        } else {
          // 曲线消失
          curveVisibleRef.current = false;
          nextCurveTimeRef.current = currentTime + Math.random() * 15000 + 10000;
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#000' }}
    />
  );
}
