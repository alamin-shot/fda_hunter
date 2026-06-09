import React from "react";

interface UserRowData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  registered: string;
  plan: string | null;
  subscription_status: string;
  status: string;
  // amount: number | null;
  // promo_code: string | null;
  created_at: string;
}

export const UsersColumn = (
  handleStatusChange?: (userId: number, newStatus: string) => void,
) => [
  {
    label: "User",
    width: "18%",
    accessor: "first_name",
    sortable: true,
    formatter: (_value: string, row?: UserRowData) => {
      const fullName =
        `${row?.first_name || ""} ${row?.last_name || ""}`.trim() || "Unknown";
      return (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#323B49] flex items-center justify-center">
            <span className="text-white font-medium text-sm">
              {fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-white text-sm font-medium">{fullName}</span>
        </div>
      );
    },
  },
  {
    label: "Email",
    width: "20%",
    accessor: "email",
    sortable: true,
    formatter: (v: string) => <span className="text-white text-sm">{v}</span>,
  },
  {
    label: "Plan",
    width: "10%",
    accessor: "plan",
    sortable: true,
    formatter: (v: string | null) => (
      <span className="text-white text-sm">{v || "Free"}</span>
    ),
  },
  {
    label: "Plan Status",
    width: "8%",
    accessor: "subscription_status",
    sortable: true,
    formatter: (v: string) => {
      const statusMap: Record<
        string,
        { bg: string; text: string; label: string }
      > = {
        active: {
          bg: "bg-green-900/30",
          text: "text-green-400",
          label: "active",
        },
        deactive: {
          bg: "bg-gray-800/50",
          text: "text-gray-400",
          label: "deactive",
        },
        none: { bg: "bg-gray-800/50", text: "text-gray-400", label: "none" },
        running: {
          bg: "bg-blue-900/30",
          text: "text-blue-400",
          label: "running",
        },
        billing_issue: {
          bg: "bg-red-900/30",
          text: "text-red-400",
          label: "billing_issue",
        },
        expired: {
          bg: "bg-yellow-900/30",
          text: "text-yellow-400",
          label: "expired",
        },
      };

      const status = statusMap[v] || statusMap.deactive;
      const displayLabel =
        status.label === "billing_issue" ? "billing issue" : status.label;

      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${status.bg} ${status.text}`}
        >
          {displayLabel}
        </span>
      );
    },
  },
  {
    label: "Registered",
    width: "10%",
    accessor: "registered",
    sortable: true,
    formatter: (v: string) => <span className="text-white text-sm">{v}</span>,
  },
  {
    label: "Status",
    width: "10%",
    accessor: "status",
    sortable: true,
    formatter: (value: string, row?: UserRowData) => {
      const currentStatus = value || "deactive";
      const config: Record<string, { bg: string; text: string }> = {
        active: { bg: "bg-[#22C55E]/20", text: "text-green-400" },
        deactive: { bg: "bg-[#EF4444]/20", text: "text-red-400" },
      };
      const status = config[currentStatus] || {
        bg: "bg-gray-600",
        text: "text-white",
      };

      return (
        <select
          value={currentStatus}
          onChange={(e) => handleStatusChange?.(row?.id!, e.target.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium outline-none cursor-pointer border-none ${status.bg} ${status.text} appearance-none bg-no-repeat pr-6`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: "right 6px center",
            backgroundSize: "14px 14px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <option value="active" className="bg-[#1A1F2E] text-white">
            Active
          </option>
          <option value="deactive" className="bg-[#1A1F2E] text-white">
            Deactive
          </option>
        </select>
      );
    },
  },
  // {
  //   label: "Amount",
  //   width: "8%",
  //   accessor: "amount",
  //   sortable: true,
  //   formatter: (v: number | null) => (
  //     <span className="text-white text-sm">{v != null ? `$${v}` : "-"}</span>
  //   ),
  // },
  // {
  //   label: "Promo Code",
  //   width: "10%",
  //   accessor: "promo_code",
  //   sortable: true,
  //   formatter: (v: string | null) => (
  //     <span className={`text-sm ${v ? "text-white" : "text-gray-500"}`}>
  //       {v || "No code"}
  //     </span>
  //   ),
  // },
];
