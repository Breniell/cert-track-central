
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormationType } from "@/types/Formation";

interface CalendarFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    types: FormationType[];
    formateurs: string[];
    lieux: string[];
    urgence: boolean;
  };
  formateurs: Array<{ id: number; nom: string }>;
  lieux: string[];
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

export function CalendarFilters({
  isOpen,
  onClose,
  filters,
  formateurs,
  lieux,
  onFiltersChange,
  onReset
}: CalendarFiltersProps) {
  const handleTypeChange = (type: FormationType) => {
    const types = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    onFiltersChange({ ...filters, types });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Filtres du calendrier</DialogTitle>
          <DialogDescription>
            Sélectionnez les critères pour filtrer les formations affichées
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Type de formation</h3>
            <div className="grid grid-cols-2 gap-2">
              {['HSE', 'Métier'].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`type-${type}`} 
                    checked={filters.types.includes(type as FormationType)}
                    onCheckedChange={() => handleTypeChange(type as FormationType)}
                  />
                  <label htmlFor={`type-${type}`} className="text-sm font-medium">
                    {type}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Formateurs</h3>
            <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
              {formateurs.map(formateur => (
                <div key={formateur.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`formateur-${formateur.id}`} 
                    checked={filters.formateurs.includes(formateur.nom)}
                    onCheckedChange={() => {
                      const formateurs = filters.formateurs.includes(formateur.nom)
                        ? filters.formateurs.filter(f => f !== formateur.nom)
                        : [...filters.formateurs, formateur.nom];
                      onFiltersChange({ ...filters, formateurs });
                    }}
                  />
                  <label htmlFor={`formateur-${formateur.id}`} className="text-sm font-medium">
                    {formateur.nom}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onReset}>
            Réinitialiser
          </Button>
          <Button onClick={onClose}>
            Appliquer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
