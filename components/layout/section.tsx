import { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
}

export default function Section({
  children,
  className = "",
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("py-16 md:py-20 lg:py-24 xl:py-28", className)}
    >
      {children}
    </section>
  );
}
