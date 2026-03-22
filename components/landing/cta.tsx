"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTA = () => (
  <section className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        className="max-w-3xl mx-auto text-center bg-foreground rounded-3xl p-12 md:p-16"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
          Ready to start learning?
        </h2>
        <p className="text-primary mb-8 max-w-md mx-auto">
          Join 100,000+ students already building their future with Unified
          Online University.
        </p>
        <Link href="/auth?tab=register">
          <Button
            size="lg"
            variant="secondary"
            className="gap-2 px-8 text-base"
          >
            Create Free Account <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </div>
  </section>
);

export default CTA;
