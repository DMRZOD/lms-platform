"use client";

import { BookOpen, Users, Award, BarChart3, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: BookOpen,
    title: "500+ Courses",
    desc: "From data science to humanities, find courses that fit your goals.",
  },
  {
    icon: Users,
    title: "Expert Instructors",
    desc: "Learn from professors and industry professionals worldwide.",
  },
  {
    icon: Award,
    title: "Verified Certificates",
    desc: "Earn recognized credentials to advance your career.",
  },
  {
    icon: BarChart3,
    title: "Track Progress",
    desc: "Visual dashboards to monitor your learning journey.",
  },
  {
    icon: Clock,
    title: "Learn Anytime",
    desc: "Self-paced courses that fit your busy schedule.",
  },
  {
    icon: Globe,
    title: "Global Community",
    desc: "Connect with 100k+ learners from 150+ countries.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-xs font-medium uppercase tracking-widest text-secondary-foreground mb-3 block">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need to succeed
          </h2>
          <p className="text-primary-foreground max-w-lg mx-auto">
            Our platform is designed to provide the best online learning
            experience possible.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="group p-8 rounded-2xl bg-secondary hover:bg-foreground transition-colors duration-300 cursor-default"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary group-hover:bg-primary-foreground flex items-center justify-center mb-5 transition-colors">
                <f.icon className="h-6 w-6 text-foreground group-hover:text-secondary transition-colors" />
              </div>
              <h3 className="font-semibold text-lg text-foreground group-hover:text-background mb-2 transition-colors">
                {f.title}
              </h3>
              <p className="text-primary-foreground group-hover:text-primary text-sm leading-relaxed transition-colors">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
