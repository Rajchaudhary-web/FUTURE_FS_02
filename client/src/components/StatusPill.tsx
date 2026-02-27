import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type StatusPillProps = {
  status: string;
  className?: string;
};

export function StatusPill({ status, className }: StatusPillProps) {
  const config = {
    new: "bg-green-100 text-green-700 border-green-200",
    contacted: "bg-yellow-100 text-yellow-700 border-yellow-200",
    converted: "bg-emerald-100 text-emerald-800 border-emerald-300 shadow-sm",
  }[status] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide border",
          config
        ),
        className
      )}
    >
      {status}
    </span>
  );
}
