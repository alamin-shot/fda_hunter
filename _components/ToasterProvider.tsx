"use client";

import { Toaster } from "react-hot-toast";

const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Default options
        className: "",
        duration: 3000,
        style: {
          background: "#1f2937",
          color: "#fff",
          border: "1px solid #374151",
          borderRadius: "0.5rem",
        },

        // Success toast
        success: {
          duration: 3000,
          style: {
            background: "#065f46",
            color: "#fff",
            border: "1px solid #047857",
          },
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff",
          },
        },

        // Error toast
        error: {
          duration: 4000,
          style: {
            background: "#7f1d1d",
            color: "#fff",
            border: "1px solid #991b1b",
          },
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff",
          },
        },

        // Loading toast
        loading: {
          duration: Infinity,
          style: {
            background: "#1f2937",
            color: "#fff",
          },
        },
      }}
    />
  );
};

export default ToastProvider;
