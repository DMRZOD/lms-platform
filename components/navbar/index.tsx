"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Unified Online University"
            width={476}
            height={130}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <a
            href="#features"
            className="text-md text-primary-foreground hover:text-foreground transition-colors"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-md text-primary-foreground hover:text-foreground transition-colors"
          >
            How it works
          </a>
          <a
            href="#testimonials"
            className="text-md text-primary-foreground hover:text-foreground transition-colors"
          >
            Testimonials
          </a>
          <a
            href="#faq"
            className="text-md text-primary-foreground hover:text-foreground transition-colors"
          >
            FAQ
          </a>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link href="/auth">
            <Button variant="ghost" size="lg" className="text-foreground">
              Sign In
            </Button>
          </Link>
          <Link href="/auth?tab=register">
            <Button size="lg">Get Started</Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-4 pb-4 space-y-3">
          <a
            href="#features"
            className="block py-2 text-sm text-secondary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="block py-2 text-sm text-secondary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            How it works
          </a>
          <a
            href="#testimonials"
            className="block py-2 text-sm text-secondary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            Testimonials
          </a>
          <a
            href="#faq"
            className="block py-2 text-sm text-secondary-foreground"
            onClick={() => setMobileOpen(false)}
          >
            FAQ
          </a>
          <div className="flex gap-2 pt-2">
            <Link href="/auth" className="flex-1">
              <Button variant="outline" className="w-full" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth?tab=register" className="flex-1">
              <Button className="w-full" size="sm">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
