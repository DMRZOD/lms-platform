"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthStep = "login" | "register" | "verify" | "success";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [step, setStep] = useState<AuthStep>(
    searchParams.get("tab") === "register" ? "register" : "login",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "register") {
      setStep("register");
    } else if (!tab) {
      setStep((prev) =>
        prev === "verify" || prev === "success" ? prev : "login",
      );
    }
  }, [searchParams]);

  const toggleRegister = () => {
    if (step === "login") {
      router.replace("/auth?tab=register");
    } else {
      router.replace("/auth");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((char, i) => {
      next[i] = char;
    });
    setOtp(next);
    const focusIndex = Math.min(pasted.length, 5);
    otpRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left panel */}
      <div className="relative hidden w-1/2 overflow-hidden bg-foreground lg:flex">
        <div className="absolute inset-0 opacity-[0.07]">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-background/25"
              style={{
                width: `${200 + i * 120}px`,
                height: `${200 + i * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </div>
        <div className="relative z-10 flex w-full flex-col justify-between p-12">
          <Link
            href="/"
            className="flex items-center bg-primary rounded-md p-2 w-fit"
          >
            <Image
              src="/logo.png"
              alt="Unified Online University"
              width={476}
              height={130}
              className="h-10 w-auto"
              priority
            />
          </Link>
          <div>
            <h2 className="mb-4 text-4xl leading-tight font-bold text-background">
              Your journey to
              <br />
              knowledge starts here
            </h2>
            <p className="max-w-sm text-background/65">
              Join thousands of learners advancing their careers with
              world-class online education.
            </p>
          </div>
          <p className="text-xs text-background/40">
            © 2026 Unified Online University
          </p>
        </div>
      </div>

      {/* Right panel - form */}
      <div className="flex flex-1 items-center justify-center p-6 bg-primary">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-1 text-sm text-secondary-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>

          <div className="mb-8 flex items-center gap-2 lg:hidden">
            <Link
              href="/"
              className="flex items-center bg-primary rounded-md p-2 w-fit"
            >
              <Image
                src="/logo.png"
                alt="Unified Online University"
                width={476}
                height={130}
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {/* Login */}
            {step === "login" && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="mb-2 text-2xl font-bold text-foreground">
                  Welcome back
                </h1>
                <p className="mb-8 text-sm text-secondary-foreground">
                  Sign in to continue learning
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Sign In
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-secondary-foreground">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleRegister}
                    className="font-medium text-foreground underline-offset-4 hover:underline cursor-pointer"
                  >
                    Create one
                  </button>
                </p>
              </motion.div>
            )}

            {/* Register */}
            {step === "register" && (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="mb-2 text-2xl font-bold text-foreground">
                  Create your account
                </h1>
                <p className="mb-8 text-sm text-secondary-foreground">
                  Start your learning journey today
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("verify");
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-email">Email</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reg-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="reg-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-secondary-foreground transition-colors hover:text-foreground"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>

                  <Button className="w-full" size="lg">
                    Create Account
                  </Button>
                </form>

                <p className="mt-8 text-center text-sm text-secondary-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={toggleRegister}
                    className="font-medium text-foreground underline-offset-4 hover:underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </p>
              </motion.div>
            )}

            {/* OTP Verify */}
            {step === "verify" && (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <h1 className="mb-2 text-2xl font-bold text-foreground">
                  Check your email
                </h1>
                <p className="mb-8 text-sm text-secondary-foreground">
                  We sent a 6-digit verification code to your email address.
                  Enter it below to verify your account.
                </p>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setStep("success");
                  }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label>Verification code</Label>
                    <div className="flex gap-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => {
                            otpRefs.current[i] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={i === 0 ? handleOtpPaste : undefined}
                          className="h-12 w-12 rounded-md border border-input bg-background text-center text-lg font-semibold text-foreground shadow-xs outline-none transition-[color,box-shadow] focus:border-ring focus:ring-[3px] focus:ring-ring/50"
                        />
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Verify Email
                  </Button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary-foreground">
                  Didn&apos;t receive the code?{" "}
                  <button
                    type="button"
                    onClick={() => setOtp(["", "", "", "", "", ""])}
                    className="font-medium text-foreground underline-offset-4 hover:underline cursor-pointer"
                  >
                    Resend code
                  </button>
                </p>
              </motion.div>
            )}

            {/* Success */}
            {step === "success" && (
              <motion.div
                key="success"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="text-center"
              >
                <div className="mb-6 flex justify-center">
                  <CheckCircle2 className="h-16 w-16 text-green-500" />
                </div>
                <h1 className="mb-2 text-2xl font-bold text-foreground">
                  Email verified!
                </h1>
                <p className="mb-8 text-sm text-secondary-foreground">
                  Your account has been created successfully. You can now sign
                  in with your credentials.
                </p>
                <Button
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    setStep("login");
                    router.replace("/auth");
                  }}
                >
                  Go to Login
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function AuthFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="h-8 w-8 animate-pulse rounded-md bg-primary" />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<AuthFallback />}>
      <AuthContent />
    </Suspense>
  );
}
