import { Topbar } from "@/components/layout/topbar";

export default function UniversitiesPage() {
  return (
    <>
      <Topbar title="Universities" />
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl opacity-20 mb-3">🎓</div>
          <div className="font-serif text-xl text-navy/30">Universities</div>
          <div className="text-xs text-slate-300 mt-1">Coming soon</div>
        </div>
      </div>
    </>
  );
}
