"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import BrandLogo from "@/components/brand/brand-logo";
import { Grid, Shell } from "@/components/layout/grid";
import { useContactPanel } from "@/components/providers/contact-provider";
import { capabilityGroups, navLinks } from "@/lib/site-data";

export function SiteFooter() {
  const { setOpen } = useContactPanel();
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="border-t border-[var(--ca-border)] bg-[var(--ca-navy)] text-white">
      <div className="border-b border-white/10 bg-[var(--ca-navy)]">
        <Shell className="py-16 lg:py-24">
          <p className="max-w-4xl text-4xl font-medium leading-[1.05] tracking-[-0.045em] text-white md:text-6xl lg:text-7xl">
            Ready to move from plan to production?
          </p>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mt-10 inline-flex min-h-12 items-center gap-2 bg-white px-6 text-sm font-medium text-[var(--ca-navy)] transition-opacity hover:opacity-90"
          >
            Start a conversation
          </button>
        </Shell>
      </div>

      <Shell className="py-16 lg:py-20">
        <Grid>
          <div className="col-span-12 lg:col-span-6">
            <BrandLogo />
            <p className="mt-8 text-2xl font-medium tracking-[-0.03em] text-white md:text-3xl">
              Enterprise technology.
              <br />
              Delivered to production.
            </p>
          </div>
          <form onSubmit={handleSubscribe} className="col-span-12 lg:col-span-5 lg:col-start-8">
            <p className="text-sm font-semibold text-white">Stay informed</p>
            <p className="mt-2 text-sm text-white/60">
              Notes on Oracle, AI, and enterprise delivery.
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
        </Grid>

        <Grid className="mt-16">
          {capabilityGroups.slice(0, 4).map((group) => (
            <div key={group.title} className="col-span-6 md:col-span-3">
              <Link href={group.href} className="text-sm font-semibold">
                {group.title}
              </Link>
              <ul className="mt-4 space-y-2">
                {group.services.map((service) => (
                  <li key={service.label}>
                    <Link
                      href={service.href}
                      className="text-sm text-white/50 transition-colors hover:text-[var(--ca-blue-soft)]"
                    >
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Grid>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>ConsultAmerica © {new Date().getFullYear()} All rights reserved</p>
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/industries" className="hover:text-[var(--ca-blue-soft)]">
              Industries
            </Link>
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-[var(--ca-blue-soft)]"
              >
                {item.label}
              </Link>
            ))}
            <Link href="/jobs" className="hover:text-[var(--ca-blue-soft)]">
              Open Roles
            </Link>
            <Link href="/contact" className="hover:text-[var(--ca-blue-soft)]">
              Contact
            </Link>
          </nav>
        </div>
      </Shell>
    </footer>
  );
}
