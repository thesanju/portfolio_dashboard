
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AllocationData {
  name: string;
  value: number;
  color: string;
}

interface PortfolioAllocationProps {
  data: AllocationData[];
  className?: string;
}

export function PortfolioAllocation({ data, className }: PortfolioAllocationProps) {
  return (
    <div className={`h-72 ${className}`}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={false} // Remove direct labels on pie slices to avoid clutter
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Allocation']}
            contentStyle={{ background: 'white', borderRadius: '8px', border: '1px solid #eee' }}
          />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={10}
            formatter={(value, entry, index) => (
              <span className="text-sm">{`${value} (${data[index].value}%)`}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
