"use client";
import React, { useState, useEffect } from "react";
import DoubleUsersl from "../icons/users/DoubleUsersl";
import TikUsers from "../icons/users/TikUsers";
import PlusUsers from "../icons/users/PlusUsers";
import Token from "../icons/users/Token";
import PageHeader from "../reusable/PageHeader";
import { SearchBar } from "../reusable/SearchBar";
import CustomDropdown from "../reusable/CustomDropdown";
import DynamicTable from "../reusable/DynamicTable";
import { UsersColumn } from "../columns/UsersColumn";
import DynamicPagination from "../reusable/DynamicPagination";
import { dashboardApi, User, UsersOverview } from "@/services/dashboardApi";
import toast from "react-hot-toast";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function UsersHome() {
  // State for filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [promoCodeFilter, setPromoCodeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Stats state
  const [overview, setOverview] = useState<UsersOverview | null>(null);

  // Users list state
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  // Filter options
  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
  ];

  const promoCodeOptions = [
    { value: "all", label: "All Promo Codes" },
    { value: "used", label: "Used" },
    { value: "unused", label: "Not Used" },
  ];

  // Fetch users statistics
  const fetchUsersStats = async () => {
    try {
      const response = await dashboardApi.getUsersOverview();
      if (response.status) {
        setOverview(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch users overview:", error);
    }
  };

  // Fetch users list with filters and pagination
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        per_page: itemsPerPage,
      };

      if (searchTerm) {
        params.search = searchTerm;
      }
      if (statusFilter && statusFilter !== "all") {
        params.status = statusFilter;
      }
      if (promoCodeFilter === "used") {
        params.used_promo = "true";
      } else if (promoCodeFilter === "unused") {
        params.used_promo = "false";
      }

      const response = await dashboardApi.getUsers(params);
      if (response.status) {
        setUsers(response.data);

        // Parse pagination from meta
        if (response.meta?.pagination) {
          const p = response.meta.pagination;
          setTotalItems(p.total);
          setTotalPages(p.last_page);
          setCurrentPage(p.current_page);
          setItemsPerPage(p.per_page);
          setHasNextPage(p.current_page < p.last_page);
          setHasPrevPage(p.current_page > 1);
        }
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      // Reset on error
      setUsers([]);
      setTotalItems(0);
      setTotalPages(0);
      setHasNextPage(false);
      setHasPrevPage(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, statusFilter, promoCodeFilter]);

  // Fetch users when pagination changes
  useEffect(() => {
    fetchUsers();
  }, [currentPage, itemsPerPage]);

  // Fetch stats on component mount
  useEffect(() => {
    fetchUsersStats();
    fetchUsers();
  }, []);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };
  const handleUserStatusChange = async (userId: number, newStatus: string) => {
    try {
      const response = await dashboardApi.updateUserStatus(userId, newStatus);
      if (response.status) {
        toast.success(
          `User ${newStatus === "active" ? "activated" : "deactivated"}`,
        );
        fetchUsers();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // Prepare stat cards data with actual API data
  const statCardsData: StatCardProps[] = overview
    ? [
        {
          title: "Total Users",
          value: overview.total_users,
          period: "all time",
          icon: <DoubleUsersl />,
        },
        {
          title: "Active Users",
          value: overview.active_users,
          period: "currently active",
          icon: <TikUsers />,
        },
        {
          title: "New Today",
          value: overview.new_today,
          period: "today",
          icon: <PlusUsers />,
        },
        // {
        //   title: "Promo code Users",
        //   value: overview.promo_code_users,
        //   period: "using promos",
        //   icon: <Token />,
        // },
      ]
    : [
        {
          title: "Total Users",
          value: "-",
          period: "loading...",
          icon: <DoubleUsersl />,
        },
        {
          title: "Active Users",
          value: "-",
          period: "loading...",
          icon: <TikUsers />,
        },
        {
          title: "New Today",
          value: "-",
          period: "loading...",
          icon: <PlusUsers />,
        },
        {
          title: "Promo code Users",
          value: "-",
          period: "loading...",
          icon: <Token />,
        },
      ];

  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-2xl">
        <PageHeader
          title="All Users"
          subtitle="Manage all your predictions across categories"
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
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
              <p className="text-[#687588] text-sm font-medium">
                {card.period}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0E121B] p-6 rounded-2xl mt-4.5">
        <h3 className="text-white text-xl font-bold">Users</h3>

        <div className="mt-5 flex flex-col lg:flex-row items-center w-full gap-3.5">
          <SearchBar
            placeholder="Search by email"
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
            }}
            className="flex-1"
          />
          <CustomDropdown
            options={statusOptions}
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Select status"
            className="flex-1 w-full"
          />
          <CustomDropdown
            options={promoCodeOptions}
            value={promoCodeFilter}
            onChange={setPromoCodeFilter}
            placeholder="Select promo code"
            className="flex-1 w-full"
          />
        </div>

        <div className="mt-6">
          <DynamicTable
            columns={UsersColumn(handleUserStatusChange)}
            data={users}
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
            // isLoading={isLoading}
          />

          <div className="mt-4">
            <DynamicPagination
              currentPage={currentPage}
              totalPages={totalPages}
              hasNextPage={hasNextPage}
              hasPrevPage={hasPrevPage}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[2, 5, 10, 15, 20, 25, 30, 50]}
              showItemsPerPage={true}
              show={totalItems > 0}
              // isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
