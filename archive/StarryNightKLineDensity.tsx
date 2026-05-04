'use client';

import { useEffect, useRef } from 'react';
import {
  getStarryNightColorData,
  mapColorToTradingPalette,
  generateKLine,
  drawKLine,
  updateKLine,
  KLineData,
} from '@/lib/kline-utils';

export default function StarryNightKLineDensity() {
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

    // 获取星空数据
    const starryData = getStarryNightColorData();
    const gridWidth = starryData[0].length; // 200
    const gridHeight = starryData.length; // 140

    const cellWidth = canvas.width / gridWidth;
    const cellHeight = canvas.height / gridHeight;

    // 初始化密度映射K线
    const initDensityKLines = () => {
      const klines: KLineData[] = [];

      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          const pixelData = starryData[y][x];
          const brightness = pixelData.brightness;

          // 根据亮度决定K线数量（密度）
          // 亮的地方放更多K线，暗的地方放更少K线
          let klineCount = 0;
          if (brightness > 0.8) {
            klineCount = 5; // 非常亮
          } else if (brightness > 0.6) {
            klineCount = 3; // 比较亮
          } else if (brightness > 0.4) {
            klineCount = 2; // 中等
          } else if (brightness > 0.2) {
            klineCount = 1; // 暗
          }
          // brightness <= 0.2 的地方不放K线（非常暗）

          const color = mapColorToTradingPalette(pixelData.color, brightness);

          // 在这个单元格内随机放置K线
          for (let i = 0; i < klineCount; i++) {
            const offsetX = Math.random() * cellWidth;
            const offsetY = Math.random() * cellHeight;

            const klineX = x * cellWidth + offsetX;
            const klineY = (y + 1) * cellHeight + offsetY;

            // K线大小也根据亮度调整
            const klineSize = brightness * 0.8;
            const baseHeight = cellHeight * klineSize;

            const kline = generateKLine(klineX, klineY, baseHeight, color);
            klines.push(kline);
          }
        }
      }

      klineListRef.current = klines;
    };

    initDensityKLines();

    // 绘制背景渐变
    const drawBackground = () => {
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a1628');
      gradient.addColorStop(0.5, '#162d4a');
      gradient.addColorStop(1, '#1e3a5f');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    // 涟漪效果
    const createRipple = (clickX: number, clickY: number) => {
      const maxRadius = 150;

      klineListRef.current.forEach((kline, index) => {
        const distance = Math.sqrt(
          Math.pow(kline.x - clickX, 2) + Math.pow(kline.y - clickY, 2)
        );

        if (distance < maxRadius) {
          const delay = distance * 1.5;
          const intensity = (maxRadius - distance) / maxRadius * 10;

          setTimeout(() => {
            klineListRef.current[index] = updateKLine(kline, intensity);
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

      // 绘制所有K线
      klineListRef.current.forEach((kline) => {
        // K线宽度根据位置略有不同
        const klineWidth = Math.max(1, Math.min(6, Math.random() * 4 + 2));
        drawKLine(ctx, kline, klineWidth);
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
      style={{ background: '#0a1628' }}
    />
  );
}
