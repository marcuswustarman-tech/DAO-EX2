// K线数据类型
export interface KLineData {
  open: number;
  high: number;
  low: number;
  close: number;
  x: number;
  y: number;
  color: string;
}

// 生成随机K线数据
export function generateKLine(
  x: number,
  y: number,
  baseHeight: number,
  color: string
): KLineData {
  const open = baseHeight + (Math.random() - 0.5) * 10;
  const close = open + (Math.random() - 0.5) * 20;
  const high = Math.max(open, close) + Math.random() * 10;
  const low = Math.min(open, close) - Math.random() * 10;

  return { open, high, low, close, x, y, color };
}

// 绘制单根K线
export function drawKLine(
  ctx: CanvasRenderingContext2D,
  kline: KLineData,
  width: number = 4
) {
  const { open, high, low, close, x, y, color } = kline;

  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1;

  // 绘制上影线
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y - high);
  ctx.lineTo(x + width / 2, y - Math.max(open, close));
  ctx.stroke();

  // 绘制下影线
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y - Math.min(open, close));
  ctx.lineTo(x + width / 2, y - low);
  ctx.stroke();

  // 绘制实体
  const bodyHeight = Math.abs(close - open);
  const bodyY = y - Math.max(open, close);

  if (close > open) {
    // 阳线（空心）
    ctx.strokeRect(x, bodyY, width, bodyHeight);
  } else {
    // 阴线（实心）
    ctx.fillRect(x, bodyY, width, bodyHeight);
  }
}

// 更新K线数据（随机波动）
export function updateKLine(kline: KLineData, volatility: number = 0.3): KLineData {
  const change = (Math.random() - 0.5) * volatility;

  return {
    ...kline,
    open: kline.close,
    close: kline.close + change,
    high: Math.max(kline.close, kline.close + change) + Math.random() * volatility,
    low: Math.min(kline.close, kline.close + change) - Math.random() * volatility,
  };
}

// 梵高《星空》的色彩数据（简化版 - 代表性区域）
// 这是一个200x140的网格，代表《星空》的主要色彩分布
export function getStarryNightColorData(): { color: string; brightness: number }[][] {
  // 为了简化，我创建一个程序化的星空数据
  // 实际项目中可以用真实的图片数据
  const width = 200;
  const height = 140;
  const data: { color: string; brightness: number }[][] = [];

  for (let y = 0; y < height; y++) {
    const row: { color: string; brightness: number }[] = [];
    for (let x = 0; x < width; x++) {
      // 程序化生成星空的特征
      const normalizedX = x / width;
      const normalizedY = y / height;

      let color = '#1e3a5f'; // 深蓝（背景）
      let brightness = 0.3;

      // 旋涡区域（右上）
      const swirlCenterX = 0.75;
      const swirlCenterY = 0.25;
      const distToSwirl = Math.sqrt(
        Math.pow(normalizedX - swirlCenterX, 2) + Math.pow(normalizedY - swirlCenterY, 2)
      );

      if (distToSwirl < 0.15) {
        // 旋涡中心
        const angle = Math.atan2(normalizedY - swirlCenterY, normalizedX - swirlCenterX);
        const spiral = (angle + distToSwirl * 10) % (Math.PI / 2);

        if (spiral < Math.PI / 4) {
          color = '#f4d03f'; // 黄色（星光）
          brightness = 0.9;
        } else {
          color = '#5d9cec'; // 浅蓝
          brightness = 0.6;
        }
      }

      // 月亮区域（右上角）
      const moonCenterX = 0.85;
      const moonCenterY = 0.2;
      const distToMoon = Math.sqrt(
        Math.pow(normalizedX - moonCenterX, 2) + Math.pow(normalizedY - moonCenterY, 2)
      );

      if (distToMoon < 0.08) {
        color = '#f4d03f'; // 黄色
        brightness = 1.0;
      }

      // 星星（随机分布在上半部分）
      if (normalizedY < 0.5) {
        const starRandom = Math.sin(x * 0.4) * Math.cos(y * 0.3);
        if (starRandom > 0.95) {
          color = '#ffffff'; // 白色
          brightness = 0.95;
        }
      }

      // 丝柏树（左侧前景）
      if (normalizedX < 0.2 && normalizedY > 0.3) {
        const treeShape = Math.pow(1 - normalizedY, 2) * 0.3;
        if (normalizedX < treeShape) {
          color = '#0a0a0a'; // 黑色
          brightness = 0.1;
        }
      }

      // 村庄（底部）
      if (normalizedY > 0.7) {
        if (Math.random() > 0.7) {
          color = '#3d3d3d'; // 深灰
          brightness = 0.2;
        } else {
          color = '#1e3a5f'; // 深蓝
          brightness = 0.4;
        }
      }

      // 天空渐变（整体）
      if (normalizedY < 0.7) {
        const skyGradient = normalizedY / 0.7;
        brightness = brightness * (1 - skyGradient * 0.3);
      }

      row.push({ color, brightness });
    }
    data.push(row);
  }

  return data;
}

// 将RGB颜色转换为适合交易平台的配色
export function mapColorToTradingPalette(originalColor: string, brightness: number): string {
  // 限制色调：朱红、深灰、金黄、深蓝
  const hex = originalColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // 判断主色调
  const isYellow = (r + g) > b * 1.5 && g > r * 0.8; // 黄色系
  const isBlue = b > r && b > g; // 蓝色系
  const isDark = r < 50 && g < 50 && b < 50; // 深色系

  if (isYellow || brightness > 0.8) {
    // 亮色 -> 朱红或金黄
    return brightness > 0.9 ? '#f4d03f' : '#C83C23';
  } else if (isDark) {
    // 深色 -> 深灰
    return '#1a1a1a';
  } else if (isBlue) {
    // 蓝色系 -> 保留深蓝或转为深灰
    return brightness > 0.5 ? '#4a6fa5' : '#2d3e50';
  } else {
    // 其他 -> 中灰
    return '#737373';
  }
}

// 提取轮廓（简化的边缘检测）
export function extractContours(
  data: { color: string; brightness: number }[][]
): boolean[][] {
  const height = data.length;
  const width = data[0].length;
  const contours: boolean[][] = [];

  for (let y = 0; y < height; y++) {
    const row: boolean[] = [];
    for (let x = 0; x < width; x++) {
      const current = data[y][x].brightness;

      // 检查周围像素
      let isEdge = false;
      const neighbors = [
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
      ];

      for (const [nx, ny] of neighbors) {
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
          const neighbor = data[ny][nx].brightness;
          if (Math.abs(current - neighbor) > 0.3) {
            isEdge = true;
            break;
          }
        }
      }

      row.push(isEdge);
    }
    contours.push(row);
  }

  return contours;
}
