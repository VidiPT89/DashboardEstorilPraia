"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

type CountdownProps = {
  targetDate: string;
};

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function computeTimeLeft(targetDate: string): TimeLeft {
  const diff = Math.max(0, new Date(targetDate).getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown({ targetDate }: CountdownProps) {
  const t = useTranslations("home.countdown");
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => computeTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(computeTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units: Array<[number, string]> = [
    [timeLeft.days, t("days")],
    [timeLeft.hours, t("hours")],
    [timeLeft.minutes, t("minutes")],
    [timeLeft.seconds, t("seconds")],
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs uppercase tracking-wide text-white/60">{t("kickoff")}</span>
      <div className="flex gap-1.5 tabular-nums">
        {units.map(([value, label]) => (
          <span
            key={label}
            suppressHydrationWarning
            className="rounded-md bg-white/10 px-2 py-1 text-sm font-semibold text-[var(--club-yellow)]"
          >
            {String(value).padStart(2, "0")}
            <span className="ml-0.5 text-[10px] font-normal text-white/60">{label}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
