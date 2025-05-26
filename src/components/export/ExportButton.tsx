
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, FileSpreadsheet, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface ExportButtonProps {
  data: any[];
  filename: string;
  type?: 'formations' | 'presences' | 'planning' | 'statistics';
  className?: string;
}

export default function ExportButton({ 
  data, 
  filename, 
  type = 'formations',
  className = "" 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      let csvContent = "";
      
      switch (type) {
        case 'formations':
          csvContent = [
            "Formation,Formateur,Date,Lieu,Type,Participants,Max Participants,Statut",
            ...data.map(item => 
              `"${item.titre || item.title}","${item.formateur || item.trainer}","${item.date}","${item.lieu || item.location}","${item.type}","${item.participants}","${item.maxParticipants || item.maxParticipants}","${item.statut || item.status}"`
            )
          ].join('\n');
          break;
          
        case 'presences':
          csvContent = [
            "Formation,Participant,Email,Service,Présence,Heure d'arrivée",
            ...data.map(item => 
              `"${item.formation}","${item.nom || item.name}","${item.email}","${item.service || item.department}","${item.present ? 'Présent' : 'Absent'}","${item.heureArrivee || item.arrivalTime || 'N/A'}"`
            )
          ].join('\n');
          break;
          
        case 'planning':
          csvContent = [
            "Date,Formation,Formateur,Heure début,Heure fin,Lieu,Participants",
            ...data.map(item => 
              `"${item.date}","${item.titre || item.title}","${item.formateur || item.trainer}","${item.heureDebut || item.startTime}","${item.heureFin || item.endTime}","${item.lieu || item.location}","${item.participants}"`
            )
          ].join('\n');
          break;
          
        case 'statistics':
          csvContent = [
            "Métrique,Valeur,Période",
            ...data.map(item => 
              `"${item.metric}","${item.value}","${item.period}"`
            )
          ].join('\n');
          break;
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export réussi",
        description: `Le fichier ${filename}.csv a été téléchargé`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur d'export",
        description: "Une erreur est survenue lors de l'export"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const exportToPDF = () => {
    toast({
      title: "Export PDF",
      description: "L'export PDF sera disponible prochainement"
    });
  };

  const exportToExcel = () => {
    toast({
      title: "Export Excel",
      description: "L'export Excel sera disponible prochainement"
    });
  };

  if (data.length === 0) {
    return (
      <Button 
        variant="outline" 
        disabled 
        className={className}
      >
        <Download className="w-4 h-4 mr-2" />
        Aucune donnée à exporter
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          disabled={isExporting}
          className={`text-cimencam-green border-cimencam-green hover:bg-cimencam-green hover:text-white ${className}`}
        >
          <Download className="w-4 h-4 mr-2" />
          {isExporting ? "Export en cours..." : "Exporter"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white border shadow-lg">
        <DropdownMenuItem onClick={exportToCSV} className="hover:bg-gray-100">
          <FileSpreadsheet className="w-4 h-4 mr-2 text-cimencam-green" />
          Exporter en CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="hover:bg-gray-100">
          <FileText className="w-4 h-4 mr-2 text-cimencam-red" />
          Exporter en PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="hover:bg-gray-100">
          <Calendar className="w-4 h-4 mr-2 text-cimencam-green" />
          Exporter en Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
