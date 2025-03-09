'use client';

interface DonutChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

export function DonutChart({ data }: DonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return (
    <div className="space-y-2">
      {data.map((item, i) => (
        <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
          <div>{item.name}</div>
          <div className="font-medium">
            {item.value} ({Math.round((item.value / total) * 100)}%)
          </div>
        </div>
      ))}
    </div>
  );
} 