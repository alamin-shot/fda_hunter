import axiosClient from "@/lib/axiosClient";

// ============ TYPES ============
export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  date_of_birth?: string | null;
  location?: string | null;
  gender?: string | null;
  is_premium?: boolean;
  onboarding_completed?: boolean;
  subscription?: {
    type: string;
    trial_ends_at: string | null;
    ends_at: string | null;
  };
  created_at?: string;
}

export interface LoginResponse {
  status: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: UserData;
  };
}

export interface LogoutResponse {
  status: boolean;
  message: string;
  data: null;
}

export interface RefreshResponse {
  status: boolean;
  message: string;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
  };
}

// ============ AUTH API ============
const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosClient.post<LoginResponse>(
        "/admin/login",
        credentials,
      );
      return response.data;
    } catch (error: any) {
      let errorMessage = "Login failed. Please try again.";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        // Laravel validation errors
        const errors = error.response.data.errors;
        errorMessage = Object.values(errors).flat().join(", ");
      }

      throw {
        status: false,
        message: errorMessage,
        data: null,
      } as any;
    }
  },

  logout: async (): Promise<LogoutResponse> => {
    try {
      const response = await axiosClient.post<LogoutResponse>("/admin/logout");
      return response.data;
    } catch (error: any) {
      throw {
        status: false,
        message: error.response?.data?.message || "Logout failed",
        data: null,
      } as any;
    }
  },

  refreshToken: async (): Promise<RefreshResponse> => {
    try {
      const response =
        await axiosClient.post<RefreshResponse>("/admin/refresh");
      return response.data;
    } catch (error: any) {
      throw {
        status: false,
        message: "Token refresh failed",
        data: null,
      } as any;
    }
  },

  isAuthenticated: async (): Promise<boolean> => {
    try {
      await axiosClient.get("/admin/users/overview");
      return true;
    } catch {
      return false;
    }
  },
};

export default authApi;
