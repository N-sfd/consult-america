"use client";

import { useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

const innerRing = ["Finance", "Procurement", "Supply Chain", "Projects"];
const outerRing = ["Integration", "Data", "Testing", "Change", "Operations"];

export default function OracleEnterpriseModel({ className }: { className?: string }) {
  const reduced = useReducedMotion();

  return (
    <div
      className={cn(
        "relative mx-auto flex aspect-square w-full max-w-[480px] items-center justify-center",
        className,
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 480 480"
        className="h-full w-full"
        role="img"
        aria-label="Oracle Cloud enterprise transformation model"
      >
        <defs>
          <radialGradient id="oracle-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#176A63" />
            <stop offset="100%" stopColor="#073B3A" />
          </radialGradient>
        </defs>

        {/* Outer ring */}
        <circle
          cx="240"
          cy="240"
          r="210"
          fill="none"
          stroke="#9BC4B8"
          strokeWidth="1"
          opacity="0.35"
          className={reduced ? undefined : "ca-oracle-ring-pulse"}
        />

        {/* Middle ring */}
        <circle
          cx="240"
          cy="240"
          r="155"
          fill="none"
          stroke="#176A63"
          strokeWidth="1.25"
          opacity="0.4"
          strokeDasharray="4 6"
          className={reduced ? undefined : "ca-oracle-ring-drift"}
        />

        {/* Inner ring */}
        <circle cx="240" cy="240" r="100" fill="none" stroke="#C9DDD7" strokeWidth="1" opacity="0.5" />

        {/* Connector paths */}
        <g opacity="0.25" className={reduced ? undefined : "ca-oracle-connectors"}>
          {[0, 72, 144, 216, 288].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x1 = 240 + Math.cos(rad) * 100;
            const y1 = 240 + Math.sin(rad) * 100;
            const x2 = 240 + Math.cos(rad) * 155;
            const y2 = 240 + Math.sin(rad) * 155;
            return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#176A63" strokeWidth="1" />;
          })}
        </g>

        {/* Center hub */}
        <circle cx="240" cy="240" r="68" fill="url(#oracle-core)" />
        <text
          x="240"
          y="232"
          textAnchor="middle"
          fill="white"
          fontSize="11"
          fontWeight="700"
          letterSpacing="0.12em"
        >
          ORACLE
        </text>
        <text
          x="240"
          y="252"
          textAnchor="middle"
          fill="#9BC4B8"
          fontSize="10"
          fontWeight="600"
          letterSpacing="0.1em"
        >
          CLOUD
        </text>

        {/* Inner ring labels */}
        {innerRing.map((label, i) => {
          const angle = (i * 360) / innerRing.length - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 240 + Math.cos(rad) * 128;
          const y = 240 + Math.sin(rad) * 128;
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#073B3A"
              fontSize="9.5"
              fontWeight="700"
              letterSpacing="0.06em"
            >
              {label.toUpperCase()}
            </text>
          );
        })}

        {/* Outer ring labels */}
        {outerRing.map((label, i) => {
          const angle = (i * 360) / outerRing.length - 90;
          const rad = (angle * Math.PI) / 180;
          const x = 240 + Math.cos(rad) * 188;
          const y = 240 + Math.sin(rad) * 188;
          return (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#176A63"
              fontSize="8.5"
              fontWeight="600"
              letterSpacing="0.05em"
              opacity="0.85"
            >
              {label.toUpperCase()}
            </text>
          );
        })}

        {/* Directional dots */}
        {!reduced &&
          [0, 120, 240].map((angle) => {
            const rad = (angle * Math.PI) / 180;
            const x = 240 + Math.cos(rad) * 155;
            const y = 240 + Math.sin(rad) * 155;
            return (
              <circle
                key={angle}
                cx={x}
                cy={y}
                r="3"
                fill="#9BC4B8"
                className="ca-oracle-dot"
                style={{ animationDelay: `${angle / 120}s` }}
              />
            );
          })}
      </svg>
    </div>
  );
}
