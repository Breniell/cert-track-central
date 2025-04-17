
import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ArrowRight, Filter, Plus } from "lucide-react";

interface CalendarToolbarProps {
  date: Date;
  view: string;
  onNavigate: (action: 'PREV' | 'TODAY' | 'NEXT') => void;
  onView: (view: string) => void;
  onNewEvent?: () => void;
  onShowFilters: () => void;
}

export function CalendarToolbar({
  date,
  view,
  onNavigate,
  onView,
  onNewEvent,
  onShowFilters
}: CalendarToolbarProps) {
  const label = () => {
    const dateFormat = 'MMMM yyyy';
    return format(date, dateFormat, { locale: fr });
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={() => onNavigate('PREV')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('TODAY')}>
          Aujourd'hui
        </Button>
        <Button variant="outline" size="sm" onClick={() => onNavigate('NEXT')}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      <h2 className="text-xl font-semibold capitalize">{label()}</h2>
      <div className="flex items-center gap-2">
        <Select value={view} onValueChange={value => onView(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Vue" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">Mois</SelectItem>
            <SelectItem value="week">Semaine</SelectItem>
            <SelectItem value="day">Jour</SelectItem>
            <SelectItem value="agenda">Agenda</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" onClick={onShowFilters}>
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
        {onNewEvent && (
          <Button size="sm" onClick={onNewEvent}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle formation
          </Button>
        )}
      </div>
    </div>
  );
}
