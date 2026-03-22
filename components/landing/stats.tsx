"use client";
import { motion } from "framer-motion";

const stats = [
  { value: "100K+", label: "Active Students" },
  { value: "500+", label: "Courses Available" },
  { value: "150+", label: "Countries" },
  { value: "95%", label: "Satisfaction Rate" },
];

const Stats = () => (
  <section className="py-20 bg-foreground">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="text-3xl md:text-5xl font-bold text-background mb-2">
              {s.value}
            </div>
            <div className="text-sm text-secondary-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Stats;
