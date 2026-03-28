const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://online-university.onrender.com";

type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface RequestConfig {
    method?: Method;
    body?: unknown;
    headers?: Record<string, string>;
}

async function request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const { method = "GET", body, headers = {} } = config;

    const token = typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
        ...(body ? { body: JSON.stringify(body) } : {}),
    });

    if (res.status === 401) {
        const refreshed = await tryRefreshToken();
        if (refreshed) return request<T>(endpoint, config);
        redirectToLogin();
    }

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${res.status}`);
    }

    if (res.status === 204) return null as T;
    return res.json();
}

async function tryRefreshToken(): Promise<boolean> {
    try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) return false;

        const res = await fetch(`${BASE_URL}/api/auth/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
        });

        if (!res.ok) return false;
        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        return true;
    } catch {
        return false;
    }
}

function redirectToLogin() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    if (typeof window !== "undefined") window.location.href = "/auth";
}

export const apiClient = {
    get:    <T>(url: string)                 => request<T>(url),
    post:   <T>(url: string, body?: unknown) => request<T>(url, { method: "POST", body }),
    put:    <T>(url: string, body?: unknown) => request<T>(url, { method: "PUT", body }),
    patch:  <T>(url: string, body?: unknown) => request<T>(url, { method: "PATCH", body }),
    delete: <T>(url: string)                 => request<T>(url, { method: "DELETE" }),
};