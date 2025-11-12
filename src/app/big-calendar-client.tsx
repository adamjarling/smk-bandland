"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import React from "react";
import { enUS } from "date-fns/locale/en-US";
import { format } from "date-fns/format";
import { getDay } from "date-fns/getDay";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";

// ...existing code...
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CATEGORY_LIST = ["Bewegungsraum", "UG West", "Bandland"] as const;
const CATEGORY_COLORS: Record<
  (typeof CATEGORY_LIST)[number],
  { background: string; border: string; text: string }
> = {
  Bewegungsraum: {
    background: "hsl(140 60% 92%)",
    border: "hsl(140 60% 36%)",
    text: "hsl(140 20% 18%)",
  },
  "UG West": {
    background: "hsl(260 60% 92%)",
    border: "hsl(260 60% 36%)",
    text: "hsl(260 20% 18%)",
  },
  Bandland: {
    background: "hsl(200 60% 92%)",
    border: "hsl(200 60% 36%)",
    text: "hsl(200 20% 18%)",
  },
};

type EventItem = {
  uid?: string;
  summary?: string;
  start?: string;
  end?: string;
  location?: string;
  category?: string;
};

function hashToHue(s?: string) {
  if (!s) return 210; // default hue
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h) % 360;
}

function categoryColor(category?: string) {
  // use fixed mapping for known categories, fallback to generated hues
  if (category && CATEGORY_COLORS.hasOwnProperty(category)) {
    return CATEGORY_COLORS[category as (typeof CATEGORY_LIST)[number]];
  }
  const hue = hashToHue(category);
  return {
    background: `hsl(${hue} 60% 90%)`,
    border: `hsl(${hue} 60% 45%)`,
    text: `hsl(${hue} 20% 20%)`,
  };
}

export default function BigCalendarClient({ events }: { events: EventItem[] }) {
  // convert to react-big-calendar events
  const rbevents = events.map((e) => ({
    title: e.summary ?? "Untitled",
    start: e.start ? new Date(e.start) : new Date(),
    end: e.end ? new Date(e.end) : new Date(),
    allDay: false,
    resource: e,
  }));

  const eventPropGetter = (event: any) => {
    const category = event.resource?.category;
    const c = categoryColor(category);
    return {
      style: {
        backgroundColor: c.background,
        border: `1px solid ${c.border}`,
        color: c.text,
      },
    };
  };

  return (
    <div style={{ height: 600 }}>
      {/* Legend */}
      <div
        style={{
          display: "flex",
          gap: 12,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        {CATEGORY_LIST.map((cat) => {
          const c = categoryColor(cat);
          return (
            <div
              key={cat}
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <span
                aria-hidden
                style={{
                  width: 16,
                  height: 16,
                  backgroundColor: c.background,
                  border: `1px solid ${c.border}`,
                  borderRadius: 4,
                  display: "inline-block",
                }}
              />
              <span style={{ fontSize: 14, color: "#111" }}>{cat}</span>
            </div>
          );
        })}
      </div>
      <Calendar
        localizer={localizer}
        events={rbevents}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        // ...other props
      />
    </div>
  );
}
