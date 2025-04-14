
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const FormationPlanning = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events] = useState([
    {
      id: 1,
      title: "Formation HSE - Sécurité sur site",
      date: new Date(2024, 3, 20),
      type: "HSE",
    },
    {
      id: 2,
      title: "Excel Avancé",
      date: new Date(2024, 3, 25),
      type: "Métier",
    },
  ]);

  return (
    <div className="grid md:grid-cols-[300px_1fr] gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendrier</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Formations planifiées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h3 className="font-medium">{event.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {event.date.toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={event.type === "HSE" ? "destructive" : "default"}>
                    {event.type}
                  </Badge>
                  <Button size="sm">Détails</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormationPlanning;
