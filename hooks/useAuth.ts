import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/auth";
import type { LoginRequest, RegisterRequest } from "@/types/api";

export function useAuth() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const login = async (payload: LoginRequest) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(payload);
            router.push(authService.getRoleRoute(data.user.roles));
        } catch (err: any) {
            setError(err.message || "Ошибка входа");
        } finally {
            setLoading(false);
        }
    };

    const register = async (payload: RegisterRequest) => {
        setLoading(true);
        setError(null);
        try {
            await authService.register(payload);
            router.push(`/auth?mode=verify&email=${encodeURIComponent(payload.email)}`);
        } catch (err: any) {
            setError(err.message || "Ошибка регистрации");
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (email: string, code: string) => {
        setLoading(true);
        setError(null);
        try {
            await authService.verifyEmail({ email, code });
            router.push("/auth?mode=login");
        } catch (err: any) {
            setError(err.message || "Неверный код");
        } finally {
            setLoading(false);
        }
    };

    return { login, register, verifyEmail, loading, error, setError };
}