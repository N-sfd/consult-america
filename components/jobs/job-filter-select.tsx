"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Option = {
  label: string;
  value: string;
};

type JobFilterSelectProps = {
  label: string;
  value: string;
  placeholder: string;
  options: Option[];
  onValueChange: (value: string) => void;
};

export default function JobFilterSelect({
  label,
  value,
  placeholder,
  options,
  onValueChange,
}: JobFilterSelectProps) {
  const items = Object.fromEntries(
    options.map((option) => [option.value, option.label]),
  );

  return (
    <div>
      <label className="cr-label">{label}</label>

      <Select
        items={items}
        value={value}
        onValueChange={(next) => onValueChange(next ?? "")}
      >
        <SelectTrigger className="h-12 w-full rounded-lg border-[var(--cr-border)] bg-white px-4 text-[var(--cr-text)] shadow-none hover:border-[#B8C5D3] focus:border-[var(--cr-blue)] focus:ring-4 focus:ring-[var(--cr-blue)]/10 data-popup-open:border-[var(--cr-blue)]">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="border border-[var(--cr-border)] bg-white text-[var(--cr-text)]">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer text-[var(--cr-text)] focus:bg-[var(--cr-bg-soft)] focus:text-[var(--cr-blue)]"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
