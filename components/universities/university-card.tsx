interface Props {
  id: string; name: string; country: string; city: string; tagline: string | null;
  tuition: number | null; tuitionCurrency: string; acceptanceRate: number | null;
  matchScore: number | null; matchLabel: "reach" | "target" | "safety" | null;
  topMajors: string[]; totalPrograms: number; applicationTypes: string[];
  nextDeadline: { days: number; label: string } | null;
  isBookmarked: boolean; onBookmark: (id: string) => void; onClick: (id: string) => void;
}

const FLAG_MAP: Record<string, string> = { US:"🇺🇸",UK:"🇬🇧",CA:"🇨🇦",AU:"🇦🇺",SG:"🇸🇬",CH:"🇨🇭",DE:"🇩🇪",FR:"🇫🇷",JP:"🇯🇵",KR:"🇰🇷",NL:"🇳🇱" };
const MATCH_STYLES = { reach:"bg-red-50 text-status-red", target:"bg-amber-50 text-status-amber", safety:"bg-emerald-50 text-status-green" };
const DL_STYLES = { urgent:"bg-red-50 text-status-red", soon:"bg-amber-50 text-status-amber", ok:"bg-emerald-50 text-status-green" };

export function UniversityCard(props: Props) {
  const flag = FLAG_MAP[props.country] ?? "🏫";
  const dlUrgency = props.nextDeadline ? (props.nextDeadline.days <= 7 ? "urgent" : props.nextDeadline.days <= 30 ? "soon" : "ok") : null;

  return (
    <div onClick={() => props.onClick(props.id)} className="bg-white border border-cream-mid rounded-card p-4 cursor-pointer hover:border-cream-dark transition-all hover:shadow-md">
      <div className="flex items-start gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-lg bg-cream flex items-center justify-center text-lg flex-shrink-0">{flag}</div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-navy truncate">{props.name}</div>
          <div className="text-[0.7rem] text-slate-400">{props.city}, {props.country}</div>
        </div>
        <button onClick={e => { e.stopPropagation(); props.onBookmark(props.id); }} className={`w-7 h-7 rounded-md border flex items-center justify-center text-sm flex-shrink-0 transition-colors ${props.isBookmarked ? "bg-amber-50 border-amber-200 text-status-amber" : "border-cream-mid text-slate-400 hover:bg-cream"}`} aria-label={props.isBookmarked ? "Bookmarked" : "Bookmark"}>★</button>
      </div>
      {props.tagline && <div className="text-[0.7rem] text-slate-400 mb-2.5 line-clamp-1">{props.tagline}</div>}
      <div className="flex flex-wrap gap-1 mb-2.5">
        {props.topMajors.map(m => <span key={m} className="bg-blue-50 text-[0.62rem] font-medium text-status-blue px-1.5 py-0.5 rounded-full">{m}</span>)}
        {props.totalPrograms > props.topMajors.length && <span className="bg-gray-100 text-[0.62rem] font-medium text-slate-500 px-1.5 py-0.5 rounded-full">+{props.totalPrograms - props.topMajors.length} more</span>}
        {props.tuition && <span className="bg-gray-100 text-[0.62rem] font-medium text-slate-500 px-1.5 py-0.5 rounded-full">{props.tuitionCurrency} {Math.round(props.tuition / 1000)}k/yr</span>}
        {props.acceptanceRate !== null && <span className="bg-gray-100 text-[0.62rem] font-medium text-slate-500 px-1.5 py-0.5 rounded-full">{props.acceptanceRate}% intl.</span>}
        {props.applicationTypes.map(t => <span key={t} className="bg-emerald-50 text-[0.62rem] font-medium text-status-green px-1.5 py-0.5 rounded-full">{t}</span>)}
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-cream-mid">
        <div className="flex items-center gap-2">
          {props.matchScore !== null && (
            <>
              <div className="w-12 h-1 bg-cream-mid rounded-full overflow-hidden"><div className="h-full rounded-full" style={{ width: `${props.matchScore}%`, backgroundColor: props.matchScore >= 75 ? "#1A7F6E" : props.matchScore >= 50 ? "#B7770D" : "#C0392B" }} /></div>
              <span className="text-[0.7rem] font-medium" style={{ color: props.matchScore >= 75 ? "#1A7F6E" : props.matchScore >= 50 ? "#B7770D" : "#C0392B" }}>{props.matchScore}%</span>
            </>
          )}
          {props.matchLabel && <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full ${MATCH_STYLES[props.matchLabel]}`}>{props.matchLabel.charAt(0).toUpperCase() + props.matchLabel.slice(1)}</span>}
        </div>
        {props.nextDeadline && dlUrgency && <span className={`text-[0.62rem] font-medium px-1.5 py-0.5 rounded-full ${DL_STYLES[dlUrgency]}`}>{props.nextDeadline.label}</span>}
      </div>
    </div>
  );
}
