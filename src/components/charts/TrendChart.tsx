import type { TrendPoint } from "../../lib/types";

interface TrendChartProps {
  data: TrendPoint[];
  label: string;
  accent?: "orange" | "teal";
}

export function TrendChart({ data, label, accent = "orange" }: TrendChartProps) {
  const width = 520;
  const height = 220;
  const maxValue = Math.max(...data.map((point) => point.value));
  const minValue = Math.min(...data.map((point) => point.value));
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / Math.max(data.length - 1, 1)) * width;
    const y = height - ((point.value - minValue) / range) * (height - 30) - 15;
    return { x, y, label: point.label, value: point.value };
  });

  const linePath = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  const areaPath = `${linePath} L ${width} ${height} L 0 ${height} Z`;

  return (
    <div className="trend-chart" aria-label={label}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img">
        <defs>
          <linearGradient id={`area-${accent}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={accent === "orange" ? "#e76f51" : "#2a9d8f"} stopOpacity="0.36" />
            <stop offset="100%" stopColor={accent === "orange" ? "#f4a261" : "#b8ded8"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill={`url(#area-${accent})`} />
        <path d={linePath} fill="none" stroke={accent === "orange" ? "#e76f51" : "#2a9d8f"} strokeWidth="4" />
        {points.map((point) => (
          <circle
            key={point.label}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={accent === "orange" ? "#111827" : "#134e4a"}
            stroke="#fdfbf7"
            strokeWidth="3"
          />
        ))}
      </svg>
      <div className="trend-chart__labels">
        {points.map((point) => (
          <div key={point.label}>
            <span>{point.label}</span>
            <strong>{point.value}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
