"use client";

import Image from "next/image";
import Link from "next/link";

const Footer = () => (
  <footer className="bg-foreground py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div>
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
          <p className="text-sm text-secondary-foreground mt-4">
            Empowering learners worldwide with accessible, high-quality
            education.
          </p>
        </div>
        {[
          {
            title: "Platform",
            links: ["Features", "How it works", "Testimonials", "FAQ"],
          },
          { title: "Company", links: ["About", "Careers", "Blog", "Contact"] },
          {
            title: "Support",
            links: [
              "Help Center",
              "Privacy Policy",
              "Terms of Service",
              "Accessibility",
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-background text-sm mb-4">
              {col.title}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-sm text-secondary-foreground hover:text-background transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-8 text-center">
        <p className="text-xs text-secondary-foreground">
          © 2026 Unified Online University. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
