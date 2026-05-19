import React from "react";

export const PredictionColumn = [
  {
    label: "Category",
    width: "12%",
    accessor: "category",
    sortable: true,
    formatter: (value: any) => {
      const name = value?.name || "Unknown";
      const colors: Record<string, string> = {
        Sports: "bg-[#7C4DFF]/20 text-[#7C4DFF]",
        Casino: "bg-[#00C853]/20 text-[#00C853]",
        Stocks: "bg-[#46B8FF]/20 text-[#46B8FF]",
        Crypto: "bg-[#F7931A]/20 text-[#F7931A]",
      };
      return (
        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${colors[name] || "bg-gray-700 text-gray-300"}`}>
          {name}
        </span>
      );
    },
  },
  {
    label: "Title",
    width: "22%",
    accessor: "title",
    sortable: true,
    formatter: (value: string) => (
      <span className="text-white text-sm font-medium">{value}</span>
    ),
  },
  {
    label: "Status",
    width: "10%",
    accessor: "status",
    sortable: true,
    formatter: (value: string | null) => {
      const config: Record<string, { color: string; label: string }> = {
        win: { color: "bg-[#22C55E] text-white", label: "Win" },
        loss: { color: "bg-[#EF4444] text-white", label: "Loss" },
        active: { color: "bg-[#3B82F6] text-white", label: "Active" },
        pending: { color: "bg-[#F9C80E] text-gray-900", label: "Pending" },
      };
      const c = config[value?.toLowerCase() || ""] || { color: "bg-gray-800 text-gray-400", label: value || "N/A" };
      return <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${c.color}`}>{c.label}</span>;
    },
  },
  {
    label: "Confidence",
    width: "10%",
    accessor: "confidence_level",
    sortable: true,
    formatter: (value: number) => (
      <span className="text-white text-sm font-medium">{value}%</span>
    ),
  },
  {
    label: "Created",
    width: "14%",
    accessor: "created_at",
    sortable: true,
    formatter: (value: string) => {
      const date = new Date(value);
      return (
        <span className="text-sm text-white">
          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
      );
    },
  },
  {
    label: "Win Rate",
    width: "8%",
    accessor: "win_rate",
    sortable: true,
    formatter: (value: string | null) => (
      <span className="text-white text-sm">{value ? `${value}%` : "-"}</span>
    ),
  },
];