'use client';

interface BarChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function BarChart({ data }: BarChartProps) {
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex justify-between items-center p-2 border-b">
          <div>{item.name}</div>
          <div className="font-medium">{item.value}</div>
        </div>
      ))}
    </div>
  );
} 