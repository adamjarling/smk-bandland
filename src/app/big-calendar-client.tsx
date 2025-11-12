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

type EventItem = {
  uid?: string;
  summary?: string;
  start?: string;
  end?: string;
  location?: string;
  category?: string;
};

export default function BigCalendarClient({ events }: { events: EventItem[] }) {
  // convert to react-big-calendar events
  const rbevents = events.map((e) => ({
    title: e.summary ?? "Untitled",
    start: e.start ? new Date(e.start) : new Date(),
    end: e.end ? new Date(e.end) : new Date(),
    allDay: false,
    resource: e,
  }));

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={rbevents}
        startAccessor="start"
        endAccessor="end"
        // ...other props
      />
    </div>
  );
}
