"use client";

import { useState } from "react";

export interface BannerEvent {
  id: string;
  label: string;
  color: string;
}

interface NotificationBannerProps {
  events: BannerEvent[];
}

export function NotificationBanner({ events }: NotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || events.length === 0) return null;

  return (
    <div className="bg-navy px-7 py-2.5 flex items-center gap-4 flex-shrink-0 overflow-x-auto scrollbar-hide">
      <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-gold whitespace-nowrap flex-shrink-0">
        This week
      </div>
      <div className="flex gap-2">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex items-center gap-1.5 bg-white/[0.07] border border-white/10 text-white/80 text-xs px-3 py-1 rounded-full whitespace-nowrap cursor-pointer hover:bg-white/[0.12] transition-colors"
          >
            <span
              className="w-[5px] h-[5px] rounded-full flex-shrink-0"
              style={{ backgroundColor: event.color }}
            />
            {event.label}
          </div>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="ml-auto flex-shrink-0 text-white/25 hover:text-white/60 transition-colors text-base px-1"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
}
