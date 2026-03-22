"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative pt-30 pb-15 md:pt-40 md:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-secondary" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-xs font-medium mb-6 tracking-wide uppercase">
              The Future of Education
            </span>
          </motion.div>
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            One Platform. Every Process.{" "}
            <span className="relative">
              Zero Chaos.
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
              >
                <path
                  d="M2 8C50 2 150 2 198 8"
                  stroke="#1c1d1d"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.2"
                />
              </svg>
            </span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-primary-foreground max-w-xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Automate admissions, deliver live lectures, manage exams with
            proctoring, and track every student — all in one platform.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/auth?tab=register">
              <Button size="lg" className="gap-2 px-8 text-base">
                Start Learning Free <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="gap-2 px-8 text-base"
            >
              <Play className="h-5 w-5" /> Watch Demo
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-border">
            <Image
              src="/hero-dashboard.jpg"
              alt="Unified Online University Dashboard"
              width={1920}
              height={1080}
              className="h-auto w-full"
              priority
              sizes="(max-width: 1280px) 100vw, 1280px"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
