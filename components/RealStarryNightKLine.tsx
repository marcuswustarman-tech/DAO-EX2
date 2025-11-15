'use client';

import { useEffect, useRef, useState } from 'react';
import {
  getStarryNightColorData,
  generateKLine,
  drawKLine,
  updateKLine,
  KLineData,
} from '@/lib/kline-utils';

// 真实的梵高《星空》图片URL
// 优先使用本地图片，如果不存在则使用在线版本（可能会有跨域问题）
const LOCAL_STARRY_NIGHT_URL = '/starry-night.jpg';
const ONLINE_STARRY_NIGHT_URL = 'https://uploads2.wikiart.org/images/vincent-van-gogh/the-starry-night-1889(1).jpg';

interface PixelData {
  r: number;
  g: number;
  b: number;
  brightness: number;
}

export default function RealStarryNightKLine() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const klineGridRef = useRef<KLineData[][]>([]);
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(0);
  const updateCounterRef = useRef<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isInitialized = false;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight * 0.7;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 加载真实的梵高星空图片
    const loadStarryNightImage = async () => {
      try {
        setLoading(true);

        // 创建临时canvas用于图片处理
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) throw new Error('无法创建临时canvas');

        // 加载图片 - 先尝试本地，再尝试在线
        const img = new Image();
        img.crossOrigin = 'anonymous';

        let imageLoaded = false;

        // 尝试加载本地图片
        try {
          await new Promise((resolve, reject) => {
            img.onload = () => {
              imageLoaded = true;
              resolve(null);
            };
            img.onerror = () => reject(new Error('本地图片不存在'));
            img.src = LOCAL_STARRY_NIGHT_URL;
          });
        } catch (localError) {
          console.log('本地图片加载失败，尝试在线图片...');

          // 尝试加载在线图片
          try {
            await new Promise((resolve, reject) => {
              img.onload = () => {
                imageLoaded = true;
                resolve(null);
              };
              img.onerror = () => reject(new Error('在线图片加载失败'));
              img.src = ONLINE_STARRY_NIGHT_URL;
            });
          } catch (onlineError) {
            throw new Error('所有图片源都无法加载');
          }
        }

        if (!imageLoaded) {
          throw new Error('图片加载失败');
        }

        // 设置目标分辨率（200x140，高清版本）
        const gridWidth = 200;
        const gridHeight = 140;

        tempCanvas.width = gridWidth;
        tempCanvas.height = gridHeight;

        // 绘制并缩放图片到目标分辨率
        tempCtx.drawImage(img, 0, 0, gridWidth, gridHeight);

        // 提取像素数据
        const imageData = tempCtx.getImageData(0, 0, gridWidth, gridHeight);
        const pixels = imageData.data;

        // 转换为我们需要的格式
        const pixelGrid: PixelData[][] = [];
        for (let y = 0; y < gridHeight; y++) {
          const row: PixelData[] = [];
          for (let x = 0; x < gridWidth; x++) {
            const index = (y * gridWidth + x) * 4;
            const r = pixels[index];
            const g = pixels[index + 1];
            const b = pixels[index + 2];

            // 计算亮度（使用标准公式）
            const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

            row.push({ r, g, b, brightness });
          }
          pixelGrid.push(row);
        }

        // 初始化K线网格
        initKLineGrid(pixelGrid);
        setLoading(false);
        isInitialized = true;

        // 启动动画
        animate(0);

      } catch (err) {
        console.error('加载星空图片失败:', err);
        setError('使用程序化生成的星空数据');

        // 使用备用的程序化数据
        const programmaticData = getStarryNightColorData();
        const pixelGrid: PixelData[][] = [];

        for (let y = 0; y < programmaticData.length; y++) {
          const row: PixelData[] = [];
          for (let x = 0; x < programmaticData[y].length; x++) {
            const { color, brightness } = programmaticData[y][x];
            // 简单的RGB解析
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);

            row.push({ r, g, b, brightness });
          }
          pixelGrid.push(row);
        }

        // 初始化K线网格
        initKLineGrid(pixelGrid);
        setLoading(false);
        isInitialized = true;

        // 启动动画
        animate(0);

        // 3秒后清除错误提示
        setTimeout(() => setError(null), 3000);
      }
    };

    // 将RGB映射到交易平台配色
    const mapPixelToTradingColor = (pixel: PixelData): string => {
      const { r, g, b, brightness } = pixel;

      // 判断主色调
      const isYellow = (r + g) > b * 1.5 && g > r * 0.7; // 黄色系（星星、月亮）
      const isBlue = b > Math.max(r, g) * 1.1; // 蓝色系（天空）
      const isDark = brightness < 0.3; // 深色（丝柏树、山脉）

      if (isYellow && brightness > 0.5) {
        // 亮黄色 -> 金黄色
        return brightness > 0.7 ? '#f4d03f' : '#e6b800';
      } else if (isDark) {
        // 深色 -> 深灰/黑
        return brightness < 0.15 ? '#0a0a0a' : '#1a1a1a';
      } else if (isBlue) {
        // 蓝色系 -> 保留蓝色调但调整饱和度
        if (brightness > 0.6) {
          return '#5d9cec'; // 浅蓝（亮部）
        } else if (brightness > 0.4) {
          return '#4a6fa5'; // 中蓝
        } else {
          return '#2d4a6f'; // 深蓝
        }
      } else if (brightness > 0.6) {
        // 其他亮色 -> 朱红
        return '#C83C23';
      } else {
        // 中间色调 -> 灰色
        return brightness > 0.5 ? '#737373' : '#404040';
      }
    };

    // 初始化K线网格
    const initKLineGrid = (pixelGrid: PixelData[][]) => {
      const gridHeight = pixelGrid.length;
      const gridWidth = pixelGrid[0].length;

      const klineWidth = Math.floor(canvas.width / gridWidth);
      const klineHeight = Math.floor(canvas.height / gridHeight);
      const klineBarWidth = Math.max(1, Math.floor(klineWidth * 0.5)); // 更细的K线

      const grid: KLineData[][] = [];

      for (let y = 0; y < gridHeight; y++) {
        const row: KLineData[] = [];
        for (let x = 0; x < gridWidth; x++) {
          const pixel = pixelGrid[y][x];
          const color = mapPixelToTradingColor(pixel);

          // K线高度根据亮度决定
          const baseHeight = pixel.brightness * klineHeight * 0.8;

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

    // 涟漪效果
    const createRipple = (clickX: number, clickY: number) => {
      const grid = klineGridRef.current;
      if (grid.length === 0) return;

      const gridHeight = grid.length;
      const gridWidth = grid[0].length;
      const klineWidth = Math.floor(canvas.width / gridWidth);
      const klineHeight = Math.floor(canvas.height / gridHeight);

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
                  const kline = grid[targetY][targetX];
                  grid[targetY][targetX] = updateKLine(kline, 5);
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
      if (!isInitialized) return;

      const grid = klineGridRef.current;
      if (grid.length === 0) return;

      const gridHeight = grid.length;
      const gridWidth = grid[0].length;
      const klineWidth = Math.floor(canvas.width / gridWidth);
      const klineBarWidth = Math.max(2, Math.floor(klineWidth * 0.6));

      // 清空画布（深色背景）
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 分批更新K线
      if (timestamp - lastUpdateRef.current > 1000) {
        lastUpdateRef.current = timestamp;
        updateCounterRef.current = 0;
      }

      const totalKLines = gridWidth * gridHeight;
      const batchSize = Math.ceil(totalKLines / 120); // 增加批次数以处理更多K线
      const startIndex = updateCounterRef.current * batchSize;
      const endIndex = Math.min(startIndex + batchSize, totalKLines);

      let currentIndex = 0;
      for (let y = 0; y < gridHeight; y++) {
        for (let x = 0; x < gridWidth; x++) {
          if (currentIndex >= startIndex && currentIndex < endIndex) {
            grid[y][x] = updateKLine(grid[y][x], 0.5);
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
          const kline = grid[y][x];
          drawKLine(ctx, kline, klineBarWidth);
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // 开始加载图片
    loadStarryNightImage();

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
    <div className="absolute inset-0 w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <div className="text-white text-center">
            <div className="animate-spin w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>正在加载梵高《星空》...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded">
          {error}
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        style={{ background: '#0a0a0a' }}
      />
    </div>
  );
}
