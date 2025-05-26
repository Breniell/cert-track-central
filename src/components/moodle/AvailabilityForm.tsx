
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { TrainerAvailability } from "../../types";
import { useCreateAvailability } from "../../hooks/useMoodle";
import { useMoodle } from "../../contexts/MoodleContext";
import { toast } from "react-toastify";
import { cn } from "@/lib/utils";

interface AvailabilityFormProps {
  availability?: TrainerAvailability;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AvailabilityForm({ availability, onClose, onSuccess }: AvailabilityFormProps) {
  const { user } = useMoodle();
  const [formData, setFormData] = useState({
    date: new Date(),
    startTime: "09:00",
    endTime: "17:00",
    recurring: false
  });

  const createMutation = useCreateAvailability();

  useEffect(() => {
    if (availability) {
      setFormData({
        date: new Date(availability.date),
        startTime: availability.startTime,
        endTime: availability.endTime,
        recurring: availability.recurring
      });
    }
  }, [availability]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Utilisateur non connecté");
      return;
    }

    try {
      const availabilityData = {
        trainerId: user.id,
        date: format(formData.date, 'yyyy-MM-dd'),
        startTime: formData.startTime,
        endTime: formData.endTime,
        recurring: formData.recurring
      };

      await createMutation.mutateAsync(availabilityData);
      toast.success("Disponibilité ajoutée avec succès");
      
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error("Erreur lors de l'ajout de la disponibilité");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-900">
              {availability ? "Modifier la disponibilité" : "Ajouter une disponibilité"}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "PPP") : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, date }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startTime">Heure de début</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="endTime">Heure de fin</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={createMutation.isPending}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                {createMutation.isPending ? "Ajout..." : "Ajouter"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
