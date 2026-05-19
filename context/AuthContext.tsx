"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import authApi, {
  LoginRequest,
  LoginResponse,
  UserData,
} from "@/services/authApi";
import toast from "react-hot-toast";

interface AuthContextType {
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  user: UserData | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authenticated = await authApi.isAuthenticated();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          // Try to get profile for user data
          try {
            const { dashboardApi } = await import("@/services/dashboardApi");
            const profile = await dashboardApi.getProfile();
            if (profile.status) {
              setUser(profile.data as any);
            }
          } catch {
            // Profile fetch failed, but user is still authenticated
          }
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);

      if (response.status) {
        setIsAuthenticated(true);
        setUser(response.data.user);
        if (response.data.access_token) {
          localStorage.setItem("access_token", response.data.access_token);
        }
        toast.success("Login successful!");
      }

      return response;
    } catch (error: any) {
      toast.error(error.message || "Login failed");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi.logout();
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("access_token");
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      // Even if logout API fails, clear local state
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("access_token");
      router.push("/");
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    isLoading,
    login,
    logout,
    isAuthenticated,
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
