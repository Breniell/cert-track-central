
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface PlanningFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedMonth: Date;
  onMonthChange: (date: Date) => void;
}

export default function PlanningFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedMonth,
  onMonthChange
}: PlanningFiltersProps) {
  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const nextMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() + 1);
    onMonthChange(newDate);
  };

  const prevMonth = () => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(selectedMonth.getMonth() - 1);
    onMonthChange(newDate);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Rechercher une formation..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Filter className="w-5 h-5 text-gray-400" />
        <Select
          value={selectedType}
          onValueChange={onTypeChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tous les types" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Tous">Tous les types</SelectItem>
              <SelectItem value="HSE">HSE</SelectItem>
              <SelectItem value="Métier">Métier</SelectItem>
              <SelectItem value="Urgente">Urgente</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center justify-between bg-white px-4 py-2 rounded-lg border border-gray-300">
        <button onClick={prevMonth} className="text-gray-600 hover:text-gray-800">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="font-medium">
          {monthNames[selectedMonth.getMonth()]} {selectedMonth.getFullYear()}
        </span>
        <button onClick={nextMonth} className="text-gray-600 hover:text-gray-800">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
