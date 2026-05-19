import React from "react";

interface UserRowData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  registered: string;
  plan: string | null;
  status: string;
  amount: number | null;
  promo_code: string | null;
  created_at: string;
}

export const UsersColumn = [
  {
    label: "User",
    width: "20%",
    accessor: "first_name" as keyof UserRowData,
    sortable: true,
    formatter: (_value: string, row?: UserRowData) => {
      const fullName = `${row?.first_name || ""} ${row?.last_name || ""}`.trim() || "Unknown";
      const initial = fullName.charAt(0).toUpperCase();
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#323B49] flex items-center justify-center">
            <span className="text-white font-medium text-sm">{initial}</span>
          </div>
          <span className="text-white text-sm font-medium">{fullName}</span>
        </div>
      );
    },
  },
  {
    label: "Email",
    width: "22%",
    accessor: "email" as keyof UserRowData,
    sortable: true,
    formatter: (value: string) => <span className="text-white text-sm">{value}</span>,
  },
  {
    label: "Plan",
    width: "12%",
    accessor: "plan" as keyof UserRowData,
    sortable: true,
    formatter: (value: string | null) => (
      <span className="text-white text-sm">{value || "Free"}</span>
    ),
  },
  {
    label: "Registered",
    width: "12%",
    accessor: "registered" as keyof UserRowData,
    sortable: true,
    formatter: (value: string) => <span className="text-white text-sm">{value}</span>,
  },
  {
    label: "Status",
    width: "10%",
    accessor: "status" as keyof UserRowData,
    sortable: true,
    formatter: (value: string) => {
      const config: Record<string, { color: string; label: string }> = {
        active: { color: "bg-[#22C55E] text-white", label: "Active" },
        trial: { color: "bg-[#F9C80E] text-gray-900", label: "Trial" },
        expired: { color: "bg-[#EF4444] text-white", label: "Expired" },
        none: { color: "bg-gray-800 text-gray-400", label: "None" },
      };
      const c = config[value?.toLowerCase()] || { color: "bg-gray-800 text-gray-400", label: value || "N/A" };
      return <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${c.color}`}>{c.label}</span>;
    },
  },
  {
    label: "Amount",
    width: "10%",
    accessor: "amount" as keyof UserRowData,
    sortable: true,
    formatter: (value: number | null) => (
      <span className="text-white text-sm">{value != null ? `$${value}` : "-"}</span>
    ),
  },
  {
    label: "Promo Code",
    width: "14%",
    accessor: "promo_code" as keyof UserRowData,
    sortable: true,
    formatter: (value: string | null) => (
      <span className={`text-sm ${value ? "text-white" : "text-gray-500"}`}>{value || "No code"}</span>
    ),
  },
];