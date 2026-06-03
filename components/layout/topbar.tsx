interface TopbarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export function Topbar({ title, subtitle, actions }: TopbarProps) {
  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="h-[54px] flex-shrink-0 bg-white border-b border-cream-mid flex items-center justify-between px-7 gap-4">
      <div className="flex items-center gap-3">
        <h1 className="font-serif text-lg text-navy">{title}</h1>
        <span className="text-xs text-slate-400">
          {subtitle ?? `· ${today}`}
        </span>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}
