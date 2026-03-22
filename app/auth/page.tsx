"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(
    searchParams.get("tab") === "register",
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsRegister(searchParams.get("tab") === "register");
  }, [searchParams]);

  const toggleRegister = () => {
    if (isRegister) {
      router.replace("/auth");
    } else {
      router.replace("/auth?tab=register");
    }
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
            <motion.div
              key={isRegister ? "register" : "login"}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <h1 className="mb-2 text-2xl font-bold text-foreground">
                {isRegister ? "Create your account" : "Welcome back"}
              </h1>
              <p className="mb-8 text-sm text-secondary-foreground">
                {isRegister
                  ? "Start your learning journey today"
                  : "Sign in to continue learning"}
              </p>

              <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                {isRegister && (
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
                )}

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

                {isRegister && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                    />
                  </div>
                )}

                <Button className="w-full" size="lg">
                  {isRegister ? "Create Account" : "Sign In"}
                </Button>
              </form>

              <p className="mt-8 text-center text-sm text-secondary-foreground">
                {isRegister
                  ? "Already have an account?"
                  : "Don't have an account?"}{" "}
                <button
                  type="button"
                  onClick={toggleRegister}
                  className="font-medium text-foreground underline-offset-4 hover:underline cursor-pointer"
                >
                  {isRegister ? "Sign in" : "Create one"}
                </button>
              </p>
            </motion.div>
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
