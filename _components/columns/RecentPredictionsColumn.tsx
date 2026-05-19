import React from "react";
import PenIcon from "../icons/predictions/PenIcon";
import TrashIcon from "../icons/predictions/TrashIcon";

export const RecentPredictionColumn = (
  handleEditClick: (prediction: any) => void,
  handleDeleteClick: (prediction: any) => void,
  handleStatusChange: (prediction: any, newStatus: string) => void
) => [
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
      width: "18%",
      accessor: "title",
      sortable: true,
      formatter: (value: string) => (
        <span className="text-white text-sm font-medium">{value}</span>
      ),
    },
    {
      label: "Status",
      width: "12%",
      accessor: "status",
      sortable: true,
      formatter: (value: string | null, row: any) => {
        const currentStatus = value?.toLowerCase() || "active";
        const isResolved = currentStatus === "win" || currentStatus === "loss";
        const statusOptions = ["active", "win", "loss", "pending", "cancel"];

        const statusConfig: Record<string, string> = {
          win: "bg-[#22C55E] text-white",
          loss: "bg-[#EF4444] text-white",
          active: "bg-[#3B82F6] text-white",
          pending: "bg-[#F9C80E] text-gray-900",
          cancel: "bg-gray-600 text-white",
        };

        return (
          <select
            value={currentStatus}
            onChange={(e) => handleStatusChange(row, e.target.value)}
            disabled={isResolved}
            className={`px-2 py-1.5 rounded-lg text-sm font-medium outline-none border-none ${statusConfig[currentStatus] || "bg-gray-800 text-gray-400"
              } ${isResolved ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
            style={{
              backgroundColor: currentStatus === "win" ? "#22C55E" : currentStatus === "loss" ? "#EF4444" : currentStatus === "active" ? "#3B82F6" : currentStatus === "pending" ? "#F9C80E" : "#6B7280",
              color: currentStatus === "pending" ? "#1F2937" : "#fff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt} className="bg-[#1A1F2E] text-white">
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        );
      },
    },

    {
      label: "Signal",
      width: "10%",
      accessor: "signal",
      sortable: true,
      formatter: (value: string) => (
        <span className="text-white text-sm capitalize">{value?.replace(/_/g, " ") || "-"}</span>
      ),
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
      width: "12%",
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
    {
      label: "Action",
      width: "5%",
      accessor: "action",
      sortable: false,
      formatter: (_value: any, row: any) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEditClick(row)}
            className="p-1.5 bg-[#2F78EE] hover:bg-blue-600 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Edit"
          >
            <PenIcon />
          </button>
          <button
            onClick={() => handleDeleteClick(row)}
            className="p-1.5 bg-[#E03137] hover:bg-red-600 rounded-lg transition-colors duration-200 cursor-pointer"
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      ),
    },
  ];