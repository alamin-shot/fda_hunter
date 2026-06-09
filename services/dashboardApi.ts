import axiosClient from "@/lib/axiosClient";

// ============ TYPES ============

// Common pagination
export interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  meta?: {
    pagination: PaginationMeta;
  };
}

// Category
export interface Category {
  id: number;
  name: string;
  icon: string | null;
  image: string | null;
  description: string | null;
  win_rate: string | null;
  active_predictions_count?: number;
  is_active?: boolean;
}

export interface DashboardOverview {
  overall_win_rate: number;
  total_subscribers: number;
  active_predictions: number;
  monthly_revenue: number;
}

// Prediction
export interface Prediction {
  id: number;
  category: Category;
  title: string;
  scheduled_at: string;
  confidence_level: number;
  signal: string;
  reason: string;
  detailed_summary: string;
  status: string | null;
  created_at: string;
  win_rate: string | null;
}

export interface PredictionsOverview {
  total_records: number;
  active_predictions: number;
  total_win: number;
  overall_win_rate: number;
}

export interface CreatePredictionRequest {
  category_id: number;
  title: string;
  scheduled_at: string;
  confidence_level: number;
  signal: string;
  reason: string;
  detailed_summary: string;
}

export interface UpdatePredictionRequest {
  category_id?: number;
  title?: string;
  scheduled_at?: string;
  confidence_level?: number;
  signal?: string;
  reason?: string;
  detailed_summary?: string;
}

// Subscription Plan
export interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  billing_period: string;
  billing_every: string | null;
  billing_duration: string | null;
  description: string | null;
  features: string[];
  is_active: boolean;
  stripe_price_id: string | null;
}

export interface SubscriptionOverview {
  total_subscribers: number;
  monthly_revenue: number;
  avg_revenue_per_user: number;
  churn_rate: number;
}

export interface CreatePlanRequest {
  name: string;
  price: string;
  billing_period: string;
  features?: string[];
  description?: string;
  stripe_price_id: string;
}

export interface UpdatePlanRequest {
  name?: string;
  price?: string;
  billing_period?: string;
  features?: string[];
  description?: string;
  is_active?: boolean;
}

// Promo Code
export interface PromoCode {
  id: number;
  code: string;
  discount: string;
  type: "percentage" | "fixed";
  max_users: number;
  used_count: number | null;
  status: "active" | "inactive";
  expires_at: string;
}

export interface CreatePromoCodeRequest {
  code: string;
  discount: string;
  type: "percentage" | "fixed";
  max_users: number;
  expires_at?: string;
}

// User
export interface SubscriptionInfo {
  type: string;
  trial_ends_at: string | null;
  ends_at: string | null;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  registered: string;
  plan: string | null;
  plan_status: string;
  status: string;
  amount: number | null;
  promo_code: string | null;
  created_at: string;
}

export interface UsersOverview {
  total_users: number;
  active_users: number;
  new_today: number;
  promo_code_users: number;
}

// Settings
export interface ProfileData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar: string | null;
  created_at: string;
}

export interface NotificationSetting {
  // Empty array from API — adjust when backend adds fields
  [key: string]: any;
}

// Query params
export interface PredictionsParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  category?: string;
}

export interface UsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  used_promo?: string;
}

// ============ DASHBOARD API ============
export const dashboardApi = {
  // ========== PREDICTIONS ==========

  getDashboardOverview: async (): Promise<ApiResponse<DashboardOverview>> => {
    const response = await axiosClient.get<ApiResponse<DashboardOverview>>(
      "/admin/dashboard/overview",
    );
    return response.data;
  },

  getPredictionsOverview: async (): Promise<
    ApiResponse<PredictionsOverview>
  > => {
    const response = await axiosClient.get<ApiResponse<PredictionsOverview>>(
      "/admin/predictions/overview",
    );
    return response.data;
  },

  getPredictions: async (
    params?: PredictionsParams,
  ): Promise<ApiResponse<Prediction[]>> => {
    const response = await axiosClient.get<ApiResponse<Prediction[]>>(
      "/admin/predictions",
      { params },
    );
    return response.data;
  },

  getPrediction: async (id: number): Promise<ApiResponse<Prediction>> => {
    const response = await axiosClient.get<ApiResponse<Prediction>>(
      `/admin/predictions/${id}`,
    );
    return response.data;
  },

  createPrediction: async (
    data: CreatePredictionRequest,
  ): Promise<ApiResponse<Prediction>> => {
    const response = await axiosClient.post<ApiResponse<Prediction>>(
      "/admin/predictions",
      data,
    );
    return response.data;
  },

  updatePrediction: async (
    id: number,
    data: UpdatePredictionRequest,
  ): Promise<ApiResponse<Prediction>> => {
    const response = await axiosClient.put<ApiResponse<Prediction>>(
      `/admin/predictions/${id}`,
      data,
    );
    return response.data;
  },

  deletePrediction: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(
      `/admin/predictions/${id}`,
    );
    return response.data;
  },

  updatePredictionStatus: async (
    id: number,
    status: string,
  ): Promise<ApiResponse<Prediction>> => {
    const response = await axiosClient.patch<ApiResponse<Prediction>>(
      `/admin/predictions/${id}/status`,
      { status },
    );
    return response.data;
  },

  // ========== SUBSCRIPTIONS ==========

  getSubscriptionOverview: async (): Promise<
    ApiResponse<SubscriptionOverview>
  > => {
    const response = await axiosClient.get<ApiResponse<SubscriptionOverview>>(
      "/admin/subscriptions/overview",
    );
    return response.data;
  },

  getSubscriptionPlans: async (): Promise<ApiResponse<SubscriptionPlan[]>> => {
    const response = await axiosClient.get<ApiResponse<SubscriptionPlan[]>>(
      "/admin/subscriptions/plans",
    );
    return response.data;
  },

  createPlan: async (
    data: CreatePlanRequest,
  ): Promise<ApiResponse<SubscriptionPlan>> => {
    const response = await axiosClient.post<ApiResponse<SubscriptionPlan>>(
      "/admin/subscriptions/plans",
      data,
    );
    return response.data;
  },

  updatePlan: async (
    id: number,
    data: UpdatePlanRequest,
  ): Promise<ApiResponse<SubscriptionPlan>> => {
    const response = await axiosClient.put<ApiResponse<SubscriptionPlan>>(
      `/admin/subscriptions/plans/${id}`,
      data,
    );
    return response.data;
  },
  togglePlanStatus: async (id: number): Promise<ApiResponse<any>> => {
    const response = await axiosClient.patch(
      `/admin/subscriptions/plans/${id}/toggle-status`,
    );
    return response.data;
  },
  deletePlan: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(
      `/admin/subscriptions/plans/${id}`,
    );
    return response.data;
  },

  // ========== PROMO CODES ==========

  getPromoCodes: async (): Promise<ApiResponse<PromoCode[]>> => {
    const response =
      await axiosClient.get<ApiResponse<PromoCode[]>>("/admin/promo-codes");
    return response.data;
  },

  createPromoCode: async (
    data: CreatePromoCodeRequest,
  ): Promise<ApiResponse<PromoCode>> => {
    const response = await axiosClient.post<ApiResponse<PromoCode>>(
      "/admin/promo-codes",
      data,
    );
    return response.data;
  },

  updatePromoCode: async (
    id: number,
    data: Partial<CreatePromoCodeRequest>,
  ): Promise<ApiResponse<PromoCode>> => {
    const response = await axiosClient.put<ApiResponse<PromoCode>>(
      `/admin/promo-codes/${id}`,
      data,
    );
    return response.data;
  },

  togglePromoCode: async (id: number): Promise<ApiResponse<PromoCode>> => {
    const response = await axiosClient.patch<ApiResponse<PromoCode>>(
      `/admin/promo-codes/${id}/toggle`,
    );
    return response.data;
  },

  deletePromoCode: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(
      `/admin/promo-codes/${id}`,
    );
    return response.data;
  },

  // ========== USERS ==========

  getUsersOverview: async (): Promise<ApiResponse<UsersOverview>> => {
    const response = await axiosClient.get<ApiResponse<UsersOverview>>(
      "/admin/users/overview",
    );
    return response.data;
  },

  getUsers: async (params?: UsersParams): Promise<ApiResponse<User[]>> => {
    const response = await axiosClient.get<ApiResponse<User[]>>(
      "/admin/users",
      { params },
    );
    return response.data;
  },

  getUser: async (id: number): Promise<ApiResponse<User>> => {
    const response = await axiosClient.get<ApiResponse<User>>(
      `/admin/users/${id}`,
    );
    return response.data;
  },

  // ========== SETTINGS ==========

  getProfile: async (): Promise<ApiResponse<ProfileData>> => {
    const response = await axiosClient.get<ApiResponse<ProfileData>>(
      "/admin/settings/profile",
    );
    return response.data;
  },

  updateProfile: async (data: any): Promise<ApiResponse<ProfileData>> => {
    const isFormData = data instanceof FormData;
    const response = await axiosClient.post<ApiResponse<ProfileData>>(
      "/admin/settings/profile",
      data,
      isFormData ? { headers: { "Content-Type": "multipart/form-data" } } : {},
    );
    return response.data;
  },
  updateUserStatus: async (
    id: number,
    status: string,
  ): Promise<ApiResponse<null>> => {
    const response = await axiosClient.patch(`/admin/users/${id}/status`, {
      status,
    });
    return response.data;
  },
  changePassword: async (data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse<null>> => {
    const response = await axiosClient.put<ApiResponse<null>>(
      "/admin/settings/password",
      data,
    );
    return response.data;
  },

  getNotificationSettings: async (): Promise<
    ApiResponse<NotificationSetting[]>
  > => {
    const response = await axiosClient.get<ApiResponse<NotificationSetting[]>>(
      "/admin/settings/notifications",
    );
    return response.data;
  },

  updateNotificationSettings: async (data: any): Promise<ApiResponse<any>> => {
    const response = await axiosClient.put<ApiResponse<any>>(
      "/admin/settings/notifications",
      data,
    );
    return response.data;
  },
  getCategories: async (): Promise<ApiResponse<Category[]>> => {
    const response =
      await axiosClient.get<ApiResponse<Category[]>>("/admin/categories");
    return response.data;
  },

  createCategory: async (data: FormData): Promise<ApiResponse<Category>> => {
    const response = await axiosClient.post<ApiResponse<Category>>(
      "/admin/categories",
      data,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  updateCategory: async (
    id: number,
    data: FormData,
  ): Promise<ApiResponse<Category>> => {
    const response = await axiosClient.post<ApiResponse<Category>>(
      `/admin/categories/${id}`,
      data,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    return response.data;
  },

  deleteCategory: async (id: number): Promise<ApiResponse<null>> => {
    const response = await axiosClient.delete<ApiResponse<null>>(
      `/admin/categories/${id}`,
    );
    return response.data;
  },
};
