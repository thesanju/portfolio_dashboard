
import { useEffect, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { cn } from "@/lib/utils";

interface ChartData {
  name: string;
  value: number;
}

interface LineChartProps {
  data: ChartData[];
  color?: string;
  gradient?: boolean;
  showGrid?: boolean;
  height?: number;
  className?: string;
  isPositive?: boolean;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  formatter?: (value: number, name: string) => [string, string];
}

const CustomTooltip = ({ active, payload, formatter }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    let value = payload[0].value;
    let displayValue = formatter ? formatter(value, payload[0].name)[0] : value;
    
    return (
      <div className="bg-white shadow-lg rounded-lg p-3 border">
        <p className="font-medium">{displayValue}</p>
      </div>
    );
  }

  return null;
};

export function StockLineChart({
  data,
  color = "#9b87f5",
  gradient = true,
  showGrid = false,
  height = 200,
  className,
  isPositive = true
}: LineChartProps) {
  const chartId = useRef(`chart-${Math.random().toString(36).substr(2, 9)}`);

  return (
    <div className={cn("chart-container", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" className="chart-grid" />}
          <defs>
            <linearGradient id={chartId.current} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={isPositive ? "#4ADE80" : "#F87171"} stopOpacity={0.3} />
              <stop offset="95%" stopColor={isPositive ? "#4ADE80" : "#F87171"} stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#8E9196' }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#8E9196' }}
            dx={-10}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke={isPositive ? "#4ADE80" : "#F87171"}
            fillOpacity={1}
            fill={gradient ? `url(#${chartId.current})` : "transparent"}
            strokeWidth={2}
            className="animate-chart-line"
            activeDot={{ r: 4, fill: isPositive ? "#4ADE80" : "#F87171" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
