"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface EditorialHeadingProps {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  size?: "hero" | "section";
  className?: string;
  reveal?: boolean;
}

export default function EditorialHeading({
  children,
  as = "h2",
  size = "section",
  className,
  reveal = true,
}: EditorialHeadingProps) {
  const Tag = as;
  const classes = cn(
    size === "hero" ? "mkt-hero-heading" : "mkt-section-heading",
    className,
  );

  if (!reveal) {
    return <Tag className={classes}>{children}</Tag>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Tag className={classes}>{children}</Tag>
    </motion.div>
  );
}
