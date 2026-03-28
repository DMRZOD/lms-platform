import { apiClient } from "./api-client";

export interface UserInfo {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    status: string;
    accessState: string;
    roles: string[];
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    user: UserInfo;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export const authService = {
    login: async (payload: LoginRequest): Promise<AuthResponse> => {
        const data = await apiClient.post<AuthResponse>("/api/auth/login", payload);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        // Для middleware — сохраняем в cookie тоже
        document.cookie = `accessToken=${data.accessToken}; path=/; max-age=3600`;
        return data;
    },

    register: (payload: RegisterRequest) =>
        apiClient.post<{ message: string }>("/api/auth/register", payload),

    verifyEmail: (payload: { email: string; code: string }) =>
        apiClient.post<{ message: string }>("/api/auth/verify-email", payload),

    resendOtp: (payload: { email: string }) =>
        apiClient.post<{ message: string }>("/api/auth/resend-otp", payload),

    logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        document.cookie = "accessToken=; path=/; max-age=0";
        window.location.href = "/auth";
    },

    getUser: (): UserInfo | null => {
        if (typeof window === "undefined") return null;
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    },

    isAuthenticated: () => {
        if (typeof window === "undefined") return false;
        return !!localStorage.getItem("accessToken");
    },

    getRoleRoute: (roles: string[]): string => {
        const role = roles[0]?.toLowerCase();
        const map: Record<string, string> = {
            student:    "/student/dashboard",
            teacher:    "/teacher/dashboard",
            admin:      "/admin/dashboard",
            applicant:  "/applicant/dashboard",
            academic:   "/academic/dashboard",
            accountant: "/accountant/dashboard",
            aqad:       "/aqad/dashboard",
            deputy:     "/deputy/dashboard",
            resource:   "/resource/dashboard",
            it_ops:     "/it-ops/dashboard",
        };
        return map[role] ?? "/student/dashboard";
    },
};