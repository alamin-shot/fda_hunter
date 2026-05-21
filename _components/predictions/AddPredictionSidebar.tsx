"use client";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CrossIcon from "../icons/predictions/CrossIcon";
import CustomDropdown from "../reusable/CustomDropdown";
import { dashboardApi } from "@/services/dashboardApi";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface AddPredictionSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
}

const AddPredictionSidebar: React.FC<AddPredictionSidebarProps> = ({
  isOpen = false,
  onClose,
  onSuccess,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [title, setTitle] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [signal, setSignal] = useState("");
  const [reason, setReason] = useState("");
  const [detailedSummary, setDetailedSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categoriesOption = [
    { value: "1", label: "Sports" },
    { value: "2", label: "Casino" },
    { value: "3", label: "Stocks" },
    { value: "4", label: "Crypto" },
  ];

  useEffect(() => {
    if (isOpen && !isVisible) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else if (!isOpen && isVisible) {
      setIsAnimating(false);
      setTimeout(() => setIsVisible(false), 300);
    }
  }, [isOpen, isVisible]);

  const resetForm = () => {
    setCategoryId("");
    setTitle("");
    setScheduledAt("");
    setConfidenceLevel("");
    setSignal("");
    setReason("");
    setDetailedSummary("");
    setLoading(false);
    setError(null);
  };

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
      resetForm();
      onClose?.();
    }, 300);
  };

  const handleCreatePrediction = async () => {
    if (!categoryId) {
      toast.error("Category is required");
      return;
    }
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!scheduledAt) {
      toast.error("Scheduled date is required");
      return;
    }
    if (
      !confidenceLevel ||
      Number(confidenceLevel) < 0 ||
      Number(confidenceLevel) > 100
    ) {
      toast.error("Confidence level (0-100) is required");
      return;
    }
    if (!signal) {
      toast.error("Signal is required");
      return;
    }
    if (!reason.trim()) {
      toast.error("Reason is required");
      return;
    }
    if (!detailedSummary.trim()) {
      toast.error("Detailed summary is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await dashboardApi.createPrediction({
        category_id: Number(categoryId),
        title: title.trim(),
        scheduled_at: scheduledAt
          ? format(new Date(scheduledAt), "yyyy-MM-dd HH:mm:ss")
          : "",
        confidence_level: Number(confidenceLevel),
        signal: signal,
        reason: reason.trim(),
        detailed_summary: detailedSummary.trim(),
      });

      if (response.status) {
        toast.success("Prediction created successfully!");
        onSuccess?.();
        handleClose();
      } else {
        toast.error(response.message || "Failed to create prediction");
        setError(response.message || "Failed to create prediction");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to create prediction";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-20 transition-opacity duration-300 ease-in-out ${isAnimating ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />
      <div
        className={`fixed right-3 top-5 bottom-5 h-[calc(100%-2.5rem)] w-full max-w-[80%] md:max-w-[35%] bg-[#0E121B] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out rounded-lg overflow-hidden flex flex-col ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center py-3 px-6 bg-[#181B25]">
          <h2 className="text-lg text-white font-sans font-medium">
            Add New Prediction
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-black rounded-lg cursor-pointer"
            disabled={loading}
          >
            <CrossIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="text-white text-sm font-medium">Category *</label>
            <CustomDropdown
              options={categoriesOption}
              value={categoryId}
              onChange={setCategoryId}
              placeholder="Select category"
              className="w-full mt-2"
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Title *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 border border-[#2B303B] rounded-lg p-2 bg-[#0E121B] text-white focus:ring-1 focus:border-[#00f474] focus:outline-none"
              placeholder="e.g. Lakers vs Celtics"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">
              Scheduled Date *
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="w-full mt-2 border border-[#2B303B] rounded-lg p-2 bg-[#0E121B] text-white text-left flex items-center gap-2 hover:border-[#00f474] transition-colors"
                  disabled={loading}
                >
                  <CalendarIcon className="w-4 h-4 text-gray-400" />
                  {scheduledAt ? (
                    <span>{format(new Date(scheduledAt), "PPP p")}</span>
                  ) : (
                    <span className="text-gray-500">Pick a date & time</span>
                  )}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-[#1A1F2E] border-[#323B49]">
                <div className="p-3 border-b border-[#323B49]">
                  <input
                    type="time"
                    value={
                      scheduledAt ? format(new Date(scheduledAt), "HH:mm") : ""
                    }
                    onChange={(e) => {
                      const date = scheduledAt
                        ? new Date(scheduledAt)
                        : new Date();
                      const [hours, minutes] = e.target.value.split(":");
                      date.setHours(Number(hours), Number(minutes));
                      setScheduledAt(date.toISOString().slice(0, 16));
                    }}
                    className="w-full bg-transparent text-white text-center outline-none"
                  />
                </div>
                <Calendar
                  mode="single"
                  selected={scheduledAt ? new Date(scheduledAt) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const current = scheduledAt
                        ? new Date(scheduledAt)
                        : new Date();
                      date.setHours(current.getHours(), current.getMinutes());
                      setScheduledAt(date.toISOString().slice(0, 16));
                    }
                  }}
                  className="bg-[#1A1F2E] text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <label className="text-white text-sm font-medium">
              Confidence Level (%) *
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(e.target.value)}
              className="w-full mt-2 border border-[#2B303B] rounded-lg p-2 bg-[#0E121B] text-white focus:ring-1 focus:border-[#00f474] focus:outline-none"
              placeholder="0-100"
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Signal *</label>
            <input
              type="text"
              value={signal}
              onChange={(e) => setSignal(e.target.value)}
              className="w-full mt-2 border border-[#2B303B] rounded-lg p-2 bg-[#0E121B] text-white focus:ring-1 focus:border-[#00f474] focus:outline-none"
              placeholder="e.g. Home Win, Over, etc."
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">Reason *</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full mt-2 border border-[#2B303B] h-24 rounded-lg p-2 bg-[#0E121B] text-white resize-none focus:ring-1 focus:border-[#00f474] focus:outline-none"
              placeholder="Brief reason for this prediction..."
              rows={3}
              disabled={loading}
            />
          </div>

          <div>
            <label className="text-white text-sm font-medium">
              Detailed Summary *
            </label>
            <textarea
              value={detailedSummary}
              onChange={(e) => setDetailedSummary(e.target.value)}
              className="w-full mt-2 border border-[#2B303B] h-32 rounded-lg p-2 bg-[#0E121B] text-white resize-none focus:ring-1 focus:border-[#00f474] focus:outline-none"
              placeholder="Detailed analysis..."
              rows={5}
              disabled={loading}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 p-6 border-t border-[#1A1F2E]">
          <button
            onClick={handleClose}
            className="py-3 bg-[#181B25] rounded-lg text-base text-[#99A0AE] font-semibold w-full cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreatePrediction}
            className="py-3 bg-[#00F474] rounded-lg text-base text-[#1D1F2C] font-semibold w-full cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>{" "}
                Creating...
              </>
            ) : (
              "Create Prediction"
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default AddPredictionSidebar;
