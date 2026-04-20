import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend, LineChart, Line } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const chartConfig = {
  hours: {
    label: "Hours Worked",
    color: "#8b5cf6", // Purple
  },
  productivity: {
    label: "Productivity Score",
    color: "#10b981", // Emerald
  },
};

export function ProductivityChart({ data }) {
  // Mock data if none provided
  const chartData = data || [
    { name: "Mon", hours: 6, productivity: 85 },
    { name: "Tue", hours: 8, productivity: 92 },
    { name: "Wed", hours: 7, productivity: 88 },
    { name: "Thu", hours: 9, productivity: 95 },
    { name: "Fri", hours: 5, productivity: 78 },
    { name: "Sat", hours: 2, productivity: 60 },
    { name: "Sun", hours: 0, productivity: 0 },
  ];

  return (
    <Card className="w-full border-border/50 bg-card/50 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <CardTitle>Developer Productivity</CardTitle>
        <CardDescription>Hours worked vs Productivity score</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
              <XAxis 
                dataKey="name" 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                yAxisId="left" 
                orientation="left" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                yAxisId="right" 
                orientation="right" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar yAxisId="left" dataKey="hours" name="Hours Worked" fill="var(--color-hours)" radius={[4, 4, 0, 0]} barSize={30} />
              <Line yAxisId="right" type="monotone" dataKey="productivity" name="Productivity" stroke="var(--color-productivity)" strokeWidth={3} dot={{ r: 4, fill: "var(--color-productivity)" }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
