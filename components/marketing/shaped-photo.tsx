"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

export type PhotoShape = "arch" | "asymmetric" | "cut";

const shapeClasses: Record<PhotoShape, string> = {
  arch: "ca-shape-arch",
  asymmetric: "ca-shape-asymmetric",
  cut: "ca-shape-cut",
};

interface ShapedPhotoProps {
  src: string;
  alt: string;
  shape?: PhotoShape;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imageClassName?: string;
  hoverable?: boolean;
  reveal?: boolean;
  overlay?: "soft" | "caption" | "none";
  revealDirection?: "left" | "right";
}

export function ShapedPhoto({
  src,
  alt,
  shape = "arch",
  sizes = "100vw",
  priority = false,
  className,
  imageClassName,
  hoverable = true,
  reveal = true,
  overlay = "soft",
  revealDirection = "left",
}: ShapedPhotoProps) {
  const shouldReduceMotion = useReducedMotion();

  const clipFrom =
    revealDirection === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)";

  return (
    <motion.div
      initial={shouldReduceMotion || !reveal ? {} : { clipPath: clipFrom }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
      className={cn(
        "relative overflow-hidden border border-[#C9DDD7] bg-[#E1ECE8] ca-shadow-elevated",
        shapeClasses[shape],
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className={cn(
          "object-cover mkt-img-graded",
          hoverable && "mkt-img-hoverable",
          imageClassName
        )}
        sizes={sizes}
      />
      {overlay === "soft" && <div className="mkt-overlay-soft" />}
      {overlay === "caption" && <div className="mkt-overlay-caption" />}
    </motion.div>
  );
}

interface LayeredPhotoProps {
  main: {
    src: string;
    alt: string;
    shape?: PhotoShape;
    className?: string;
    sizes?: string;
    priority?: boolean;
  };
  secondary?: {
    src: string;
    alt: string;
    className?: string;
  };
  backdropClassName?: string;
  className?: string;
  floatSecondary?: boolean;
}

export function LayeredPhoto({
  main,
  secondary,
  backdropClassName,
  className,
  floatSecondary = false,
}: LayeredPhotoProps) {
  return (
    <div className={cn("relative w-full", className)}>
      {backdropClassName && (
        <div
          className={cn(
            "absolute -top-4 -left-4 w-[92%] h-[94%] -z-0 hidden sm:block ca-bg-drift",
            backdropClassName
          )}
        />
      )}

      <ShapedPhoto
        src={main.src}
        alt={main.alt}
        shape={main.shape ?? "arch"}
        className={main.className}
        sizes={main.sizes}
        priority={main.priority}
      />

      {secondary && (
        <div
          className={cn(
            "absolute -bottom-6 right-2 sm:-right-4 z-20 w-[140px] sm:w-[190px] h-[120px] sm:h-[150px] overflow-hidden border-2 border-white bg-white ca-shadow-overlap hidden sm:block ca-shape-asymmetric",
            floatSecondary && "ca-photo-float"
          )}
        >
          <Image
            src={secondary.src}
            alt={secondary.alt}
            fill
            className="object-cover mkt-img-graded mkt-img-hoverable"
            sizes="190px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#073B3A]/50 to-transparent" />
        </div>
      )}
    </div>
  );
}
