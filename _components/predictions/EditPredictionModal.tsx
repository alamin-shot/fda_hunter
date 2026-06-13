import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  dashboardApi,
  Prediction,
  UpdatePredictionRequest,
} from "@/services/dashboardApi";
import CustomModal from "../reusable/CustomModal";
import CategoryDropdown from "../reusable/CategoryDropdown";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface EditPredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: Prediction | null;
  onSuccess: () => void;
}

const EditPredictionModal: React.FC<EditPredictionModalProps> = ({
  isOpen,
  onClose,
  prediction,
  onSuccess,
}) => {
  const [title, setTitle] = useState("");
  const [signal, setSignal] = useState("");
  const [confidenceLevel, setConfidenceLevel] = useState("");
  const [reason, setReason] = useState("");
  const [detailedSummary, setDetailedSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");

  useEffect(() => {
    if (prediction) {
      setTitle(prediction.title || "");
      setSignal(prediction.signal || "");
      setConfidenceLevel(prediction.confidence_level?.toString() || "");
      setReason(prediction.reason || "");
      setDetailedSummary(prediction.detailed_summary || "");
      setCategoryId(String(prediction.category?.id || ""));
      setScheduledAt(prediction.scheduled_at || "");
      setError(null);
    } else {
      setTitle("");
      setSignal("");
      setConfidenceLevel("");
      setReason("");
      setDetailedSummary("");
      setCategoryId("");
      setScheduledAt("");
      setError(null);
    }
  }, [prediction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prediction) {
      toast.error("No prediction selected", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      return;
    }

    if (!title.trim()) {
      toast.error("Title is required", {
        duration: 4000,
        position: "top-center",
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #E93544",
        },
      });
      return;
    }

    setLoading(true);
    setError(null);

    const loadingToastId = toast.loading("Updating prediction...", {
      position: "top-center",
      style: {
        background: "#1A1F2E",
        color: "#fff",
      },
    });

    try {
      const updateData: UpdatePredictionRequest = {
        category_id: Number(categoryId),
        title: title.trim(),
        scheduled_at: scheduledAt
          ? format(new Date(scheduledAt), "yyyy-MM-dd HH:mm:ss")
          : "",
        signal: signal.trim() || undefined,
        reason: reason.trim() || undefined,
        detailed_summary: detailedSummary.trim() || undefined,
      };

      if (confidenceLevel) {
        updateData.confidence_level = Number(confidenceLevel);
      }

      const response = await dashboardApi.updatePrediction(
        prediction.id,
        updateData,
      );

      toast.dismiss(loadingToastId);

      if (response.status) {
        toast.success("Prediction updated successfully!", {
          duration: 4000,
          position: "top-center",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #00F474",
          },
          icon: "✅",
        });

        onSuccess();
        onClose();
      } else {
        toast.error(response.message || "Failed to update prediction", {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #E93544",
          },
        });
        setError(response.message || "Failed to update prediction");
      }
    } catch (err: any) {
      console.error("Error updating prediction:", err);
      toast.dismiss(loadingToastId);
      toast.error(
        err.message || "Failed to update prediction. Please try again.",
        {
          duration: 5000,
          position: "top-center",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #E93544",
          },
        },
      );
      setError(err.message || "Failed to update prediction");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (
      title !== prediction?.title ||
      signal !== prediction?.signal ||
      confidenceLevel !== prediction?.confidence_level?.toString() ||
      reason !== prediction?.reason ||
      detailedSummary !== prediction?.detailed_summary ||
      categoryId !== String(prediction?.category?.id || "") ||
      scheduledAt !== prediction?.scheduled_at
    ) {
      toast(
        (t) => (
          <div className="flex flex-col gap-3">
            <p className="text-white font-medium">Unsaved Changes</p>
            <p className="text-gray-300 text-sm">
              You have unsaved changes. Are you sure you want to cancel?
            </p>
            <div className="flex gap-2 justify-end mt-2">
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  onClose();
                }}
                className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
              >
                Discard
              </button>
              <button
                onClick={() => toast.dismiss(t.id)}
                className="px-3 py-1.5 text-sm bg-[#00F474]/20 text-[#00F474] hover:bg-[#00F474]/30 rounded transition-colors"
              >
                Continue Editing
              </button>
            </div>
          </div>
        ),
        {
          duration: 10000,
          position: "top-right",
          style: {
            background: "#1A1F2E",
            color: "#fff",
            border: "1px solid #323B49",
            minWidth: "300px",
          },
        },
      );
    } else {
      onClose();
    }
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Prediction"
      subTitle="Update prediction details"
      showCloseButton={true}
    >
      <form onSubmit={handleSubmit} className="py-4">
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50 transition-colors"
            placeholder="Enter prediction title..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Category
          </label>
          <CategoryDropdown
            useId={true}
            value={categoryId}
            onChange={setCategoryId}
            placeholder="Select category"
            className="w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Scheduled At *
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm text-left flex items-center gap-2 hover:border-[#00f474] transition-colors"
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
            <PopoverContent className="w-auto p-0 bg-[#1A1F2E] border-[#323B49] z-[9999]">
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
                    setScheduledAt(date.toISOString());
                  }}
                  className="w-full bg-transparent text-white text-center outline-none [color-scheme:dark]"
                  style={{ colorScheme: "dark" }}
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
                disabled={(date) =>
                  date < new Date(new Date().setHours(0, 0, 0, 0))
                }
                className="bg-[#1A1F2E] text-white"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Signal
          </label>
          <input
            type="text"
            value={signal}
            onChange={(e) => {
              setSignal(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50 transition-colors"
            placeholder="e.g., BUY, SELL, HOLD..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Confidence Level (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={confidenceLevel}
            onChange={(e) => {
              setConfidenceLevel(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50 transition-colors"
            placeholder="0-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Reason
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50 transition-colors"
            rows={3}
            placeholder="Why did you make this prediction..."
          />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">
            Detailed Summary
          </label>
          <textarea
            value={detailedSummary}
            onChange={(e) => {
              setDetailedSummary(e.target.value);
              if (error) setError(null);
            }}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white text-sm focus:outline-none focus:border-[#00F474] focus:ring-1 focus:ring-[#00F474]/50 transition-colors"
            rows={3}
            placeholder="Provide a detailed analysis..."
          />
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#323B49]">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2.5 border border-[#323B49] text-white rounded-lg hover:bg-[#1A1F2E] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#00F474] text-[#1D1F2C] font-semibold rounded-lg hover:bg-[#00F474]/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-[#1D1F2C] border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              "Update Prediction"
            )}
          </button>
        </div>
      </form>
    </CustomModal>
  );
};

export default EditPredictionModal;
