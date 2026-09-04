import { Emblem } from "@/components/brand/Emblem";

export default function Loading() {
  return (
    <div className="flex min-h-[70dvh] items-center justify-center bg-ivory pt-[var(--chrome-h)]">
      <Emblem tone="dark" className="h-11 w-11" title="Maison Lilya Zahra" />
    </div>
  );
}
