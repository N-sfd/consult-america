"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import { stockImage } from "@/lib/marketing/stock-images";

const links = [
  {
    title: "Strategy & operating models",
    href: "/capabilities/enterprise-transformation",
  },
  {
    title: "Program leadership",
    href: "/capabilities/managed-delivery",
  },
  {
    title: "Change & adoption",
    href: "/capabilities/enterprise-transformation",
  },
];

const revealEase = [0.2, 0.8, 0.2, 1] as const;

export default function EnterpriseTransformSection() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 18, scale: 0.985 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.78, ease: revealEase }}
            className="lg:col-span-5"
          >
            <div className="ca-home-compose relative mx-auto max-w-[480px] lg:mx-0">
              <div
                aria-hidden="true"
                className="ca-home-sage-panel ca-home-moving--slow -right-5 top-8 hidden h-[380px] w-[180px] opacity-80 lg:block"
              />
              <div className="ca-home-frame-offset ca-home-photo-overlay relative z-10 shadow-[0_20px_48px_rgba(7,59,58,0.08)] ring-1 ring-[#DDE6E3]">
                <div className="ca-home-img-major relative aspect-[4/5] w-full">
                  <Image
                    src={stockImage("enterpriseTransformationFeature", { w: 1200, q: 85 })}
                    alt="Enterprise transformation team in discussion"
                    fill
                    className="ca-home-photo object-cover"
                    sizes="(max-width: 1024px) 100vw, 38vw"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: revealEase }}
            className="lg:col-span-7"
          >
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              Enterprise Transformation
            </p>
            <h2 className="mt-3 max-w-xl font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              Move strategy into execution.
            </h2>
            <p className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-[#5B6D6B]">
              Align operating models, platforms, and delivery so modernization programs reach
              production — with governance teams can trust.
            </p>
            <ul className="mt-7 space-y-0 border-t border-[#DDE6E3]">
              {links.map((item) => (
                <li key={item.title} className="border-b border-[#DDE6E3]">
                  <Link
                    href={item.href}
                    className="ca-home-pillar group flex items-center justify-between py-4"
                  >
                    <span className="ca-home-pillar-label text-sm font-medium text-[#073B3A] group-hover:text-[#176A63]">
                      {item.title}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-[#176A63] opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/capabilities/enterprise-transformation"
              className="mt-7 inline-flex h-[52px] items-center gap-2 rounded-lg bg-[#B83A3A] px-6 text-sm font-semibold text-white hover:bg-[#992F31]"
            >
              Explore Transformation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
