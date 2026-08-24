"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";
import { capabilityGroups, industryLinks, navLinks } from "@/lib/site-data";

export function SiteFooter() {
  const { setOpen } = useContactPanel();
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-[94.5em] px-5 py-16 sm:px-8 lg:px-12 lg:py-24">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <div>
            <p className="ca-h2 max-w-xl">ConsultAmerica is a global Oracle, AI, and transformation partner.</p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="ca-button-primary mt-8"
            >
              Contact
            </button>
          </div>
          <form onSubmit={handleSubscribe} className="max-w-sm">
            <p className="text-sm text-white/60">
              Stay up to date with enterprise delivery, Oracle, and AI.
            </p>
            {subscribed ? (
              <p className="mt-4 text-sm">Thank you. Your submission has been received.</p>
            ) : (
              <div className="mt-4 flex items-end gap-3">
                <input
                  type="email"
                  required
                  placeholder="Email"
                  className="ca-underline-input"
                />
                <button type="submit" className="ca-button-primary shrink-0">
                  Subscribe
                </button>
              </div>
            )}
          </form>
        </div>

        <div className="mt-20 grid gap-10 md:grid-cols-2 xl:grid-cols-4">
          {capabilityGroups.slice(0, 4).map((group) => (
            <div key={group.title}>
              <Link href={group.href} className="text-sm">
                {group.title}
              </Link>
              <ul className="mt-4 space-y-2">
                {group.services.map((service) => (
                  <li key={service.label}>
                    <Link
                      href={service.href}
                      className="text-sm text-white/50 transition-colors hover:text-white"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>ConsultAmerica © {new Date().getFullYear()} All rights reserved</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {industryLinks.slice(0, 1).map((item) => (
              <Link key={item.label} href={item.href} className="hover:text-white">
                Industries
              </Link>
            ))}
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-white">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
