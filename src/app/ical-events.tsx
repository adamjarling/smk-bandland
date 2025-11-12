import BigCalendarClient from "./big-calendar-client";
import EmailLink from "./EmailLink";
import ical from "node-ical";

type EventItem = {
  uid?: string;
  summary?: string;
  start?: string;
  end?: string;
  location?: string;
  category?: string;
};

const BANDLAND_CALENDAR_FEED_ICS =
  "https://export.kalender.digital/ics/5543690/1d670462e848c0d7b0d0/bandland.ics?past_months=3&future_months=36";

const UG_WEST_CALENDAR_FEED_ICS =
  "https://export.kalender.digital/ics/3142259/1d670462e848c0d7b0d0/ugwest.ics?past_months=3&future_months=36";

const BEWEGUNGSRAUM_CALENDAR_FEED_ICS =
  "https://export.kalender.digital/ics/3142257/1d670462e848c0d7b0d0/bewegungsraum.ics?past_months=3&future_months=36";

export default async function ICalEvents({ url }: { url?: string }) {
  // build list of URLs to fetch: default two plus optional override/additional url
  const urls = [
    BANDLAND_CALENDAR_FEED_ICS,
    UG_WEST_CALENDAR_FEED_ICS,
    BEWEGUNGSRAUM_CALENDAR_FEED_ICS,
  ];
  if (url) urls.push(url);

  let events: EventItem[] = [];
  let errorMessage: string | null = null;
  const fetchErrors: string[] = [];

  try {
    // fetch all ICS feeds in parallel and tolerate individual failures
    const fetchResults = await Promise.allSettled(urls.map((u) => fetch(u)));

    // for each successful fetch, parse the ICS and collect VEVENTs
    for (let i = 0; i < fetchResults.length; i++) {
      const resResult = fetchResults[i];
      const srcUrl = urls[i];

      if (resResult.status === "fulfilled") {
        const res = resResult.value;
        if (!res.ok) {
          fetchErrors.push(`${srcUrl} returned ${res.status}`);
          continue;
        }
        const ics = await res.text();
        try {
          const parsed = ical.parseICS(ics);
          const parsedEvents = Object.values(parsed)
            .filter((e: any) => e && e.type === "VEVENT")
            .map((e: any) => {
              // pick a single category value (first item if array, or the string)
              let category: string | undefined;
              if (Array.isArray(e.categories) && e.categories.length > 0) {
                category = String(e.categories[0]);
              } else if (typeof e.categories === "string") {
                category = e.categories;
              } else {
                category = undefined;
              }

              return {
                uid: e.uid,
                summary: "Busy",
                start: e.start ? e.start.toISOString() : undefined,
                end: e.end ? e.end.toISOString() : undefined,
                location: e.location,
                category,
              } as EventItem;
            });

          events.push(...parsedEvents);
        } catch (parseErr: any) {
          fetchErrors.push(
            `parse error for ${srcUrl}: ${parseErr?.message ?? parseErr}`
          );
        }
      } else {
        fetchErrors.push(
          `network error fetching ${srcUrl}: ${resResult.reason}`
        );
      }
    }

    // dedupe events by uid (fallback to summary+start)
    const seen = new Map<string, EventItem>();
    for (const ev of events) {
      const key = ev.uid ?? `${ev.summary ?? "untitled"}-${ev.start ?? ""}`;
      if (!seen.has(key)) seen.set(key, ev);
    }
    events = Array.from(seen.values());

    // sort by start date
    events = events.sort((a, b) => {
      if (!a.start && !b.start) return 0;
      if (!a.start) return 1;
      if (!b.start) return -1;
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });

    if (events.length === 0 && fetchErrors.length > 0) {
      errorMessage = fetchErrors.join("; ");
    }
  } catch (err: any) {
    console.error("ICal fetch/parse error (unexpected):", err);
    errorMessage = err?.message ?? "Unknown error";
  }

  return (
    <section className="w-full mt-8">
      <h2 className="text-4xl uppercase pb-4">Bandland Availability</h2>

      <div className="flex flex-col gap-2 mb-10">
        <a href="https://forms.office.com/e/LXNahZk4Ns" target="_blank">
          Booking Request Form
        </a>
        <p className="text-sm text-zinc-600">
          *Requested booking dates will appear in calendar only after being
          confirmed.
        </p>
      </div>

      {errorMessage ? (
        <div className="mt-4 text-sm text-red-600">
          Failed to load events: {errorMessage}
        </div>
      ) : events.length === 0 ? (
        <div className="mt-4 text-sm text-zinc-600">No events found.</div>
      ) : (
        <BigCalendarClient events={events} />
      )}

      <p className="mt-6">
        Questions? Contact us:{" "}
        <EmailLink user="bandland" domain="semmelweisklinik.at" />
      </p>
    </section>
  );
}
