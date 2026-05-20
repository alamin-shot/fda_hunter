"use client";
import React, { useState, useEffect, useMemo } from "react";
import PageHeader from "../reusable/PageHeader";
import WinRateIcon from "../icons/dashboardHome/WinRateIcon";
import StaticsIcon from "../icons/sidebar/StaticsIcon";
import WalletIcon from "../icons/sidebar/WalletIcon";
import UsersIcon from "../icons/sidebar/UsersIcon";
import { SearchBar } from "../reusable/SearchBar";
import DynamicTable from "../reusable/DynamicTable";
import { PredictionColumn } from "../columns/PredictionColumn";
import DynamicPagination from "../reusable/DynamicPagination";
import ConfidenceVsOutcomeChart from "../charts/ConfidenceVsOutcomeChart";
import TotalWinRateGauge from "../charts/TotalWinRateGauge";
import {
  dashboardApi,
  DashboardOverview,
  Prediction,
} from "@/services/dashboardApi";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
  status?: "up" | "down";
}

export default function DashboardHome() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [allPredictions, setAllPredictions] = useState<Prediction[]>([]); // For charts
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const [predictionsError, setPredictionsError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    totalPages: 0,
    currentPage: 1,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.getDashboardOverview();
        if (response.status) {
          setOverview(response.data);
          setError(null);
        } else {
          setError(response.message);
        }
      } catch (err: any) {
        console.error("Error fetching dashboard overview:", err);
        setError(err.message || "Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  // Fetch ALL predictions for charts (no pagination limit)
  useEffect(() => {
    const fetchAllForCharts = async () => {
      try {
        const response = await dashboardApi.getPredictions({
          per_page: 100, // Get enough for chart calculations
        });
        if (response.status) {
          setAllPredictions(response.data);
        }
      } catch (err) {
        console.error("Error fetching all predictions for charts:", err);
      }
    };
    fetchAllForCharts();
  }, []);

  // Fetch predictions data
  const fetchPredictions = async (page: number = 1, limit: number = 10) => {
    try {
      setPredictionsLoading(true);
      const response = await dashboardApi.getPredictions({
        page,
        per_page: limit,
        search: search || undefined,
      });

      if (response.status) {
        setPredictions(response.data);
        if (response.meta?.pagination) {
          const p = response.meta.pagination;
          setPagination({
            totalItems: p.total,
            totalPages: p.last_page,
            currentPage: p.current_page,
            itemsPerPage: p.per_page,
            hasNextPage: p.current_page < p.last_page,
            hasPrevPage: p.current_page > 1,
          });
        }
        setPredictionsError(null);
      } else {
        setPredictionsError(response.message);
      }
    } catch (err: any) {
      console.error("Error fetching predictions:", err);
      setPredictionsError(err.message || "Failed to load predictions");
    } finally {
      setPredictionsLoading(false);
    }
  };

  // Initial fetch of predictions
  useEffect(() => {
    fetchPredictions(currentPage, itemsPerPage);
  }, []);

  // Filter data based on search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== undefined) {
        fetchPredictions(1, itemsPerPage);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    fetchPredictions(newPage, itemsPerPage);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    fetchPredictions(1, newItemsPerPage);
  };

  // Compute gauge chart data from predictions
  const gaugeData = useMemo(() => {
    const categories: Record<string, { total: number; wins: number }> = {};

    allPredictions.forEach((p) => {
      const name = p.category.name;
      if (!categories[name]) {
        categories[name] = { total: 0, wins: 0 };
      }
      categories[name].total++;
      if (p.status === "win") {
        categories[name].wins++;
      }
    });

    const colors: Record<string, string> = {
      Sports: "#7C4DFF",
      Casino: "#00C853",
      Stocks: "#46B8FF",
      Crypto: "#31384A",
    };

    return Object.entries(categories).map(([name, stats]) => ({
      name,
      value: stats.total > 0 ? (stats.wins / stats.total) * 100 : 0,
      color: colors[name] || "#6B7280",
    }));
  }, [allPredictions]);

  // Compute overall win rate for gauge center
  const overallWinRate = useMemo(() => {
    if (!overview) return 0;
    return overview.overall_win_rate;
  }, [overview]);

  // Compute bar chart data (monthly confidence vs actual)
  const barChartData = useMemo(() => {
    const monthMap: Record<
      string,
      { confidenceSum: number; count: number; wins: number; total: number }
    > = {};

    allPredictions.forEach((p) => {
      const date = new Date(p.scheduled_at);
      const monthKey = date.toLocaleString("en-US", { month: "short" });

      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { confidenceSum: 0, count: 0, wins: 0, total: 0 };
      }

      monthMap[monthKey].confidenceSum += p.confidence_level;
      monthMap[monthKey].count++;
      monthMap[monthKey].total++;
      if (p.status === "win") {
        monthMap[monthKey].wins++;
      }
    });

    // Get last 6 months in order
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonth = new Date().getMonth();
    const last6Months: string[] = [];
    for (let i = 5; i >= 0; i--) {
      const idx = (currentMonth - i + 12) % 12;
      last6Months.push(months[idx]);
    }

    return last6Months.map((month) => ({
      month,
      confidence: monthMap[month]
        ? Math.round(monthMap[month].confidenceSum / monthMap[month].count)
        : 0,
      actual:
        monthMap[month] && monthMap[month].total > 0
          ? Math.round((monthMap[month].wins / monthMap[month].total) * 100)
          : 0,
    }));
  }, [allPredictions]);

  // Dashboard stats cards data
  const statCardsData: StatCardProps[] = useMemo(() => {
    if (!overview) {
      return [
        {
          title: "Overall Win Rate",
          value: loading ? "Loading..." : "0%",
          period: "vs last month",
          icon: <WinRateIcon />,
        },
        {
          title: "Active Predictions",
          value: loading ? "Loading..." : 0,
          period: "vs last month",
          icon: <StaticsIcon />,
        },
        {
          title: "Total Records",
          value: loading ? "Loading..." : "0",
          period: "vs last month",
          icon: <WalletIcon />,
        },
        {
          title: "Total Win",
          value: loading ? "Loading..." : "$0",
          period: "vs last month",
          icon: <UsersIcon />,
        },
      ];
    }

    const formatNumber = (value: number) =>
      new Intl.NumberFormat("en-US").format(value);
    const formatPercentage = (value: number) => `${value.toFixed(2)}%`;

    return [
      {
        title: "Overall Win Rate",
        value: formatPercentage(overview.overall_win_rate),
        period: "average",
        icon: <WinRateIcon />,
      },
      {
        title: "Active Predictions",
        value: formatNumber(overview.active_predictions),
        period: "currently active",
        icon: <StaticsIcon />,
      },
      {
        title: "Total Records",
        value: formatNumber(overview.total_subscribers),
        period: "total",
        icon: <WalletIcon />,
      },
      {
        title: "Total Win",
        value: formatNumber(overview.monthly_revenue),
        period: "wins",
        icon: <UsersIcon />,
      },
    ];
  }, [overview, loading]);

  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-xl">
        <div className="flex justify-between items-start">
          <PageHeader
            title="Hi, Meyer"
            subtitle="This is your break down summaries so far"
            titleClass="text-2xl font-bold text-white"
            subtitleClass="text-[#687588] text-sm"
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          {statCardsData.map((card, index) => (
            <div
              className="p-3 relative border border-[#2B303B] rounded-xl overflow-hidden"
              key={index}
            >
              <div className="flex items-center gap-2">
                <div className="bg-[#181B25] p-2 rounded-xl">{card.icon}</div>
                <h3 className="text-white text-base font-medium">
                  {card.title}
                </h3>
              </div>
              <h2 className="text-white text-2xl font-medium my-3">
                {card.value}
              </h2>
              <p className="text-sm font-medium text-[#687588]">
                {card.period}
              </p>
              {loading && !overview && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="mt-4.5 flex flex-col lg:flex-row gap-4.5 items-stretch">
        {allPredictions.length > 0 ? (
          <>
            <div className="w-full lg:w-[70%] flex flex-col">
              <ConfidenceVsOutcomeChart data={barChartData} />
            </div>
            <div className="w-full lg:w-[30%] flex flex-col">
              <TotalWinRateGauge
                data={gaugeData}
                overallWinRate={overallWinRate}
              />
            </div>
          </>
        ) : (
          <>
            <div className="w-full lg:w-[70%] h-full rounded-3xl bg-[#050B1A] p-6 text-white flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            </div>
            <div className="w-full lg:w-[30%] h-full rounded-3xl bg-[#050B1A] p-6 text-white flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-3"></div>
                <p className="text-gray-400">Loading chart data...</p>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Table Section with Pagination */}
      <div className="bg-[#0E121B] mt-4.5 p-6 rounded-2xl">
        <div className="flex justify-between items-center">
          <h2 className="text-xl text-white font-bold">Recent Predictions</h2>
          <SearchBar
            value={search}
            onChange={setSearch}
            className="max-w-md"
            placeholder="Search Picks"
          />
        </div>

        <div className="mt-6">
          {predictionsError && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{predictionsError}</p>
            </div>
          )}

          {predictionsLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="text-white mt-4">Loading predictions...</p>
            </div>
          ) : predictions.length > 0 ? (
            <>
              <DynamicTable
                columns={PredictionColumn}
                data={predictions}
                hasWrapperBorder={false}
                headerStyles={{
                  backgroundColor: "#323B49",
                  textColor: "#CBD5E0",
                  fontSize: "12px",
                  padding: "16px",
                  fontWeight: "600",
                }}
                roundedClass="rounded-b-none"
                minWidth={800}
                cellBorderColor="#323B49"
              />
              <div className="mt-4">
                <DynamicPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                  onPageChange={handlePageChange}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  itemsPerPageOptions={[5, 10, 15, 20, 25, 30, 50]}
                  showItemsPerPage={true}
                  show={pagination.totalItems > 0}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#687588]">No predictions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
