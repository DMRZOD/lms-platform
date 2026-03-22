"use client";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Software Engineer at Google",
    text: "Unified Online University transformed my career. The courses are world-class and the community is incredibly supportive.",
    avatar: "SC",
  },
  {
    name: "Marcus Williams",
    role: "Data Scientist",
    text: "The quality of instruction is on par with top universities. I earned three certificates that directly helped me land my dream job.",
    avatar: "MW",
  },
  {
    name: "Elena Petrova",
    role: "Product Manager",
    text: "Flexible, comprehensive, and beautifully designed. This is how online education should be.",
    avatar: "EP",
  },
];

const Testimonials = () => (
  <section id="testimonials" className="py-24 bg-background">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="text-xs font-medium uppercase tracking-widest text-secondary-foreground mb-3 block">
          Testimonials
        </span>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Loved by learners worldwide
        </h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            className="bg-background rounded-2xl p-8 shadow-sm border border-border"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star
                  key={j}
                  className="h-4 w-4 fill-foreground text-foreground"
                />
              ))}
            </div>
            <p className="text-primary-foreground text-sm leading-relaxed mb-6">
              &quot;{t.text}&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-foreground flex items-center justify-center text-background text-xs font-semibold">
                {t.avatar}
              </div>
              <div>
                <div className="font-medium text-sm text-foreground">
                  {t.name}
                </div>
                <div className="text-xs text-secondary-foreground">
                  {t.role}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Testimonials;
