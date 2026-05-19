import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  dashboardApi,
  Prediction,
  UpdatePredictionRequest,
} from "@/services/dashboardApi";
import CustomModal from "../reusable/CustomModal";

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

  useEffect(() => {
    if (prediction) {
      setTitle(prediction.title || "");
      setSignal(prediction.signal || "");
      setConfidenceLevel(prediction.confidence_level?.toString() || "");
      setReason(prediction.reason || "");
      setDetailedSummary(prediction.detailed_summary || "");
      setError(null);
    } else {
      setTitle("");
      setSignal("");
      setConfidenceLevel("");
      setReason("");
      setDetailedSummary("");
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
        category_id: prediction.category.id,
        title: title.trim(),
        scheduled_at: prediction.scheduled_at,
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
      detailedSummary !== prediction?.detailed_summary
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
          <label className="block text-white text-sm font-medium mb-2">Category ID</label>
          <input type="number" value={prediction?.category?.id || ""} disabled
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-gray-400 text-sm" />
        </div>

        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2">Scheduled At</label>
          <input type="datetime-local" value={prediction?.scheduled_at?.slice(0, 16) || ""} disabled
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-gray-400 text-sm" />
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
