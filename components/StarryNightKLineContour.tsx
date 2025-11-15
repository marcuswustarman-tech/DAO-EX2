'use client';

import { useEffect, useRef } from 'react';
import {
  getStarryNightColorData,
  mapColorToTradingPalette,
  extractContours,
  generateKLine,
  drawKLine,
  updateKLine,
  KLineData,
} from '@/lib/kline-utils';

export default function StarryNightKLineContour() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const klineListRef = useRef<KLineData[]>([]);
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const updateCounterRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.7;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 获取星空数据和轮廓
    const starryData = getStarryNightColorData();
    const contours = extractContours(starryData);
    const gridWidth = starryData[0].length; // 200
    const gridHeight = starryData.length; // 140

    const klineWidth = Math.floor(canvas.width / gridWidth);
    const klineHeight = Math.floor(canvas.height / gridHeight);
    const klineBarWidth = Math.max(1, Math.floor(klineWidth * 0.5));

    // 初始化轮廓K线
    const initContourKLines = () => {
      const klines: KLineData[] = [];

      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          // 只在轮廓位置放置K线
          if (contours[y][x]) {
            const pixelData = starryData[y][x];
            const color = mapColorToTradingPalette(pixelData.color, pixelData.brightness);
            const baseHeight = pixelData.brightness * klineHeight * 0.8;

            const kline = generateKLine(
              x * klineWidth,
              (y + 1) * klineHeight,
              baseHeight,
              color
            );

            klines.push(kline);
          }
        }
      }

      klineListRef.current = klines;
    };

    initContourKLines();

    // 绘制背景渐变（深蓝色星空）
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0f2544');
      gradient.addColorStop(0.5, '#1e3a5f');
      gradient.addColorStop(1, '#2d4a6f');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // 涟漪效果
    const createRipple = (clickX: number, clickY: number) => {
      const maxRadius = 100;

      klineListRef.current.forEach((kline, index) => {
        const distance = Math.sqrt(
          Math.pow(kline.x - clickX, 2) + Math.pow(kline.y - clickY, 2)
        );

        if (distance < maxRadius) {
          const delay = distance * 2;
          setTimeout(() => {
            klineListRef.current[index] = updateKLine(kline, 8);
          }, delay);
        }
      });
    };

    // 点击事件
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      createRipple(clickX, clickY);
    };

    canvas.addEventListener('click', handleClick);

    // 动画循环
    const animate = (timestamp: number) => {
      // 绘制背景
      drawBackground();

      // 分批更新K线
      if (timestamp - lastUpdateRef.current > 1000) {
        lastUpdateRef.current = timestamp;
        updateCounterRef.current = 0;
      }

      const totalKLines = klineListRef.current.length;
      const batchSize = Math.ceil(totalKLines / 120); // 增加批次数
      const startIndex = updateCounterRef.current * batchSize;
      const endIndex = Math.min(startIndex + batchSize, totalKLines);

      for (let i = startIndex; i < endIndex; i++) {
        klineListRef.current[i] = updateKLine(klineListRef.current[i], 0.5);
      }

      if (endIndex < totalKLines) {
        updateCounterRef.current++;
      }

      // 绘制所有轮廓K线
      klineListRef.current.forEach((kline) => {
        drawKLine(ctx, kline, klineBarWidth);
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    // 清理
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('click', handleClick);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full cursor-pointer"
      style={{ background: '#0f2544' }}
    />
  );
}
