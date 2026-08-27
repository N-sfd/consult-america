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
      <label className="ca-eyebrow text-white/45">{label}</label>

      <Select
        items={items}
        value={value}
        onValueChange={(next) => onValueChange(next ?? "")}
      >
        <SelectTrigger className="mt-3 h-12 w-full rounded-md border-white/15 bg-[#0F172A] px-4 text-white shadow-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 data-popup-open:border-blue-500">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="border border-slate-200 bg-white text-slate-900">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              className="cursor-pointer text-slate-900 focus:bg-blue-50 focus:text-blue-700"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
