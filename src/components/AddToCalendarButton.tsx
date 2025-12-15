import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { format, addDays } from "date-fns";
import { LogosGoogleCalendar } from "./GoogleCalendarIcon";

interface AddToCalendarButtonProps {
  title: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  location?: string;
  allDay?: boolean;
  className?: string;
}

export function AddToCalendarButton({
  title,
  description = "",
  startDate,
  endDate,
  location = "",
  allDay = true,
  className,
}: AddToCalendarButtonProps) {
  const generateGoogleCalendarUrl = () => {
    const baseUrl = "https://www.google.com/calendar/render";

    let startStr = "";
    let endStr = "";

    if (allDay) {
      startStr = format(startDate, "yyyyMMdd");
      // For all-day events, the end date is exclusive (the day after)
      const endD = endDate ? addDays(endDate, 1) : addDays(startDate, 1);
      endStr = format(endD, "yyyyMMdd");
    } else {
      // For timed events, use local time format YYYYMMDDTHHmmss
      startStr = format(startDate, "yyyyMMdd'T'HHmmss");

      if (endDate) {
        endStr = format(endDate, "yyyyMMdd'T'HHmmss");
      } else {
        // Default to 1 hour duration if no end date specified for timed event
        const endD = new Date(startDate.getTime() + 60 * 60 * 1000);
        endStr = format(endD, "yyyyMMdd'T'HHmmss");
      }
    }

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      details: description,
      location,
      dates: `${startStr}/${endStr}`,
    });

    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <Button
      variant="secondary"
      size="lg"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        const url = generateGoogleCalendarUrl();
        const isMobile =
          typeof navigator !== "undefined" &&
          /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          window.location.href = url;
        } else {
          window.open(url, "_blank");
        }
      }}
    >
      <LogosGoogleCalendar className="mr-2" />
      Add to Calendar
    </Button>
  );
}
