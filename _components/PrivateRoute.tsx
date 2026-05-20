"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirectTo = "/",
}) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#0e121b]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-transparent border-green-500 mb-4"></div>
          <p className="text-gray-300 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <PrivateRoute>{children}</PrivateRoute>;
};

export default PrivateRoute;
