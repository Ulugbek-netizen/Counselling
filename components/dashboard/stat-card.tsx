interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accentColor?: string;
}

export function StatCard({ label, value, subtitle, accentColor }: StatCardProps) {
  return (
    <div className="bg-white border border-cream-mid rounded-card p-4 flex flex-col gap-1 hover:shadow-md transition-shadow">
      <div className="text-xs text-slate-400">{label}</div>
      <div
        className="font-serif text-3xl tracking-tight leading-none"
        style={{ color: accentColor ?? "#0E1E3D" }}
      >
        {value}
      </div>
      {subtitle && (
        <div className="text-xs text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
}
