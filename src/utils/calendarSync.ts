// Utility file for UK school calendar term synchronization (iCalendar / .ics format)

export interface CalendarEvent {
  title: string;
  startDate: string; // YYYYMMDD format
  endDate: string;   // YYYYMMDD format
  description: string;
}

// UK School Term Dates for 2026/2027 Academic Year
export const UK_SCHOOL_TERMS_2026_2027: CalendarEvent[] = [
  {
    title: "🍂 School Term: Autumn Term 1",
    startDate: "20260902",
    endDate: "20261023",
    description: "Welcome back to school! Start of the Autumn Term for the UK primary school curriculum."
  },
  {
    title: "🎃 School Holidays: Autumn Half Term",
    startDate: "20261026",
    endDate: "20261030",
    description: "October Half-Term. Time to rest and play outdoors!"
  },
  {
    title: "🍂 School Term: Autumn Term 2",
    startDate: "20261102",
    endDate: "20261218",
    description: "Autumn Term continues. Preparing winter assemblies and celebrating accomplishments!"
  },
  {
    title: "🎄 School Holidays: Christmas Holidays",
    startDate: "20261221",
    endDate: "20270101",
    description: "Festive winter holidays! Happy Christmas and Happy New Year."
  },
  {
    title: "🌱 School Term: Spring Term 1",
    startDate: "20270104",
    endDate: "20270212",
    description: "Welcome back! Start of the Spring Term. Let's jump into learning new topics!"
  },
  {
    title: "❄️ School Holidays: Spring Half Term",
    startDate: "20270215",
    endDate: "20270219",
    description: "February Half-Term holidays. Have fun and read some magical storybooks!"
  },
  {
    title: "🌱 School Term: Spring Term 2",
    startDate: "20270222",
    endDate: "20270324",
    description: "Spring Term continues. Spring nature studies, science experiments, and Easter prep!"
  },
  {
    title: "🐣 School Holidays: Easter Holidays",
    startDate: "20270325",
    endDate: "20270409",
    description: "Easter school holidays. Hunting for spring eggs and enjoying sunshine!"
  },
  {
    title: "☀️ School Term: Summer Term 1",
    startDate: "20270412",
    endDate: "20270528",
    description: "Welcome back! Start of the Summer Term. The days are warm and bright!"
  },
  {
    title: "🌿 School Holidays: Summer Half Term",
    startDate: "20270531",
    endDate: "20270604",
    description: "Whitsun / Late May Half-Term holiday. Enjoy the beautiful late spring weather!"
  },
  {
    title: "☀️ School Term: Summer Term 2",
    startDate: "20270607",
    endDate: "20270723",
    description: "Summer Term continues. School sports days, field trips, and final class completions!"
  },
  {
    title: "🏖️ School Holidays: Summer Holidays Begin",
    startDate: "20270726",
    endDate: "20270903",
    description: "Hooray! The grand UK summer holidays are here! Enjoy your long-awaited summer break."
  }
];

/**
 * Builds a standard RFC 5545 iCalendar string from list of events
 */
export function buildICSString(events: CalendarEvent[]): string {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Schoola UK//NONSGML UK School Term Calendar Sync//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH"
  ];

  events.forEach((event, idx) => {
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:schoola-uk-event-${idx}-${event.startDate}@schoola.uk`);
    lines.push(`DTSTAMP:${formatCurrentDateTimeICS()}`);
    lines.push(`DTSTART;VALUE=DATE:${event.startDate}`);
    // End date in ICS is exclusive for all-day events, so we add 1 day to end date
    lines.push(`DTEND;VALUE=DATE:${addOneDayToICSDate(event.endDate)}`);
    lines.push(`SUMMARY:${event.title}`);
    lines.push(`DESCRIPTION:${event.description.replace(/,/g, "\\,")}`);
    lines.push("STATUS:CONFIRMED");
    lines.push("SEQUENCE:0");
    lines.push("TRANSP:TRANSPARENT");
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

/**
 * Generates and downloads the full academic year calendar .ics file
 */
export function downloadSchoolTermsCalendar(): void {
  const icsContent = buildICSString(UK_SCHOOL_TERMS_2026_2027);
  triggerBlobDownload(icsContent, "uk_school_terms_2026_2027.ics");
}

/**
 * Generates and downloads a custom .ics study session reminder for a specific topic
 */
export function downloadTopicRevisionEvent(topicTitle: string, dateStr: string, timeStr: string = "16:00"): void {
  // Parse dateStr (e.g., "2026-07-20") and timeStr (e.g., "16:00")
  const cleanDate = dateStr.replace(/-/g, ""); // "20260720"
  const cleanTime = timeStr.replace(/:/g, ""); // "1600"
  
  // Format start datetime: e.g. "20260720T160000"
  const startDateTime = `${cleanDate}T${cleanTime}00`;
  
  // End datetime (default to 30 mins later)
  const [hours, mins] = timeStr.split(":").map(Number);
  let endMins = mins + 30;
  let endHours = hours;
  if (endMins >= 60) {
    endMins -= 60;
    endHours += 1;
  }
  const formattedEndMins = String(endMins).padStart(2, "0");
  const formattedEndHours = String(endHours).padStart(2, "0");
  const endDateTime = `${cleanDate}T${formattedEndHours}${formattedEndMins}00`;

  const eventContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Schoola UK//Study Revision Planner//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:schoola-revision-${Date.now()}@schoola.uk`,
    `DTSTAMP:${formatCurrentDateTimeICS()}`,
    `DTSTART:${startDateTime}`,
    `DTEND:${endDateTime}`,
    `SUMMARY:📖 Schoola: Study "${topicTitle}"`,
    `DESCRIPTION:Revision time! Open Schoola.uk to complete the interactive magic quiz and check out the recommended video lessons. You got this!`,
    "STATUS:CONFIRMED",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:Schoola Study Block Reminder!",
    "TRIGGER:-PT15M", // 15 mins before
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  triggerBlobDownload(eventContent, `study_revision_${topicTitle.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.ics`);
}

/**
 * Helper to generate direct Google Calendar web links
 */
export function getGoogleCalendarLink(topicTitle: string, dateStr: string = "2026-07-20", timeStr: string = "16:00"): string {
  const cleanDate = dateStr.replace(/-/g, "");
  const cleanTime = timeStr.replace(/:/g, "");
  
  // Start: YYYYMMDDTHHMMSS
  const startDT = `${cleanDate}T${cleanTime}00`;
  
  // End (30 mins later)
  const [hours, mins] = timeStr.split(":").map(Number);
  let endMins = mins + 30;
  let endHours = hours;
  if (endMins >= 60) {
    endMins -= 60;
    endHours += 1;
  }
  const endDT = `${cleanDate}T${String(endHours).padStart(2, "0")}${String(endMins).padStart(2, "0")}00`;

  const details = `Time to study "${topicTitle}" with Schoola.uk! Read your curriculum learning goals, play the YouTube video lessons, and answer the magic quiz blocks.`;
  
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent("📖 Study: " + topicTitle)}&dates=${startDT}/${endDT}&details=${encodeURIComponent(details)}&sf=true&output=xml`;
}

// Internal formatting helpers
function formatCurrentDateTimeICS(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const date = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");
  const seconds = String(now.getUTCSeconds()).padStart(2, "0");
  return `${year}${month}${date}T${hours}${minutes}${seconds}Z`;
}

function addOneDayToICSDate(dateStr: string): string {
  // dateStr is YYYYMMDD
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1;
  const day = parseInt(dateStr.substring(6, 8));
  
  const date = new Date(year, month, day);
  date.setDate(date.getDate() + 1);
  
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function triggerBlobDownload(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
