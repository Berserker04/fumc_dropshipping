import { cn } from "@/lib/utils";

const tones: Record<string, string> = {
  good: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warn: "bg-amber-50 text-amber-800 ring-amber-200",
  bad: "bg-red-50 text-red-700 ring-red-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  neutral: "bg-slate-100 text-slate-700 ring-slate-200"
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  tone?: keyof typeof tones;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1",
        tones[tone],
        className
      )}
      {...props}
    />
  );
}

export function statusTone(status: string): keyof typeof tones {
  if (["ENTREGADO", "PAGADA", "ENVIADA", "CONFIRMADO"].includes(status)) {
    return "good";
  }
  if (["PEDIDO_ESPECIAL", "EN_PREPARACION", "EMPACADO", "DESPACHADO", "EN_TRANSITO"].includes(status)) {
    return "warn";
  }
  if (["DEVUELTO", "CANCELADO", "FALLIDA"].includes(status)) {
    return "bad";
  }
  return "neutral";
}
