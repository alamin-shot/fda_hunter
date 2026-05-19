// components/LogoutConfirmation.tsx
"use client";

import React from "react";
 
import { AlertTriangle } from "lucide-react";
import CustomModal from "./reusable/CustomModal";

interface LogoutConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const LogoutConfirmation: React.FC<LogoutConfirmationProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm 
}) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Logout"
      subTitle="Are you sure you want to logout?"
      showCloseButton={true}
    >
      <div className="py-6">
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="p-4 rounded-full bg-red-500/20 mb-4">
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
          <p className="text-gray-300 text-center mb-2">
            You will be logged out of your account
          </p>
          <p className="text-gray-400 text-sm text-center">
            You will need to login again to access your account
          </p>
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-600 hover:bg-gray-800 text-white font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
          >
            Confirm Logout
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default LogoutConfirmation;
