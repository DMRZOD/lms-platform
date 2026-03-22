"use client";

import { motion } from "framer-motion";
import {
  UserPlus,
  LayoutDashboard,
  MonitorPlay,
  BadgeCheck,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlus,
    title: "Sign up & enroll",
    desc: "Create your profile in minutes. Apply or self-enroll — admissions workflows stay in one place.",
  },
  {
    step: "02",
    icon: LayoutDashboard,
    title: "Plan your path",
    desc: "Pick programs, sync your schedule, and see requirements — dashboards keep you on track.",
  },
  {
    step: "03",
    icon: MonitorPlay,
    title: "Learn your way",
    desc: "Join live sessions or study on demand. Materials, recordings, and chat live in the same hub.",
  },
  {
    step: "04",
    icon: BadgeCheck,
    title: "Prove & grow",
    desc: "Take proctored exams when needed, earn certificates, and export progress for work or school.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden py-24 md:py-32 bg-secondary"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, var(--border) 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-1/4 h-96 w-96 rounded-full bg-primary/40 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/30 blur-3xl"
        aria-hidden
      />

      <div className="container relative mx-auto px-4">
        <motion.div
          className="mx-auto mb-16 max-w-2xl text-center md:mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="mb-4 block text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">
            How it works
          </span>
          <h2 className="mb-5 text-3xl font-bold tracking-tight text-foreground md:text-5xl md:leading-[1.1]">
            One flow from first click to credential
          </h2>
          <p className="text-base leading-relaxed text-primary-foreground md:text-lg">
            Everything stays connected — no juggling spreadsheets, chat apps,
            and five different portals.
          </p>
        </motion.div>

        <div className="relative mx-auto max-w-5xl">
          <div
            className="absolute bottom-0 left-4 top-0 w-px bg-border md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          <ol className="relative">
            {steps.map((item, i) => {
              const Icon = item.icon;
              const textOnLeft = i % 2 === 0;

              const textBlock = (
                <div
                  className={
                    textOnLeft
                      ? "text-left md:pr-10 md:text-right"
                      : "text-left md:pl-10 md:text-left"
                  }
                >
                  <span className="text-xs font-semibold tabular-nums tracking-widest text-secondary-foreground">
                    {item.step}
                  </span>
                  <h3 className="mt-1 text-xl font-semibold text-foreground md:text-2xl">
                    {item.title}
                  </h3>
                  <p
                    className={`mt-3 max-w-md text-sm leading-relaxed text-primary-foreground md:text-base ${textOnLeft ? "md:ml-auto" : ""}`}
                  >
                    {item.desc}
                  </p>
                </div>
              );

              const iconBlock = (
                <div
                  className={`flex justify-start ${textOnLeft ? "md:justify-start md:pl-10" : "md:justify-end md:pr-10"}`}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg ring-[3px] ring-background md:h-24 md:w-24 md:rounded-3xl md:shadow-xl md:ring-4">
                    <Icon
                      className="h-6 w-6 md:h-10 md:w-10"
                      strokeWidth={1.4}
                    />
                  </div>
                </div>
              );

              return (
                <motion.li
                  key={item.step}
                  className="relative grid grid-cols-1 items-start gap-5 py-8 md:grid-cols-2 md:items-center md:gap-0 md:py-14"
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <div
                    className="absolute left-4 top-[1.85rem] z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-background bg-foreground shadow-sm md:left-1/2 md:top-1/2 md:-translate-y-1/2"
                    aria-hidden
                  />

                  <div
                    className={`pl-11 md:pl-0 ${textOnLeft ? "order-2 md:order-0" : "order-1 md:order-0"}`}
                  >
                    {textOnLeft ? textBlock : iconBlock}
                  </div>
                  <div
                    className={`pl-11 md:pl-0 ${textOnLeft ? "order-1 md:order-0" : "order-2 md:order-0"}`}
                  >
                    {textOnLeft ? iconBlock : textBlock}
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
