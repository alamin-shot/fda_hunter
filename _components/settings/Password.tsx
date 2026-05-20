"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { dashboardApi } from "@/services/dashboardApi";

export default function Password() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });

  const handleUpdate = async () => {
    if (
      !form.current_password ||
      !form.new_password ||
      !form.new_password_confirmation
    ) {
      toast.error("All fields are required");
      return;
    }
    if (form.new_password !== form.new_password_confirmation) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const response = await dashboardApi.changePassword({
        current_password: form.current_password,
        password: form.new_password,
        password_confirmation: form.new_password_confirmation,
      });
      if (response.status) {
        toast.success("Password updated successfully!");
        setForm({
          current_password: "",
          new_password: "",
          new_password_confirmation: "",
        });
      } else {
        toast.error(response.message || "Failed to update password");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0E121B] p-6 rounded-[24px]">
      <h2 className="text-2xl text-white font-semibold">Change Password</h2>
      <div className="my-8 space-y-6">
        {["current_password", "new_password", "new_password_confirmation"].map(
          (field, i) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="text-white text-base font-semibold"
              >
                {i === 0
                  ? "Old Password"
                  : i === 1
                    ? "New Password"
                    : "Confirm Password"}{" "}
                <span className="text-[#E03137]">*</span>
              </label>
              <input
                type="password"
                id={field}
                value={form[field as keyof typeof form]}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="py-4.5 px-5 border border-[#2B303B] rounded-[10px] w-full mt-2 text-white"
                placeholder={`Enter your ${i === 0 ? "Old" : i === 1 ? "New" : "Confirm"} Password`}
              />
            </div>
          ),
        )}
      </div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="text-base text-[#183F6D] font-semibold bg-[#00F474] py-3.5 px-4 rounded-lg cursor-pointer hover:bg-[#00F474]/90 transition-all disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
        <button
          onClick={() =>
            setForm({
              current_password: "",
              new_password: "",
              new_password_confirmation: "",
            })
          }
          className="text-base text-[#65686C] border border-[#323B49] font-semibold py-3.5 px-4 rounded-lg cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
