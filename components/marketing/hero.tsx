"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { useContactPanel } from "@/components/providers/contact-provider";

const practiceAreas = [
  { label: "Oracle", href: "/oracle" },
  { label: "CRM", href: "/platforms/crm" },
  { label: "AI + Data", href: "/ai-data" },
  { label: "Cloud", href: "/capabilities/digital-engineering" },
  { label: "Application Engineering", href: "/capabilities/digital-engineering" },
];

export default function Hero() {
  const { setOpen } = useContactPanel();
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, 20]);
  const fgScrollY = useTransform(scrollYProgress, [0, 1], [0, -12]);
  const contentScrollY = useTransform(scrollYProgress, [0, 1], [0, 4]);
  const contentOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const t = setTimeout(() => setHasEntered(true), 1800);
    return () => clearTimeout(t);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (shouldReduceMotion || !isDesktop) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = e.clientX / innerWidth - 0.5;
      const normY = e.clientY / innerHeight - 0.5;
      setMouseOffset({ x: normX, y: normY });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [shouldReduceMotion, isDesktop]);

  const bgPointerX = isDesktop ? mouseOffset.x * 3 : 0;
  const bgPointerY = isDesktop ? mouseOffset.y * 3 : 0;
  const fgPointerX = isDesktop ? mouseOffset.x * 7 : 0;
  const fgPointerY = isDesktop ? mouseOffset.y * 7 : 0;

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-[100vw] overflow-hidden min-h-[clamp(520px,72vh,920px)] flex items-center bg-[#211E1B] border-b border-[#3A302B]"
    >
      {/* Photographic architecture — clipped inside section */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden lg:inset-y-0 lg:left-auto lg:right-0 lg:w-[58%] xl:w-[55%]">
          {/* BACK LAYER: inset -2%, image 104%, cinematic drift */}
          <motion.div
            style={shouldReduceMotion ? {} : { y: bgScrollY }}
            className="absolute inset-[-2%] overflow-hidden"
          >
            <motion.div
              initial={shouldReduceMotion ? { scale: 1 } : { scale: 1.045 }}
              animate={
                shouldReduceMotion
                  ? { scale: 1 }
                  : hasEntered
                    ? {
                        scale: isDesktop ? [1.02, 1.035, 1.02] : [1.015, 1.025, 1.015],
                        x: isDesktop ? [0 + bgPointerX, -8 + bgPointerX, 0 + bgPointerX] : 0,
                        y: isDesktop ? [0 + bgPointerY, -4 + bgPointerY, 0 + bgPointerY] : [0, -4, 0],
                      }
                    : { scale: 1.02 }
              }
              transition={
                shouldReduceMotion
                  ? { duration: 0.01 }
                  : hasEntered
                    ? {
                        scale: { duration: isDesktop ? 20 : 24, repeat: Infinity, ease: "easeInOut" },
                        x: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                        y: { duration: 20, repeat: Infinity, ease: "easeInOut" },
                      }
                    : { duration: 1.8, ease: [0.2, 0.8, 0.2, 1] }
              }
              className="relative h-full w-full ca-shape-hero-mask"
            >
              <Image
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2600&q=90"
                alt="Consult America Enterprise Technology Architecture"
                fill
                priority
                quality={92}
                className="object-cover object-center scale-[1.04] filter contrast-[1.04] brightness-[0.96]"
                sizes="55vw"
              />
            </motion.div>
          </motion.div>

          {/* FRONT LAYER: independent drift + pointer depth */}
          {!shouldReduceMotion && (
            <motion.div
              style={isDesktop ? { y: fgScrollY } : {}}
              initial={{ opacity: 0 }}
              animate={{
                opacity: 1,
                y: isDesktop
                  ? [0 + fgPointerY, -8 + fgPointerY, 0 + fgPointerY]
                  : [0, -4, 0],
                x: isDesktop
                  ? [0 + fgPointerX, 5 + fgPointerX, 0 + fgPointerX]
                  : 0,
              }}
              transition={{
                opacity: { duration: 1.2, delay: 0.5 },
                y: { duration: isDesktop ? 10 : 18, repeat: Infinity, ease: "easeInOut" },
                x: { duration: isDesktop ? 10 : 18, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute bottom-[10%] right-[6%] sm:right-[8%] z-[2] w-[34%] max-w-[260px] aspect-[4/5] overflow-hidden rounded-t-[70px] rounded-b-[16px] border border-[#D8D0C5]/25 shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
            >
              <Image
                src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=85"
                alt=""
                fill
                className="object-cover mkt-img-graded"
                sizes="260px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#211E1B]/50 via-transparent to-transparent" />
            </motion.div>
          )}

          {/* Brand arc — inside photo column, clipped */}
          <div
            className="ca-brand-arc-motif top-[-5rem] right-[8%] w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] opacity-20 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(33,30,27,0.98) 0%, rgba(33,30,27,0.92) 38%, rgba(33,30,27,0.55) 62%, rgba(33,30,27,0.15) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[1] bg-radial-[circle_at_15%_25%] from-[#B63A3A]/8 via-transparent to-transparent pointer-events-none" />
      </div>

      <motion.div
        style={shouldReduceMotion ? {} : { y: contentScrollY, opacity: contentOpacity }}
        className="ca-shell relative z-10 w-full max-w-full py-20 sm:py-24 lg:py-32"
      >
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-8 items-center">
          <div className="lg:col-span-6 xl:col-span-5 space-y-8 min-w-0">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-[#D8D0C5]/30 bg-[#2B2420]/80 px-3.5 py-1 text-xs font-semibold text-[#D8C5AA] backdrop-blur-sm max-w-full"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#B63A3A] shrink-0" />
              <span className="truncate sm:whitespace-normal">ENTERPRISE TRANSFORMATION &amp; CLOUD ARCHITECTURE</span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-serif text-4xl font-bold tracking-tight text-[#FFFDF8] sm:text-5xl lg:text-6xl sm:leading-[1.08]"
            >
              Transform the core.
              <br />
              <span className="text-[#D8C5AA] italic font-serif">
                Build what comes next.
              </span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg leading-relaxed text-[rgba(255,253,248,0.78)] max-w-xl"
            >
              We advise, build, and run production transformations across Oracle Cloud, enterprise AI, data engineering, and bespoke software systems.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="group inline-flex items-center gap-2 rounded-lg bg-[#B63A3A] px-7 py-3.5 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#942E31] cursor-pointer"
              >
                <span>Talk to a Practice Lead</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-lg border border-[#D8D0C5]/40 bg-white/5 px-6 py-3.5 text-sm font-semibold text-[#FFFDF8] backdrop-blur-sm transition-all hover:bg-white/10 hover:border-[#D8D0C5]"
              >
                <span>Explore Selected Work</span>
              </Link>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="pt-4 border-t border-[#3A302B]"
            >
              <p className="text-[0.68rem] font-bold uppercase tracking-widest text-[#D8C5AA]/70 mb-3">
                CORE PRACTICES
              </p>
              <div className="flex flex-wrap gap-2">
                {practiceAreas.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="inline-flex items-center rounded-md border border-[#D8D0C5]/20 bg-[#2B2420]/60 px-3 py-1 text-xs font-medium text-[#FFFDF8]/80 hover:text-white hover:border-[#B63A3A] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
