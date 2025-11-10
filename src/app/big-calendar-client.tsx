"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import React from "react";
import enUS from "date-fns/locale/en-US";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";

// ...existing code...
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

type EventItem = {
  uid?: string;
  summary?: string;
  start?: string;
  end?: string;
  location?: string;
};

export default function BigCalendarClient({ events }: { events: EventItem[] }) {
  const rbcEvents = events.map((e) => ({
    id: e.uid ?? `${e.summary}-${e.start}`,
    title: e.summary ?? "Untitled event",
    start: e.start ? new Date(e.start) : new Date(),
    end: e.end ? new Date(e.end) : new Date(e.start ?? e.end ?? Date.now()),
    allDay: false,
    resource: { location: e.location },
  }));

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={rbcEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: "100%" }}
      />
    </div>
  );
}
