"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { format } from "date-fns/format";
import { getDay } from "date-fns/getDay";
import { enUS } from "date-fns/locale/en-US";
import { parse } from "date-fns/parse";
import { startOfWeek } from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

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
  category?: string;
};

export default function BigCalendarClient({ events }: { events: EventItem[] }) {
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
      />
    </div>
  );
}
