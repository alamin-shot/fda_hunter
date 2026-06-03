"use client";

import { useState, useRef, useEffect } from "react";
import { dashboardApi } from "@/services/dashboardApi";
import toast from "react-hot-toast";
import { Trash2, Plus } from "lucide-react";

interface CategoryOption {
  value: string;
  label: string;
  id: number;
}

interface CategoryDropdownProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  useId?: boolean;
}

export default function CategoryDropdown({
  value,
  onChange,
  placeholder = "Select categories",
  className = "",
  useId = false,
}: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryIcon, setNewCategoryIcon] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    try {
      const response = await dashboardApi.getCategories();
      if (response.status) {
        setCategories(
          response.data
            .filter((c) => c && c.name) // Filter out null/undefined
            .map((c) => ({
              value: useId ? String(c.id) : c.name,
              label: c.name,
              id: c.id,
            })),
        );
      }
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setShowAdd(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showAdd && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showAdd]);

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();

    toast(
      (t) => (
        <div className="flex flex-col gap-3">
          <p className="text-white font-medium">Delete this category?</p>
          <div className="flex gap-2 justify-end">
            <button
              onClick={async () => {
                toast.dismiss(t.id);
                try {
                  const response = await dashboardApi.deleteCategory(id);
                  if (response.status) {
                    toast.success("Category deleted");
                    fetchCategories();
                    if (categories.find((c) => c.id === id)?.value === value) {
                      onChange("");
                    }
                  }
                } catch (error: any) {
                  toast.error(
                    error.response?.data?.message || "Failed to delete",
                  );
                }
              }}
              className="px-3 py-1.5 text-sm bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded"
            >
              Delete
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="px-3 py-1.5 text-sm bg-[#00F474]/20 text-[#00F474] hover:bg-[#00F474]/30 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        duration: 10000,
        style: {
          background: "#1A1F2E",
          color: "#fff",
          border: "1px solid #323B49",
        },
      },
    );
  };

  const handleAdd = async () => {
    if (!newCategoryName.trim()) return;
    setLoading(true);
    try {
      const response = await dashboardApi.createCategory({
        name: newCategoryName.trim(),
        icon: newCategoryIcon.trim() || undefined,
      });
      if (response.status) {
        toast.success("Category added");
        setNewCategoryName("");
        setNewCategoryIcon("");
        setShowAdd(false);
        fetchCategories();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  const selectedOption = categories.find((c) => c && c.value === value);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        className="w-full px-4 py-3.5 text-left border border-[#687588] rounded-lg bg-transparent hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-[#00f474] transition-all duration-200"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex justify-between items-center">
          <span className="text-white text-sm">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full bg-[#0e121b] border border-white/10 rounded-lg shadow-lg mt-1 overflow-hidden"
        >
          <div className="max-h-[250px] overflow-y-auto">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center justify-between px-4 py-3 hover:bg-white/10 cursor-pointer ${cat.value === value ? "bg-white/20 text-white font-medium" : "text-white/90"}`}
                onClick={() => {
                  onChange(cat.value);
                  setIsOpen(false);
                }}
              >
                <span className="text-sm">{cat.label}</span>
                <button
                  onClick={(e) => handleDelete(e, cat.id)}
                  className="p-1 hover:bg-red-500/20 rounded transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10">
            {!showAdd ? (
              <button
                onClick={() => setShowAdd(true)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-[#00F474] hover:bg-white/5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add new category
              </button>
            ) : (
              <div className="p-2 grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]">
                <input
                  ref={inputRef}
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                    if (e.key === "Escape") setShowAdd(false);
                  }}
                  className="w-full px-3 py-2 text-sm bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white outline-none focus:border-[#00F474]"
                  placeholder="Category name"
                />
                <input
                  type="text"
                  value={newCategoryIcon}
                  onChange={(e) => setNewCategoryIcon(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAdd();
                    if (e.key === "Escape") setShowAdd(false);
                  }}
                  className="w-full px-3 py-2 text-sm bg-[#1A1F2E] border border-[#323B49] rounded-lg text-white outline-none focus:border-[#00F474]"
                  placeholder="Icon (app only)"
                />
                <button
                  onClick={handleAdd}
                  disabled={loading || !newCategoryName.trim()}
                  className="px-3 py-2 bg-[#00F474] text-[#1D1F2C] text-sm font-semibold rounded-lg hover:bg-[#00F474]/90 disabled:opacity-50"
                >
                  {loading ? "..." : "Add"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
