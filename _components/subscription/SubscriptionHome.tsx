"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import PageHeader from "../reusable/PageHeader";
import SubscribersIcon from "../icons/subscription/SubscribersIcon";
import MonthlyRevIcon from "../icons/subscription/MonthlyRevIcon";
import RevPerUserIcon from "../icons/subscription/RevPerUserIcon";
import ChurnIcon from "../icons/subscription/ChurnIcon";
import PlusIcon from "../icons/predictions/PlusIcon";
import CustomModal from "../reusable/CustomModal";
import DocumentsIcon from "../icons/subscription/DocumentsIcon";
import RedTrashIcon from "../icons/subscription/RedTrashIcon";
import TikMark from "../icons/subscription/TikMark";
import { Switch } from "@/components/ui/switch";
import CustomDropdown from "../reusable/CustomDropdown";
import { Calendar } from "@/components/ui/calendar";
import { PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  dashboardApi,
  SubscriptionPlan,
  SubscriptionOverview,
  PromoCode,
} from "@/services/dashboardApi";
import ConfirmModal from "../reusable/ConfirmModal";
import { Popover, PopoverContent } from "@/components/ui/popover";

interface StatCardProps {
  title: string;
  value: string | number;
  period: string;
  icon: React.ReactNode;
}

export default function SubscriptionHome() {
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [codeModalOpen, setCodeModalOpen] = useState(false);
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [loadingPromoCodes, setLoadingPromoCodes] = useState(false);
  const [overview, setOverview] = useState<SubscriptionOverview | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<
    SubscriptionPlan[]
  >([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
    type: "plan" | "promo";
  } | null>(null);
  // Form states
  const [planName, setPlanName] = useState("");
  const [planTitle, setPlanTitle] = useState("");
  const [planAmount, setPlanAmount] = useState("");
  const [planDescription, setPlanDescription] = useState("");

  // Promo code form states
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState("");
  const [promoMaxUses, setPromoMaxUses] = useState("");
  const [promoExpiryDate, setPromoExpiryDate] = useState("");
  const [creatingPromoCode, setCreatingPromoCode] = useState(false);

  const [editPlanId, setEditPlanId] = useState<number | null>(null);
  const [editPlanName, setEditPlanName] = useState("");
  const [editPlanPrice, setEditPlanPrice] = useState("");
  const [editPlanFeatures, setEditPlanFeatures] = useState("");
  const [editPlanPeriod, setEditPlanPeriod] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);

  // Fetch subscription packages and promo codes on component mount
  useEffect(() => {
    fetchSubscriptionPackages();
    fetchPromoCodes();
  }, []);
  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const response = await dashboardApi.getSubscriptionOverview();
        if (response.status) {
          setOverview(response.data);
        }
      } catch (error) {
        console.error("Error fetching subscription overview:", error);
      }
    };
    fetchOverview();
  }, []);

  const fetchSubscriptionPackages = async () => {
    setLoadingPackages(true);
    try {
      const response = await dashboardApi.getSubscriptionPlans();
      if (response.status && response.data) {
        setSubscriptionPlans(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching subscription plans:", error);
      toast.error(error.message || "Failed to load subscription plans");
      setSubscriptionPlans([]);
    } finally {
      setLoadingPackages(false);
    }
  };

  const fetchPromoCodes = async () => {
    setLoadingPromoCodes(true);
    try {
      const response = await dashboardApi.getPromoCodes();
      if (response.status && response.data) {
        setPromoCodes(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching promo codes:", error);
      toast.error(error.message || "Failed to load promo codes");
      setPromoCodes([]);
    } finally {
      setLoadingPromoCodes(false);
    }
  };

  // Helper function to format duration display
  const formatDurationDisplay = (duration: string): string => {
    if (!duration || duration === "0") return "lifetime";

    const days = parseInt(duration);
    if (isNaN(days)) return duration;

    if (days === 30) return "month";
    if (days === 60) return "2 months";
    if (days === 90) return "3 months";
    if (days === 180) return "6 months";
    if (days === 365) return "year";
    return `${days} days`;
  };

  // Helper function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "Never";

    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Copy promo code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Promo code copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast.error("Failed to copy promo code");
      });
  };

  // Helper function to handle switch toggle
  const handlePromoCodeToggle = async (id: number) => {
    try {
      const response = await dashboardApi.togglePromoCode(id);
      if (response.status) {
        toast.success(
          `Promo code ${response.data.status === "active" ? "activated" : "deactivated"}`,
        );
        fetchPromoCodes(); // Refresh the list
      } else {
        toast.error(response.message || "Failed to toggle promo code");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Failed to toggle promo code",
      );
    }
  };
  const handleOpenEdit = (plan: SubscriptionPlan) => {
    setEditPlanId(plan.id);
    setEditPlanName(plan.name);
    setEditPlanPrice(plan.price);
    setEditPlanFeatures(plan.features.join(", "));
    setEditPlanPeriod(plan.billing_period);
    setEditModalOpen(true);
  };

  const handleUpdatePlan = async () => {
    if (!editPlanName.trim()) return toast.error("Name is required");
    if (!editPlanPrice.trim()) return toast.error("Price is required");

    setLoading(true);
    try {
      const response = await dashboardApi.updatePlan(editPlanId!, {
        name: editPlanName.trim(),
        features: editPlanFeatures
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
      });
      if (response.status) {
        toast.success("Plan updated!");
        fetchSubscriptionPackages();
        setEditModalOpen(false);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update plan");
    } finally {
      setLoading(false);
    }
  };
  const handleDeletePlan = (id: number, name: string) => {
    setDeleteTarget({ id, name, type: "plan" });
    setDeleteModalOpen(true);
  };

  // Handle delete promo code
  const handleDeletePromoCode = (id: number, code: string) => {
    setDeleteTarget({ id, name: code, type: "promo" });
    setDeleteModalOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === "plan") {
        const response = await dashboardApi.deletePlan(deleteTarget.id);
        if (response.status) {
          toast.success("Plan deleted!");
          fetchSubscriptionPackages();
        }
      } else {
        const response = await dashboardApi.deletePromoCode(deleteTarget.id);
        if (response.status) {
          toast.success("Promo code deleted successfully!");
          fetchPromoCodes();
        }
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete");
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  const durationOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "yearly", label: "Yearly" },
    { value: "half_yearly", label: "Half Yearly" },
  ];

  const statCardsData: StatCardProps[] = overview
    ? [
        {
          title: "Total Subscribers",
          value: overview.total_subscribers,
          period: "all time",
          icon: <SubscribersIcon />,
        },
        {
          title: "Monthly Revenue",
          value: `$${overview.monthly_revenue}`,
          period: "this month",
          icon: <MonthlyRevIcon />,
        },
        {
          title: "Avg. Revenue per User",
          value: `$${overview.avg_revenue_per_user}`,
          period: "average",
          icon: <RevPerUserIcon />,
        },
        {
          title: "Churn Rate",
          value: `${overview.churn_rate}%`,
          period: "current",
          icon: <ChurnIcon />,
        },
      ]
    : [
        {
          title: "Total Subscribers",
          value: "-",
          period: "loading...",
          icon: <SubscribersIcon />,
        },
        {
          title: "Monthly Revenue",
          value: "-",
          period: "loading...",
          icon: <MonthlyRevIcon />,
        },
        {
          title: "Avg. Revenue per User",
          value: "-",
          period: "loading...",
          icon: <RevPerUserIcon />,
        },
        {
          title: "Churn Rate",
          value: "-",
          period: "loading...",
          icon: <ChurnIcon />,
        },
      ];

  const handleCreatePlan = async () => {
    if (!planName.trim()) {
      toast.error("Plan name is required");
      return;
    }
    if (!planTitle.trim()) {
      toast.error("Plan title is required");
      return;
    }
    if (
      !planAmount.trim() ||
      isNaN(Number(planAmount)) ||
      Number(planAmount) <= 0
    ) {
      toast.error("Valid amount is required");
      return;
    }
    if (!duration) {
      toast.error("Duration is required");
      return;
    }
    if (!planDescription.trim()) {
      toast.error("Description is required");
      return;
    }

    setLoading(true);

    try {
      const requestData = {
        name: planName.trim(),
        price: String(planAmount),
        billing_period: duration,
        features: planDescription
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean),
        stripe_price_id: "price_xxx",
      };

      const response = await dashboardApi.createPlan(requestData);

      if (response.status) {
        toast.success("Subscription plan created successfully!");

        await fetchSubscriptionPackages();

        setPlanName("");
        setPlanTitle("");
        setPlanAmount("");
        setPlanDescription("");
        setDuration("");

        setPlanModalOpen(false);
      } else {
        toast.error(response.message || "Failed to create subscription plan");
      }
    } catch (error: any) {
      console.error("Error creating subscription plan:", error);
      toast.error(error.message || "Failed to create subscription plan");
    } finally {
      setLoading(false);
    }
  };
  const handlePlanToggle = async (id: number) => {
    try {
      const response = await dashboardApi.togglePlanStatus(id);
      if (response.status) {
        toast.success(response.message || "Plan status updated");
        fetchSubscriptionPackages();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to toggle plan");
    }
  };
  // Handle create promo code
  const handleCreatePromoCode = async () => {
    if (!promoCode.trim()) {
      toast.error("Promo code is required");
      return;
    }
    if (
      !promoDiscount.trim() ||
      isNaN(Number(promoDiscount)) ||
      Number(promoDiscount) <= 0 ||
      Number(promoDiscount) > 100
    ) {
      toast.error("Valid discount percentage (1-100) is required");
      return;
    }
    if (
      !promoMaxUses.trim() ||
      isNaN(Number(promoMaxUses)) ||
      Number(promoMaxUses) <= 0
    ) {
      toast.error("Valid max usage is required");
      return;
    }

    setCreatingPromoCode(true);

    try {
      const requestData = {
        code: promoCode.trim(),
        discount: promoDiscount,
        type: "percentage" as const,
        max_users: Number(promoMaxUses),
        ...(promoExpiryDate && {
          expires_at: new Date(promoExpiryDate).toISOString(),
        }),
      };

      const response = await dashboardApi.createPromoCode(requestData);

      if (response.status) {
        toast.success("Promo code created successfully!");

        await fetchPromoCodes();

        setPromoCode("");
        setPromoDiscount("");
        setPromoMaxUses("");
        setPromoExpiryDate("");

        setCodeModalOpen(false);
      } else {
        toast.error(response.message || "Failed to create promo code");
      }
    } catch (error: any) {
      console.error("Error creating promo code:", error);
      toast.error(error.message || "Failed to create promo code");
    } finally {
      setCreatingPromoCode(false);
    }
  };

  // Function to render subscription cards with real API data
  const renderSubscriptionCards = () => {
    if (loadingPackages) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-[#00F474] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (subscriptionPlans.length === 0) {
      return (
        <div className="text-center py-12 border border-[#2B303B] rounded-lg mt-6">
          <p className="text-[#A5A5AB] text-lg">
            No subscription packages found
          </p>
          <p className="text-[#717784] text-sm mt-2">
            Create your first subscription plan to get started
          </p>
        </div>
      );
    }

    const isSinglePlan = subscriptionPlans.length === 1;

    if (isSinglePlan) {
      const plan = subscriptionPlans[0];
      const features = plan.features || [];

      return (
        <div className="border border-[#2B303B] mt-6 rounded-lg overflow-hidden">
          <div className="p-4 flex items-center justify-between bg-[#181B25]">
            <div>
              <h3 className="text-white text-base font-semibold">
                {plan.name}
              </h3>
              <p className="text-[#A5A5AB] text-sm font-medium mt-1">
                {plan.description}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center justify-end gap-2">
                <Switch
                  checked={plan.is_active}
                  onCheckedChange={() => handlePlanToggle(plan.id)}
                  className="cursor-pointer"
                />
                <span
                  className={`text-xs ${plan.is_active ? "text-green-400" : "text-red-400"}`}
                >
                  {plan.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <button
                className="cursor-pointer hover:bg-white/10 p-1 rounded"
                onClick={() => handleOpenEdit(plan)}
              >
                <DocumentsIcon />
              </button>
              <button
                className="cursor-pointer hover:bg-white/10 p-1 rounded"
                onClick={() => handleDeletePlan(plan.id, plan.name)}
              >
                <RedTrashIcon />
              </button>
            </div>
          </div>
          <div className="p-6 bg-[#0E121B] flex items-center gap-6">
            <div className="text-white">
              <h2 className="text-[32px] font-semibold">
                ${plan.price}
                <span className="text-sm text-[#A5A5AB] font-medium ml-1">
                  /{formatDurationDisplay(plan.billing_period)}
                </span>
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-xs text-[#A5A5AB]">USD</span>
              </div>
            </div>
            <ul className="space-y-1">
              {features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <TikMark />
                  </div>
                  <p className="text-sm text-[#A5A5AB] font-medium">
                    {feature}
                  </p>
                </li>
              ))}
            </ul>
            <ul className="space-y-1">
              {features.slice(3, 6).map((feature, index) => (
                <li key={index} className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    <TikMark />
                  </div>
                  <p className="text-sm text-[#A5A5AB] font-medium">
                    {feature}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    const getGridColumns = () => {
      if (subscriptionPlans.length === 2) return "grid-cols-1 md:grid-cols-2";
      return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
    };

    return (
      <div className={`grid ${getGridColumns()} gap-6 mt-6`}>
        {subscriptionPlans.map((plan) => {
          const features = plan.features || [];

          return (
            <div
              key={plan.id}
              className="border border-[#2B303B] rounded-lg overflow-hidden hover:border-[#00F474]/30 transition-colors duration-200 flex flex-col"
            >
              <div className="p-4 bg-[#181B25] border-b border-[#2B303B]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white text-base font-semibold">
                      {plan.name}
                    </h3>
                    <p className="text-[#A5A5AB] text-xs font-medium mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="cursor-pointer hover:bg-white/10 p-1 rounded"
                      onClick={() => handleOpenEdit(plan)}
                    >
                      <DocumentsIcon />
                    </button>
                    <button
                      className="cursor-pointer hover:bg-white/10 p-1 rounded"
                      onClick={() => handleDeletePlan(plan.id, plan.name)}
                    >
                      <RedTrashIcon />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#0E121B] flex flex-col h-full">
                <div className="mb-4">
                  <div className="mb-4">
                    <h2 className="text-white text-2xl md:text-[28px] font-semibold">
                      ${plan.price}
                      <span className="text-sm text-[#A5A5AB] font-medium ml-1">
                        /{formatDurationDisplay(plan.billing_period)}
                      </span>
                    </h2>
                  </div>
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      {features.length > 0 ? (
                        features.map((feature, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <div className="mt-1 flex-shrink-0">
                              <TikMark />
                            </div>
                            <p className="text-sm text-[#A5A5AB] font-medium flex-1">
                              {feature}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#717784] italic">
                          No features specified
                        </p>
                      )}
                    </div>

                    <div className="flex items-center  gap-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${plan.is_active ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}
                      >
                        {plan.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-[#A5A5AB]">USD</span>
                    </div>
                  </div>
                </div>

                {/* <button className="w-full mt-auto pt-4 py-2.5 bg-[#00F474] text-[#1D1F2C] font-semibold rounded-lg hover:bg-[#00F474]/90 transition-colors active:scale-[0.98]">
                  Select Plan
                </button> */}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Function to render promo code cards with real API data
  const renderPromoCodeCards = () => {
    if (loadingPromoCodes) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="w-8 h-8 border-2 border-[#00F474] border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (promoCodes.length === 0) {
      return (
        <div className="text-center py-12 border border-[#2B303B] rounded-lg mt-6">
          <p className="text-[#A5A5AB] text-lg">No promo codes found</p>
          <p className="text-[#717784] text-sm mt-2">
            Create your first promo code to get started
          </p>
        </div>
      );
    }

    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {promoCodes.map((promo) => (
          <div key={promo.id} className="p-4 bg-[#21252d] rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex-1">
                <h3 className="text-2xl text-[#00F474] font-semibold">
                  {promo.code}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-lg font-bold text-white">
                    {promo.discount}% OFF
                  </span>
                  <span className="text-[#A5A5AB] text-xs font-medium">
                    Discount
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="cursor-pointer hover:bg-white/10 p-1.5 rounded transition-colors"
                  onClick={() => copyToClipboard(promo.code)}
                  title="Copy promo code"
                >
                  <DocumentsIcon />
                </button>
                <button
                  className="cursor-pointer hover:bg-white/10 p-1.5 rounded"
                  onClick={() => handleDeletePromoCode(promo.id, promo.code)}
                  title="Delete promo code"
                >
                  <RedTrashIcon />
                </button>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              <li className="flex items-center justify-between">
                <p className="text-sm text-[#D2D2D5] font-medium">Status:</p>
                <div className="flex items-center gap-2">
                  <Switch
                    className="cursor-pointer"
                    checked={promo.status === "active"}
                    onCheckedChange={() => handlePromoCodeToggle(promo.id)}
                  />
                </div>
              </li>
              <li className="flex items-center justify-between">
                <p className="text-sm text-[#D2D2D5] font-medium">Max Uses:</p>
                <p className="text-sm text-white font-medium">
                  {promo.max_users}
                </p>
              </li>
              <li className="flex items-center justify-between">
                <p className="text-sm text-[#D2D2D5] font-medium">Used:</p>
                <p className="text-sm text-white font-medium">
                  {promo.used_count}
                </p>
              </li>
              <li className="flex items-center justify-between">
                <p className="text-sm text-[#D2D2D5] font-medium">Expires:</p>
                <p className="text-sm text-white font-medium">
                  {formatDate(promo.expires_at)}
                </p>
              </li>
              <li className="flex items-center justify-between">
                <p className="text-sm text-[#D2D2D5] font-medium">Created:</p>
                <p className="text-sm text-white font-medium">
                  {formatDate((promo as any).created_at)}
                </p>
              </li>
            </ul>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="bg-[#0E121B] p-6 rounded-lg">
        <PageHeader
          title="Subscription Management"
          subtitle="Manage subscription plans and promo codes"
        />
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
              <p className="text-[#687588] text-sm font-medium">
                {card.period}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#0E121B] p-6 rounded-lg mt-4.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-2xl font-bold">
              Subscription Plans
            </h3>
            <p className="text-[#A5A5AB] text-sm font-medium mt-1">
              Manage and customize your subscription packages
            </p>
          </div>

          <button
            onClick={() => setPlanModalOpen(true)}
            className="bg-[#00F474] text-base text-[#1D1F2C] font-semibold p-2 rounded-lg
                                 cursor-pointer flex items-center gap-1 hover:bg-[#00F474]/90 transition active:scale-95"
          >
            <PlusIcon />
            Add new plan
          </button>
        </div>

        {renderSubscriptionCards()}
      </div>

      <div className="bg-[#0E121B] p-6 rounded-lg mt-4.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white text-2xl font-bold">Promo Codes</h3>
            <p className="text-[#A5A5AB] text-sm font-medium mt-1">
              Create and manage promotional discount codes
            </p>
          </div>

          <button
            onClick={() => setCodeModalOpen(true)}
            className="bg-[#00F474] text-base text-[#1D1F2C] font-semibold p-2 rounded-lg
                                 cursor-pointer flex items-center gap-1 hover:bg-[#00F474]/90 transition active:scale-95"
          >
            <PlusIcon />
            Add promo code
          </button>
        </div>

        {renderPromoCodeCards()}
      </div>

      {/* Create Plan Modal */}
      <CustomModal
        isOpen={planModalOpen}
        onClose={() => {
          setPlanModalOpen(false);
          setPlanName("");
          setPlanTitle("");
          setPlanAmount("");
          setPlanDescription("");
          setDuration("");
        }}
        title="Create New Subscription Plan"
        subTitle="Add a new subscription plan for your users."
      >
        <div className="mt-6 mb-8 space-y-5">
          <div className="flex items-center gap-5">
            <div className="flex-1">
              <label
                htmlFor="plan-name"
                className="text-white text-sm font-medium"
              >
                Plan Name*
              </label>
              <input
                type="text"
                id="plan-name"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="VIP Membership"
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="plan-title"
                className="text-white text-sm font-medium"
              >
                Plan Title*
              </label>
              <input
                type="text"
                id="plan-title"
                value={planTitle}
                onChange={(e) => setPlanTitle(e.target.value)}
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="Premium Access"
                disabled={loading}
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex-1">
              <label
                htmlFor="plan-amount"
                className="text-white text-sm font-medium"
              >
                Amount ($)*
              </label>
              <input
                type="number"
                id="plan-amount"
                value={planAmount}
                onChange={(e) => setPlanAmount(e.target.value)}
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="99"
                min="1"
                disabled={loading}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="plan-duration"
                className="text-white text-sm font-medium"
              >
                Duration*
              </label>
              <div className="mt-2">
                <CustomDropdown
                  value={duration}
                  onChange={setDuration}
                  options={durationOptions}
                  className="w-full"
                  placeholder="Select duration"
                  // disabled={loading}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="description"
              className="text-white text-sm font-medium"
            >
              Description* (Features separated by comma)
            </label>
            <textarea
              name="description"
              id="description"
              value={planDescription}
              onChange={(e) => setPlanDescription(e.target.value)}
              className="w-full p-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 h-[112px] bg-[#0E121B] resize-none focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
              placeholder="AI-based spending analysis, Personalized savings suggestions, Weekly expense reports, Basic budget setup and tracking"
              disabled={loading}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mb-6">
          <button
            className="text-base text-[#99A0AE] font-semibold px-5 py-3 bg-[#181B25] rounded-lg cursor-pointer hover:bg-[#181B25]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setPlanModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="text-base text-[#1D1F2C] font-semibold px-5 py-3 bg-[#00f474] rounded-lg cursor-pointer hover:bg-[#00F474]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleCreatePlan}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              "Create Plan"
            )}
          </button>
        </div>
      </CustomModal>

      {/* Create Promo Code Modal */}
      <CustomModal
        isOpen={codeModalOpen}
        onClose={() => {
          setCodeModalOpen(false);
          setPromoCode("");
          setPromoDiscount("");
          setPromoMaxUses("");
          setPromoExpiryDate("");
        }}
        title="Create Promo Code"
        subTitle="Create a new promotional code for subscribers"
      >
        <div className="mt-6 mb-8 space-y-5">
          <div>
            <label
              htmlFor="code-name"
              className="text-white text-sm font-medium"
            >
              Promo Code*
            </label>
            <input
              type="text"
              id="code-name"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
              placeholder="SUMMER2024"
              disabled={creatingPromoCode}
            />
          </div>

          <div className="flex items-center gap-5">
            <div className="flex-1">
              <label
                htmlFor="discount"
                className="text-white text-sm font-medium"
              >
                Discount (%)*
              </label>
              <input
                type="number"
                id="discount"
                value={promoDiscount}
                onChange={(e) => setPromoDiscount(e.target.value)}
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="20"
                min="1"
                max="100"
                disabled={creatingPromoCode}
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="max-usage"
                className="text-white text-sm font-medium"
              >
                Max Usage*
              </label>
              <input
                type="number"
                id="max-usage"
                value={promoMaxUses}
                onChange={(e) => setPromoMaxUses(e.target.value)}
                className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] placeholder:font-medium mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
                placeholder="1000"
                min="1"
                disabled={creatingPromoCode}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="expiry-date"
              className="text-white text-sm font-medium"
            >
              Expiry Date (Optional)
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] mt-2 bg-[#0E121B] text-left flex items-center gap-2 hover:border-[#00f474] transition-colors"
                  disabled={creatingPromoCode}
                >
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  {promoExpiryDate ? (
                    <span>{format(new Date(promoExpiryDate), "PPP")}</span>
                  ) : (
                    <span className="text-gray-500">Pick an expiry date</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#1A1F2E] border-[#323B49] z-999">
                <Calendar
                  mode="single"
                  selected={
                    promoExpiryDate ? new Date(promoExpiryDate) : undefined
                  }
                  onSelect={(date) => {
                    if (date) {
                      setPromoExpiryDate(format(date, "yyyy-MM-dd"));
                    }
                  }}
                  className="bg-[#1A1F2E] text-white"
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 mb-6">
          <button
            className="text-base text-[#99A0AE] font-semibold px-5 py-3 bg-[#181B25] rounded-lg cursor-pointer hover:bg-[#181B25]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setCodeModalOpen(false)}
            disabled={creatingPromoCode}
          >
            Cancel
          </button>
          <button
            className="text-base text-[#1D1F2C] font-semibold px-5 py-3 bg-[#00f474] rounded-lg cursor-pointer hover:bg-[#00F474]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            onClick={handleCreatePromoCode}
            disabled={creatingPromoCode}
          >
            {creatingPromoCode ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              "Create Promo Code"
            )}
          </button>
        </div>
      </CustomModal>

      {/* Edit Plan Modal */}
      <CustomModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Subscription Plan"
        subTitle="Update plan details"
      >
        <div className="mt-6 mb-8 space-y-5">
          <div>
            <label
              htmlFor="edit-plan-name"
              className="text-white text-sm font-medium"
            >
              Plan Name*
            </label>
            <input
              type="text"
              id="edit-plan-name"
              value={editPlanName}
              onChange={(e) => setEditPlanName(e.target.value)}
              className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="edit-plan-price"
              className="text-white text-sm font-medium"
            >
              Price ($)*
            </label>
            <input
              type="number"
              id="edit-plan-price"
              value={editPlanPrice}
              readOnly
              className="w-full px-3 py-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] mt-2 bg-[#0E121B] focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50 cursor-not-allowed opacity-60"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="edit-plan-period"
              className="text-white text-sm font-medium"
            >
              Billing Period*
            </label>
            <div className="mt-2 opacity-60 pointer-events-none">
              <CustomDropdown
                value={editPlanPeriod}
                onChange={setEditPlanPeriod}
                options={durationOptions}
                className="w-full"
                placeholder="Select duration"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="edit-plan-features"
              className="text-white text-sm font-medium"
            >
              Features (comma separated)
            </label>
            <textarea
              id="edit-plan-features"
              value={editPlanFeatures}
              onChange={(e) => setEditPlanFeatures(e.target.value)}
              className="w-full p-3 text-white rounded-lg border border-[#2B303B] placeholder:text-sm placeholder:text-[#717784] mt-2 h-[112px] bg-[#0E121B] resize-none focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50"
              disabled={loading}
            />
          </div>
        </div>
        <div className="flex items-center justify-end gap-4 mb-6">
          <button
            className="text-base text-[#99A0AE] font-semibold px-5 py-3 bg-[#181B25] rounded-lg cursor-pointer"
            onClick={() => setEditModalOpen(false)}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="text-base text-[#1D1F2C] font-semibold px-5 py-3 bg-[#00f474] rounded-lg cursor-pointer hover:bg-[#00F474]/90 flex items-center gap-2"
            onClick={handleUpdatePlan}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>{" "}
                Updating...
              </>
            ) : (
              "Update Plan"
            )}
          </button>
        </div>
      </CustomModal>
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteTarget?.type === "plan" ? "Plan" : "Promo Code"}`}
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
      />
    </div>
  );
}
