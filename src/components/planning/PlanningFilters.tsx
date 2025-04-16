
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface PlanningFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
}

export default function PlanningFilters({
  searchTerm,
  onSearchChange,
  selectedType,
  onTypeChange
}: PlanningFiltersProps) {
  return (
    <Card className="bg-gray-50 border-none">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
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
          <div className="w-full md:w-[200px]">
            <Select
              value={selectedType}
              onValueChange={onTypeChange}
            >
              <SelectTrigger>
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
        </div>
      </CardContent>
    </Card>
  );
}
