
import { useState } from "react";
import { Formateur } from "@/types/Formation";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FormateurAvailabilityCalendarProps {
  formateur: Formateur;
}

export function FormateurAvailabilityCalendar({
  formateur,
}: FormateurAvailabilityCalendarProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Create a map of dates with formateur availability
  const availableDates: { [key: string]: boolean } = {};
  
  if (formateur.disponibilites) {
    formateur.disponibilites.forEach((dispo) => {
      const date = new Date(dispo.debut).toISOString().split("T")[0];
      availableDates[date] = true;
    });
  }

  // Function to render day with badge if formateur is available
  const renderDay = (day: Date) => {
    const dateString = day.toISOString().split("T")[0];
    const isAvailable = availableDates[dateString];

    if (isAvailable) {
      return (
        <div className="relative">
          <div>{day.getDate()}</div>
          <Badge
            variant="secondary"
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1 bg-green-500 text-white text-[0.5rem] w-[4px] h-[4px] flex items-center justify-center p-0"
          />
        </div>
      );
    }

    return day.getDate();
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      classNames={{
        day_today: "bg-primary/5 text-primary font-bold",
      }}
      components={{
        Day: ({ date, ...props }) => (
          <div
            {...props}
            className={cn(
              props.className,
              availableDates[date.toISOString().split("T")[0]] &&
                "bg-green-50 text-green-800 font-medium"
            )}
          >
            {renderDay(date)}
          </div>
        ),
      }}
    />
  );
}
