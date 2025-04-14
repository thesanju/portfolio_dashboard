
import { cn } from "@/lib/utils";
import { StockLineChart } from "../charts/line-chart";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  chartData: Array<{ name: string; value: number }>;
}

interface StockCardProps {
  stock: StockData;
  className?: string;
}

export function StockCard({ stock, className }: StockCardProps) {
  const isPositive = stock.change >= 0;

  return (
    <div className={cn("portfolio-card", className)}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-base font-semibold">{stock.symbol}</h3>
          <p className="text-xs text-gray">{stock.name}</p>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold">${stock.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p
            className={cn(
              "text-xs flex items-center gap-0.5 justify-end",
              isPositive ? "text-chart-green" : "text-chart-red"
            )}
          >
            {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {Math.abs(stock.change).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({Math.abs(stock.changePercent).toFixed(2)}%)
          </p>
        </div>
      </div>
      
      <StockLineChart
        data={stock.chartData}
        height={100}
        isPositive={isPositive}
        showGrid={false}
      />
    </div>
  );
}
