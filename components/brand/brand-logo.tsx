import ConsultAmericaLogo, {
  type ConsultAmericaLogoProps,
  type ConsultAmericaLogoSize,
  type ConsultAmericaLogoVariant,
} from "@/components/brand/consult-america-logo";

export type { ConsultAmericaLogoProps, ConsultAmericaLogoSize, ConsultAmericaLogoVariant };

/** @deprecated Use ConsultAmericaLogo — kept for existing imports. */
export default function BrandLogo({
  tone = "dark",
  showTagline,
  ...props
}: Omit<ConsultAmericaLogoProps, "variant"> & {
  tone?: "light" | "dark";
}) {
  const variant = tone === "light" ? "dark" : "light";

  return (
    <ConsultAmericaLogo
      variant={variant}
      showTagline={showTagline}
      {...props}
    />
  );
}

export { ConsultAmericaLogo };
