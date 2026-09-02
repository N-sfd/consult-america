"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "span";
  variant?: "text" | "image";
};

export default function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  variant = "text",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const Tag = motion[as];

  if (reduceMotion) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }

  const initial =
    variant === "image"
      ? { opacity: 0, y: 12, scale: 0.985 }
      : { opacity: 0, y: 16 };

  const animate =
    variant === "image"
      ? { opacity: 1, y: 0, scale: 1 }
      : { opacity: 1, y: 0 };

  return (
    <Tag
      className={cn("ca-motion", className)}
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: variant === "image" ? 0.8 : 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </Tag>
  );
}
