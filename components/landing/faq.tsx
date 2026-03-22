"use client";

import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do courses and live sessions work together?",
    a: "You get recorded lessons for self-paced study plus scheduled live classes in the same course space. Replays, materials, and announcements stay in one timeline so you never hunt across apps.",
  },
  {
    q: "Are certificates recognized by employers?",
    a: "You receive a verifiable digital certificate for each completed program. Many partners list our credentials on job boards; exact recognition depends on your employer or institution.",
  },
  {
    q: "What are proctored exams and when are they required?",
    a: "Some programs use proctored assessments to protect academic integrity. You’ll see requirements upfront in the syllabus, and we guide you through scheduling and the secure exam flow.",
  },
  {
    q: "Can institutions manage admissions and cohorts on the platform?",
    a: "Yes. Teams can run applications, enrollments, sections, and reporting from one admin workspace while learners stay in the same unified experience.",
  },
  {
    q: "Is there a free tier?",
    a: "You can create an account and explore selected courses at no cost. Full programs and proctored credentials are available through paid enrollment or your organization’s license.",
  },
  {
    q: "How do I get help if I’m stuck?",
    a: "Use in-course discussion, email support from your dashboard, or institution help desks when your school is on the platform. We aim to respond within one business day for general inquiries.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="border-y border-border bg-secondary py-24 md:py-28">
      <div className="container mx-auto px-4">
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground">
            FAQ
          </span>
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl md:leading-tight">
            Answers before you enroll
          </h2>
          <p className="text-base leading-relaxed text-primary-foreground md:text-lg">
            Straightforward details on learning formats, credentials, exams, and
            support — so you know what to expect.
          </p>
        </motion.div>

        <motion.div
          className="mx-auto max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.08 }}
        >
          <Accordion type="single" collapsible className="flex flex-col gap-3">
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`faq-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
