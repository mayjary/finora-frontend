import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface PerformancePoint {
  date: string;
  daily_pnl: number | string;
}

interface PerformanceChartProps {
  data?: PerformancePoint[];
}

export const PerformanceChart = ({ data = [] }: PerformanceChartProps) => {
  // If no data from DB → show empty chart
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-muted-foreground">
        No performance data yet.
      </div>
    );
  }

  // Convert DB data properly
  let cumulative = 0;

  const chartData = data.map((point) => {
    const pnl = Number(point.daily_pnl);
    cumulative += pnl;

    return {
      date: new Date(point.date).toLocaleDateString(),
      equity: cumulative,
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <XAxis
          dataKey="date"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          tickFormatter={(value) =>
            `$${value.toLocaleString()}`
          }
        />
        <Tooltip
          formatter={(value: number) =>
            `$${value.toLocaleString()}`
          }
          contentStyle={{
            backgroundColor: "hsl(var(--card))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Line
          type="monotone"
          dataKey="equity"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};