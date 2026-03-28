// ─── Auth ────────────────────────────────────────────────
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

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

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

export interface PaginatedResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
}

export interface ApiError {
    message: string;
    status: number;
    timestamp?: string;
}

// Роли
export type UserRole =
    | "STUDENT"
    | "TEACHER"
    | "ADMIN"
    | "APPLICANT"
    | "ACADEMIC"
    | "ACCOUNTANT";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    teacherId: number;
}