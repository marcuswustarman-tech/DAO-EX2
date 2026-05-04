'use client';

import { useEffect, useRef, useState } from 'react';
import {
  getStarryNightColorData,
  mapColorToTradingPalette,
  generateKLine,
  drawKLine,
  updateKLine,
  KLineData,
} from '@/lib/kline-utils';

export default function StarryNightKLinePixelated() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const klineGridRef = useRef<KLineData[][]>([]);
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
      canvas.height = window.innerHeight * 0.7; // 70%屏幕高度
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 获取星空数据
    const starryData = getStarryNightColorData();
    const gridWidth = starryData[0].length; // 100
    const gridHeight = starryData.length; // 70

    // 计算K线尺寸
    const klineWidth = Math.floor(canvas.width / gridWidth);
    const klineHeight = Math.floor(canvas.height / gridHeight);
    const klineBarWidth = Math.max(2, Math.floor(klineWidth * 0.6));

    // 初始化K线网格
    const initKLineGrid = () => {
      const grid: KLineData[][] = [];

      for (let y = 0; y < gridHeight; y++) {
        const row: KLineData[] = [];
        for (let x = 0; x < gridWidth; x++) {
          const pixelData = starryData[y][x];
          const color = mapColorToTradingPalette(pixelData.color, pixelData.brightness);

          // K线高度根据亮度决定
          const baseHeight = pixelData.brightness * klineHeight * 0.8;

          const kline = generateKLine(
            x * klineWidth,
            (y + 1) * klineHeight,
            baseHeight,
            color
          );

          row.push(kline);
        }
        grid.push(row);
      }

      klineGridRef.current = grid;
    };

    initKLineGrid();

    // 涟漪效果
    const createRipple = (clickX: number, clickY: number) => {
      const gridX = Math.floor(clickX / klineWidth);
      const gridY = Math.floor(clickY / klineHeight);

      const maxRadius = 15;

      for (let radius = 0; radius < maxRadius; radius++) {
        setTimeout(() => {
          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const distance = Math.sqrt(dx * dx + dy * dy);
              if (Math.abs(distance - radius) < 1) {
                const targetY = gridY + dy;
                const targetX = gridX + dx;

                if (
                  targetY >= 0 &&
                  targetY < gridHeight &&
                  targetX >= 0 &&
                  targetX < gridWidth
                ) {
                  const kline = klineGridRef.current[targetY][targetX];
                  klineGridRef.current[targetY][targetX] = updateKLine(kline, 5);
                }
              }
            }
          }
        }, radius * 50);
      }
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
      // 清空画布
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 分批更新K线（每秒更新所有K线，但分批进行）
      if (timestamp - lastUpdateRef.current > 1000) {
        lastUpdateRef.current = timestamp;
        updateCounterRef.current = 0;
      }

      const totalKLines = gridWidth * gridHeight;
      const batchSize = Math.ceil(totalKLines / 60); // 分60批，每帧更新一批
      const startIndex = updateCounterRef.current * batchSize;
      const endIndex = Math.min(startIndex + batchSize, totalKLines);

      let currentIndex = 0;
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          if (currentIndex >= startIndex && currentIndex < endIndex) {
            klineGridRef.current[y][x] = updateKLine(klineGridRef.current[y][x], 0.5);
          }
          currentIndex++;
        }
      }

      if (endIndex < totalKLines) {
        updateCounterRef.current++;
      }

      // 绘制所有K线
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const kline = klineGridRef.current[y][x];
          drawKLine(ctx, kline, klineBarWidth);
        }
      }

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
      style={{ background: '#0a0a0a' }}
    />
  );
}
