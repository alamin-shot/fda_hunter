// components/charts/TotalWinRateGauge.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface GaugeDataPoint {
    name: string;
    value: number;
    color: string;
}

interface Props {
    data: GaugeDataPoint[];
    overallWinRate: number;
}
export default function TotalWinRateGauge({ data, overallWinRate }: Props) {
    return (
        <div className="rounded-3xl bg-[#050B1A] p-6 text-white w-full flex-1 flex flex-col">
            <h2 className="mb-6 text-2xl font-semibold">
                Total Win rate
            </h2>

            <div className="relative mx-auto h-[260px] w-full max-w-[520px]">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            startAngle={200}
                            endAngle={0}
                            innerRadius={90}
                            outerRadius={115}
                            paddingAngle={3}
                            stroke="none"
                            cornerRadius={8}
                        >
                            {data.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={entry.color}
                                />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 text-center">
                    <p className="text-lg text-[#98A2B3]">
                        Overall Win rate
                    </p>

                    <h3 className="mt-1 text-2xl font-bold">{overallWinRate.toFixed(0)}%</h3>
                </div>
            </div>

            <div className=" grid grid-cols-1 gap-y-4">
                {data.map((item) => (
                    <div
                        key={item.name}
                        className="flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="h-4 w-4 rounded-md"
                                style={{ backgroundColor: item.color }}
                            />

                            <span className="text-xl">{item.name}</span>
                        </div>

                        <span className="text-lg text-[#F2F4F7]">
                            {item.value.toFixed(2)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}