export const primaryLinks = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/industries", label: "Industries" },
  { href: "/oracle", label: "Oracle" },
  { href: "/ai-data", label: "AI & Data" },
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  { href: "/careers", label: "Careers" },
] as const;

export const solutionLinks = primaryLinks.slice(0, 4);
export const companyLinks = primaryLinks.slice(4);
