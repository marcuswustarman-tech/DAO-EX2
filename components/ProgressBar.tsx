interface ProgressBarProps {
  current: number;
  total: number;
  showPercentage?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'accent' | 'green' | 'blue';
}

export default function ProgressBar({
  current,
  total,
  showPercentage = true,
  showLabel = false,
  size = 'md',
  color = 'accent'
}: ProgressBarProps) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    accent: 'bg-accent',
    green: 'bg-green-500',
    blue: 'bg-blue-500'
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-neutral-400">
            已完成 {current} / {total}
          </span>
          {showPercentage && (
            <span className="text-sm font-medium text-accent">
              {percentage}%
            </span>
          )}
        </div>
      )}
      <div className={`w-full bg-neutral-800 rounded-full overflow-hidden ${heightClasses[size]}`}>
        <div
          className={`${heightClasses[size]} ${colorClasses[color]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {!showLabel && showPercentage && (
        <div className="mt-1 text-right text-xs text-neutral-500">
          {percentage}%
        </div>
      )}
    </div>
  );
}
