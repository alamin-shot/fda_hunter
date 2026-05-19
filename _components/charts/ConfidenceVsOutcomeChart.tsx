// components/charts/ConfidenceVsOutcomeChart.tsx
"use client";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

interface ChartDataPoint {
    month: string;
    confidence: number;
    actual: number;
}
interface Props {
    data: ChartDataPoint[];
}
const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;

    return (
        <div className="rounded-xl border border-white/10 bg-[#1B2035] px-4 py-3 shadow-xl">
            <div className="space-y-1 text-sm">
                <p className="text-white">
                    Confidence:{" "}
                    <span className="font-semibold">
                        {payload[0]?.value}%
                    </span>
                </p>

                <p className="text-[#B9C0D4]">
                    Actual:{" "}
                    <span className="font-semibold">
                        {payload[1]?.value}%
                    </span>
                </p>
            </div>
        </div>
    );
};

export default function ConfidenceVsOutcomeChart({ data }: Props) {
    return (
        <div className="rounded-3xl bg-[#050B1A] p-6 text-white w-full flex-1 flex flex-col">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">
                        Overall Confidence vs Actual Outcome
                    </h2>

                    <div className="mt-3 flex items-center gap-5 text-sm text-[#98A2B3]">
                        <div className="flex items-center gap-2">
                            <div className="h-3 w-6 rounded-full bg-[#00C853]" />
                            predicted confidence
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="h-3 w-6 rounded-full bg-[#B9FFE2]" />
                            Actual win rate
                        </div>
                    </div>
                </div>

                <button className="rounded-xl border border-white/10 bg-[#0B1220] px-4 py-2 text-sm text-[#D0D5DD]">
                    Last 6 month
                </button>
            </div>

            <div className="flex-1 min-h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        barGap={10}
                        margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
                    >
                        <CartesianGrid
                            vertical={false}
                            stroke="#1B2236"
                            strokeDasharray="3 3"
                        />

                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#667085", fontSize: 14 }}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#667085", fontSize: 13 }}
                            tickFormatter={(v) => `${v}%`}
                        />

                        <Tooltip
                            cursor={{ fill: "rgba(255,255,255,0.03)" }}
                            content={<CustomTooltip />}
                        />

                        <Bar
                            dataKey="confidence"
                            fill="#00C853"
                            radius={[8, 8, 0, 0]}
                            barSize={10}
                        />

                        <Bar
                            dataKey="actual"
                            fill="#B9FFE2"
                            radius={[8, 8, 0, 0]}
                            barSize={10}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}