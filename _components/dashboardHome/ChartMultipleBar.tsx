"use client"

import { Bar, BarChart, XAxis, YAxis, Legend } from "recharts"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A multiple bar chart"

const chartData = [
  { month: "January", predicted: 186, actual: 80 },
  { month: "February", predicted: 305, actual: 200 },
  { month: "March", predicted: 237, actual: 120 },
  { month: "April", predicted: 73, actual: 190 },
  { month: "May", predicted: 209, actual: 130 },
  { month: "June", predicted: 214, actual: 140 },
]

const chartConfig = {
  predicted: {
    label: "Predicted Confidence",
    color: "#008640",
  },
  actual: {
    label: "Actual Win Rate",
    color: "#B0FCD4",
  },
} satisfies ChartConfig

// Custom Bar shape with top radius only
const BarWithTopRadius = (props: any) => {
  const { x, y, width, height, fill } = props;
  
  // If height is 0 or negative, don't render
  if (!height || height <= 0) {
    return null;
  }

  const radius = 12; // Top radius value
  
  return (
    <path
      d={`
        M ${x},${y + height}
        L ${x},${y + radius}
        Q ${x},${y} ${x + radius},${y}
        L ${x + width - radius},${y}
        Q ${x + width},${y} ${x + width},${y + radius}
        L ${x + width},${y + height}
        Z
      `}
      fill={fill}
    />
  );
};

export function ChartBarMultiple() {
  // Find the maximum value in the data to normalize to 100%
  const maxValue = Math.max(
    ...chartData.map(item => Math.max(item.predicted, item.actual))
  )
  
  // Create normalized data (0-100%)
  const normalizedData = chartData.map(item => ({
    month: item.month,
    predicted: Math.round((item.predicted / maxValue) * 100),
    actual: Math.round((item.actual / maxValue) * 100),
  }))

  return (
    <Card className="bg-transparent border-none">
      <CardContent>
        <ChartContainer config={chartConfig} className="h-91.5 w-full">
          <BarChart accessibilityLayer data={normalizedData}>
            {/* Legend positioned at top left */}
            <Legend 
              verticalAlign="top" 
              align="left"
              wrapperStyle={{
                paddingBottom: '20px',
                left: 0,
                top: -10,
              }}
              iconType="circle"
              iconSize={8}
              formatter={(value, entry) => {
                // Return the label from chartConfig based on the dataKey
                const dataKey = entry.dataKey as keyof typeof chartConfig;
                return chartConfig[dataKey]?.label || value;
              }}
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={{ stroke: '#e2e8f0' }}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
              tickMargin={10}
              ticks={[0, 20, 40, 60, 80, 100]}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent 
                indicator="dashed" 
                labelFormatter={(value) => `Month: ${value}`}
                formatter={(value, name) => [
                  `${value}%`,
                  chartConfig[name as keyof typeof chartConfig]?.label || name
                ]}
              />}
            />
            <Bar 
              dataKey="predicted" 
              fill="#008640" 
              shape={<BarWithTopRadius />}
              barSize={20}
              name="Predicted Confidence"
            />
            <Bar 
              dataKey="actual" 
              fill="#B0FCD4" 
              shape={<BarWithTopRadius />}
              barSize={20}
              name="Actual Win Rate"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
