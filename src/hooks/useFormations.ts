
import { useState } from "react";
import { Formation } from "@/types/Formation";
import { formationService } from "@/services/formationService";

export const useFormations = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');

  const nextId = () => {
    return Math.max(...formations.map(f => f.id)) + 1;
  };

  const handleNewFormation = (formationData: any) => {
    const newFormation = {
      id: nextId(),
      ...formationData,
    };
    
    setFormations([...formations, newFormation]);
  };

  const filteredFormations = formations.filter(formation => {
    // Filtrage par recherche
    const matchesSearch = formation.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         formation.formateur.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrage par type
    const matchesType = selectedType === 'Tous' || 
                        formation.type === selectedType || 
                        (selectedType === 'Urgente' && formation.estUrgente);
    
    // Filtrage par mois
    const formationDate = new Date(formation.date);
    const matchesMonth = formationDate.getMonth() === selectedMonth.getMonth() && 
                         formationDate.getFullYear() === selectedMonth.getFullYear();
    
    return matchesSearch && matchesType && matchesMonth;
  });

  return {
    formations,
    setFormations,
    selectedMonth,
    setSelectedMonth,
    searchTerm,
    setSearchTerm,
    selectedType,
    setSelectedType,
    filteredFormations,
    handleNewFormation,
  };
};
