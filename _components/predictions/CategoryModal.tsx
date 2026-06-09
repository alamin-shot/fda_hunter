"use client";

import { useState, useRef, useEffect } from "react";
import { X, Upload, Image as ImageIcon } from "lucide-react";
import toast from "react-hot-toast";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CategoryModal({
  isOpen,
  onClose,
  onSuccess,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const iconInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setIconFile(null);
    setImageFile(null);
    if (iconPreview) URL.revokeObjectURL(iconPreview);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setIconPreview("");
    setImagePreview("");
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "icon" | "image",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size should be less than 5MB");
      return;
    }

    const preview = URL.createObjectURL(file);
    if (type === "icon") {
      setIconFile(file);
      setIconPreview(preview);
    } else {
      setImageFile(file);
      setImagePreview(preview);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    if (description.trim()) formData.append("description", description.trim());
    if (iconFile) formData.append("icon", iconFile);
    if (imageFile) formData.append("image", imageFile);

    try {
      const { dashboardApi } = await import("@/services/dashboardApi");
      const response = await dashboardApi.createCategory(formData);
      if (response.status) {
        toast.success("Category added successfully");
        onSuccess();
        onClose();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#0e121b] border border-white/10 rounded-lg shadow-xl z-50">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-white text-lg font-semibold">Add New Category</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <X className="w-5 h-5 text-white/70" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Category Name */}
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name *"
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white outline-none focus:border-[#00F474]"
          />

          {/* Description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={3}
            className="w-full px-3 py-2 bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white outline-none focus:border-[#00F474] resize-none"
          />

          {/* Icon Upload */}
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Category Icon (SVG)
            </label>
            {!iconPreview ? (
              <button
                type="button"
                onClick={() => iconInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 border border-dashed border-[#323B49] rounded-lg hover:border-[#00F474] hover:bg-white/5 transition-colors"
              >
                <Upload className="w-8 h-8 text-white/50" />
                <span className="text-sm text-white/50">
                  Click to upload icon
                </span>
                <span className="text-xs text-white/30">
                  SVG or image (max 5MB)
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3 p-4 border border-[#323B49] rounded-lg bg-[#1A1F2E]">
                <div className="w-24 h-24 flex items-center justify-center bg-white/5 rounded-lg p-3">
                  <img
                    src={iconPreview}
                    alt="Icon preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => iconInputRef.current?.click()}
                    className="px-3 py-1 text-xs bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => {
                      setIconFile(null);
                      setIconPreview("");
                    }}
                    className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            <input
              ref={iconInputRef}
              type="file"
              accept="image/svg+xml,image/*"
              onChange={(e) => handleFileChange(e, "icon")}
              className="hidden"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm text-white/70 mb-2">
              Category Image (Optional)
            </label>
            {!imagePreview ? (
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 px-4 py-6 border border-dashed border-[#323B49] rounded-lg hover:border-[#00F474] hover:bg-white/5 transition-colors"
              >
                <ImageIcon className="w-8 h-8 text-white/50" />
                <span className="text-sm text-white/50">
                  Click to upload image
                </span>
                <span className="text-xs text-white/30">
                  JPG, PNG, GIF (max 5MB)
                </span>
              </button>
            ) : (
              <div className="flex flex-col items-center gap-3 p-4 border border-[#323B49] rounded-lg bg-[#1A1F2E]">
                <div className="w-full max-w-[200px] h-32 flex items-center justify-center bg-white/5 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Image preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="px-3 py-1 text-xs bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                  >
                    Change
                  </button>
                  <button
                    onClick={() => {
                      setImageFile(null);
                      setImagePreview("");
                    }}
                    className="px-3 py-1 text-xs bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
              className="hidden"
            />
          </div>
        </div>

        <div className="flex gap-3 p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-[#323B49] rounded-lg text-white hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !name.trim()}
            className="flex-1 px-4 py-2 bg-[#00F474] text-[#1D1F2C] font-semibold rounded-lg hover:bg-[#00F474]/90 disabled:opacity-50 transition-colors"
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </div>
      </div>
    </>
  );
}
