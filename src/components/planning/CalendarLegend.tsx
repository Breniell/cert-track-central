
import React from 'react';
import { Card, CardFooter } from "@/components/ui/card";

export function CalendarLegend() {
  return (
    <CardFooter className="border-t pt-4">
      <div className="flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#06b6d4]"></div>
          <span className="text-sm">HSE</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
          <span className="text-sm">Métier</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
          <span className="text-sm">Urgente</span>
        </div>
      </div>
    </CardFooter>
  );
}
