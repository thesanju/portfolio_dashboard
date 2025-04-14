
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp } from "lucide-react";

interface CardStatProps {
  title: string;
  value: string | number;
  change?: number;
  icon?: ReactNode;
  className?: string;
  isPercentage?: boolean;
}

export function CardStat({ title, value, change, icon, className, isPercentage = false }: CardStatProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;
  
  return (
    <div className={cn("portfolio-card flex flex-col gap-2", className)}>
      <div className="flex justify-between items-start">
        <h3 className="text-sm font-medium text-gray">{title}</h3>
        {icon && <div className="text-gray-cool">{icon}</div>}
      </div>
      <div className="flex items-end justify-between gap-2">
        <div className="text-2xl font-semibold">{value}</div>
        {change !== undefined && (
          <div
            className={cn(
              "flex items-center text-sm gap-0.5",
              isPositive ? "text-chart-green" : "",
              isNegative ? "text-chart-red" : "",
              !isPositive && !isNegative ? "text-gray" : ""
            )}
          >
            {isPositive && <ArrowUp className="h-4 w-4" />}
            {isNegative && <ArrowDown className="h-4 w-4" />}
            {change.toFixed(2)}
            {isPercentage && "%"}
          </div>
        )}
      </div>
    </div>
  );
}
