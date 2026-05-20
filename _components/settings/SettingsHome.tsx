"use client";

import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { dashboardApi } from "@/services/dashboardApi";

export default function SettingsHome() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await dashboardApi.getProfile();
        if (response.status) {
          setFormData({
            first_name: response.data.first_name || "",
            last_name: response.data.last_name || "",
            email: response.data.email || "",
          });
          if (response.data.avatar) {
            setImagePreview(response.data.avatar);
          }
        }
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("_method", "PUT");
      fd.append("first_name", formData.first_name);
      fd.append("last_name", formData.last_name);
      if (profileImage) {
        fd.append("avatar", profileImage);
      }

      
      const response = await dashboardApi.updateProfile(fd);
      if (response.status) {
        // Re-fetch profile to get updated avatar URL
        const profileResponse = await dashboardApi.getProfile();
        if (profileResponse.status && profileResponse.data.avatar) {
          setImagePreview(profileResponse.data.avatar);
        }
        setProfileImage(null);
        toast.success("Profile saved successfully!");
      } else {
        toast.error(response.message || "Failed to save profile");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only JPEG and PNG files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }
    setProfileImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  if (fetching) {
    return (
      <div className="bg-[#0E121B] p-6 rounded-[24px] flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#0E121B] p-6 rounded-[24px]">
      <h2 className="text-white text-2xl font-semibold">My Profile</h2>

      <div className="flex items-center gap-4 mt-4.5">
        <div className="h-10 w-10 rounded-full bg-[#181a25] overflow-hidden">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="profile-preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center" />
          )}
        </div>
        <div>
          <h3 className="text-white text-sm font-bold">Profile Photo</h3>
          <p className="text-xs text-[#A5A5AB]">
            Min 400x400px, PNG or JPEG formats.
          </p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/jpeg,image/png"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="text-white text-sm font-medium py-1.5 px-4 border border-[#2B303B] rounded-lg cursor-pointer hover:bg-white/10 transition-colors"
        >
          {profileImage ? "Change" : "Upload"}
        </button>
        {profileImage && (
          <button
            onClick={() => {
              setProfileImage(null);
              setImagePreview(null);
            }}
            className="text-red-400 text-sm font-medium py-1.5 px-4 border border-red-500/50 rounded-lg cursor-pointer hover:bg-red-500/10 transition-colors"
          >
            Remove
          </button>
        )}
      </div>

      <div className="mt-6 p-4 border border-[#323B49] rounded-lg">
        <h3 className="text-lg text-white font-medium">Personal Information</h3>
        <p className="text-xs text-[#777980] mt-1">
          Modify Your Personal Information
        </p>

        <div className="flex items-center gap-5 mt-4">
          <div className="flex flex-col gap-2 flex-1 relative">
            <label htmlFor="first-name" className="text-sm text-white">
              First Name
            </label>
            <input
              type="text"
              id="first-name"
              value={formData.first_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, first_name: e.target.value }))
              }
              className="py-2.5 px-3 border border-[#2B303B] rounded-lg text-white bg-transparent"
              placeholder="first name"
            />
          </div>
          <div className="flex flex-col gap-2 flex-1 relative">
            <label htmlFor="last-name" className="text-sm text-white">
              Last Name
            </label>
            <input
              type="text"
              id="last-name"
              value={formData.last_name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, last_name: e.target.value }))
              }
              className="py-2.5 px-3 border border-[#2B303B] rounded-lg text-white bg-transparent"
              placeholder="last name"
            />
          </div>
        </div>

        <div className="flex items-center gap-5 mt-4">
          <div className="flex flex-col gap-2 flex-1 relative">
            <label htmlFor="email" className="text-sm text-white">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              disabled
              className="py-2.5 px-3 border border-[#2B303B] rounded-lg text-gray-400 bg-transparent cursor-not-allowed"
            />
          </div>
          <div className="flex-1" />
        </div>

        <div className="flex justify-start gap-3 mt-8">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2.5 bg-[#00F474] text-[#0E121B] rounded-lg text-sm font-medium hover:bg-[#00F474]/90 transition-colors active:scale-95 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 border border-[#323B49] rounded-lg text-white text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
