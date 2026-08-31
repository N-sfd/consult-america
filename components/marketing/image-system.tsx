"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BaseImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  containerClassName?: string;
  sizes?: string;
  aspectRatio?: string;
  overlay?: ReactNode;
}

/**
 * 01 — REUSABLE EDITORIAL IMAGE
 * Normalized warm editorial color grading with smooth hover zoom & subtle contrast.
 */
export function EditorialImage({
  src,
  alt,
  priority = false,
  className,
  containerClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  aspectRatio = "aspect-[16/10]",
  overlay,
}: BaseImageProps) {
  const shouldReduce = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 20, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        "group relative w-full overflow-hidden border border-[#D8D0C5] bg-[#211E1B] shadow-[0_16px_40px_rgba(38,31,27,0.08)]",
        aspectRatio,
        containerClassName
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(
          "object-cover mkt-img-graded transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.025]",
          className
        )}
      />
      {overlay}
    </motion.div>
  );
}

/**
 * 02 — REUSABLE ARCH IMAGE
 * Architectural window arch frame (e.g. CRM, Leadership, Industries).
 * border-radius: 160px 160px 16px 16px or 999px 999px 18px 18px.
 */
interface ArchImageProps extends BaseImageProps {
  showBackingArc?: boolean;
  backingOffset?: string;
}

export function ArchImage({
  src,
  alt,
  priority = false,
  className,
  containerClassName,
  sizes = "(max-width: 768px) 100vw, 500px",
  aspectRatio = "aspect-[4/5]",
  showBackingArc = true,
  overlay,
}: ArchImageProps) {
  const shouldReduce = useReducedMotion();

  return (
    <div className="relative flex justify-center w-full max-w-[500px] mx-auto">
      {/* Behind Arc Accent (Requirement 12: Thin burgundy arc offset) */}
      {showBackingArc && (
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="absolute inset-0 translate-x-3.5 translate-y-3.5 sm:translate-x-4 sm:translate-y-4 rounded-t-[160px] rounded-b-[18px] border border-[#B63A3A]/25 bg-[#D8C5AA]/20 -z-10 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Main Arch Container */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className={cn(
          "group relative w-full overflow-hidden rounded-t-[160px] rounded-b-[18px] border border-[#D8D0C5] bg-[#F7F3EC] shadow-[0_20px_50px_rgba(38,31,27,0.1)]",
          aspectRatio,
          containerClassName
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover mkt-img-graded transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.025]",
            className
          )}
        />
        {overlay}
      </motion.div>
    </div>
  );
}

/**
 * 03 — REUSABLE OFFSET IMAGE
 * What We Do & Service Features: alternating corner radiuses with offset geometric plane.
 * Image 01: accent bottom-right
 * Image 02: accent top-left
 * Image 03: accent bottom-left
 * Image 04: accent top-right
 */
type OffsetVariant = "bottom-right" | "top-left" | "bottom-left" | "top-right";

interface OffsetImageProps extends BaseImageProps {
  variant?: OffsetVariant;
  badge?: ReactNode;
  detailImage?: string;
  detailBadge?: string;
}

export function OffsetImage({
  src,
  alt,
  variant = "bottom-right",
  priority = false,
  className,
  containerClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
  aspectRatio = "aspect-[16/10]",
  badge,
  detailImage,
  detailBadge,
  overlay,
}: OffsetImageProps) {
  const shouldReduce = useReducedMotion();

  // Corner radius alternation (Requirements 08 & 09)
  const isOddRadius = variant === "bottom-right" || variant === "bottom-left";
  const frameRadiusClass = isOddRadius
    ? "rounded-tl-[18px] rounded-tr-[4px] rounded-br-[18px] rounded-bl-[4px]"
    : "rounded-tl-[4px] rounded-tr-[22px] rounded-br-[4px] rounded-bl-[22px]";

  // Offset plane placement
  const offsetPosition = {
    "bottom-right": "bottom-[-12px] right-[-12px]",
    "top-left": "top-[-12px] left-[-12px]",
    "bottom-left": "bottom-[-12px] left-[-12px]",
    "top-right": "top-[-12px] right-[-12px]",
  }[variant];

  const hoverAccentOffset = {
    "bottom-right": { x: -3, y: -3 },
    "top-left": { x: 3, y: 3 },
    "bottom-left": { x: 3, y: -3 },
    "top-right": { x: -3, y: 3 },
  }[variant];

  return (
    <div className="group/offset relative w-full">
      {/* Behind Offset Geometric Plane */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.12 }}
        whileHover={shouldReduce ? {} : hoverAccentOffset}
        className={cn(
          "absolute w-full h-full bg-[#B63A3A]/10 border border-[#B63A3A]/15 -z-10 pointer-events-none transition-transform duration-600",
          frameRadiusClass,
          offsetPosition
        )}
        aria-hidden="true"
      />

      {/* Main Image Frame */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 24, scale: 0.985 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className={cn(
          "relative z-10 w-full overflow-hidden border border-[#D8D0C5] bg-white shadow-[0_20px_50px_rgba(38,31,27,0.06)]",
          frameRadiusClass,
          aspectRatio,
          containerClassName
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover mkt-img-graded transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/offset:scale-[1.025]",
            className
          )}
        />
        {overlay}
        {badge && (
          <div className="absolute top-3 left-3 z-20">
            {badge}
          </div>
        )}
      </motion.div>

      {/* Optional Secondary Detail Image / Overlapping Pill */}
      {detailImage && (
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, scale: 0.9, y: 10 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={cn(
            "absolute z-20 w-[110px] h-[110px] sm:w-[136px] sm:h-[136px] overflow-hidden rounded-2xl border-2 border-white bg-white shadow-[0_16px_36px_rgba(38,31,27,0.18)] pointer-events-none",
            variant === "top-left" || variant === "bottom-left"
              ? "right-[-12px] sm:right-[-18px] bottom-[-16px]"
              : "left-[-12px] sm:left-[-18px] bottom-[-16px]"
          )}
        >
          <Image
            src={detailImage}
            alt=""
            fill
            sizes="140px"
            className="object-cover mkt-img-graded filter contrast-110"
          />
          {detailBadge && (
            <div className="absolute inset-x-0 bottom-0 bg-[#211E1B]/85 px-2 py-1 text-center backdrop-blur-xs">
              <span className="text-[0.62rem] font-bold uppercase tracking-wider text-white">
                {detailBadge}
              </span>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/**
 * 04 — REUSABLE CLIPPED-CORNER IMAGE
 * Selected Work / Case Studies:
 * Story 01: 0 48px 0 0
 * Story 02: 48px 0 0 0
 * Story 03: 0 0 48px 0
 * Story 04: 0 0 0 48px
 */
type ClippedCornerVariant = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface ClippedImageProps extends BaseImageProps {
  variant?: ClippedCornerVariant;
}

export function ClippedImage({
  src,
  alt,
  variant = "top-right",
  priority = false,
  className,
  containerClassName,
  sizes = "(max-width: 768px) 100vw, 55vw",
  aspectRatio = "aspect-[16/10]",
  overlay,
}: ClippedImageProps) {
  const shouldReduce = useReducedMotion();

  const radiusClass = {
    "top-right": "rounded-tr-[48px] rounded-tl-sm rounded-br-sm rounded-bl-sm",
    "top-left": "rounded-tl-[48px] rounded-tr-sm rounded-br-sm rounded-bl-sm",
    "bottom-right": "rounded-br-[48px] rounded-tl-sm rounded-tr-sm rounded-bl-sm",
    "bottom-left": "rounded-bl-[48px] rounded-tl-sm rounded-tr-sm rounded-br-sm",
  }[variant];

  return (
    <div className="group/clipped relative w-full">
      {/* Subtle offset backing */}
      <div
        className={cn(
          "absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 bg-[#D8C5AA]/30 border border-[#D8D0C5] -z-10 pointer-events-none",
          radiusClass
        )}
        aria-hidden="true"
      />

      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 24, scale: 0.99 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
        className={cn(
          "relative z-10 w-full overflow-hidden border border-[#D8D0C5] bg-[#211E1B] shadow-[0_16px_40px_rgba(38,31,27,0.08)]",
          radiusClass,
          aspectRatio,
          containerClassName
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            "object-cover mkt-img-graded transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover/clipped:scale-[1.025]",
            className
          )}
        />
        {overlay}
      </motion.div>
    </div>
  );
}

/**
 * 05 — REUSABLE PRODUCT FRAME
 * Software UI / Data Agent / Labs screenshots (precise rounded-2xl frames with top window bar & shadow).
 */
interface ProductFrameProps {
  children: ReactNode;
  title?: string;
  badge?: string;
  className?: string;
  tone?: "dark" | "light";
}

export function ProductFrame({
  children,
  title = "Consult America Enterprise Platform",
  badge,
  className,
  tone = "dark",
}: ProductFrameProps) {
  const shouldReduce = useReducedMotion();
  const isDark = tone === "dark";

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 24, scale: 0.99 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
      whileHover={shouldReduce ? {} : { y: -3 }}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border transition-all duration-300",
        isDark
          ? "border-[#3A302B] bg-[#161311] shadow-[0_24px_60px_rgba(0,0,0,0.5)] hover:shadow-[0_30px_70px_rgba(0,0,0,0.65)] hover:border-[#4A3E37]"
          : "border-[#D8D0C5] bg-white shadow-[0_20px_50px_rgba(38,31,27,0.08)] hover:shadow-[0_24px_60px_rgba(38,31,27,0.12)] hover:border-[#B63A3A]/40",
        className
      )}
    >
      {/* Top Application Window Bar */}
      <div
        className={cn(
          "flex h-10 items-center justify-between border-b px-4 text-xs select-none",
          isDark
            ? "border-[#2E2722] bg-[#1F1A17] text-[#A4B1BE]"
            : "border-[#D8D0C5] bg-[#F7F3EC] text-[#695F57]"
        )}
      >
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#B63A3A]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#D8C5AA]/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-[#357C78]/80" />
          <span className="ml-2 font-mono text-[0.68rem] font-medium tracking-tight truncate max-w-[200px] sm:max-w-none">
            {title}
          </span>
        </div>

        {badge && (
          <span
            className={cn(
              "rounded px-2 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-wider",
              isDark
                ? "bg-[#2B2420] text-[#D8C5AA] border border-[#3A302B]"
                : "bg-white text-[#B63A3A] border border-[#D8D0C5]"
            )}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Frame Contents */}
      <div className="relative">{children}</div>
    </motion.div>
  );
}
