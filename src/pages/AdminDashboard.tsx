import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formateurService } from "@/services/formateurService";
import { formationService } from "@/services/formationService";
import { DateRangePicker } from "@/components/ui/date-range-picker";

export default function AdminDashboard() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date(),
  });
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  const { data: formations = [], isLoading: isLoadingFormations } = useQuery({
    queryKey: ["formations"],
    queryFn: () => formationService.getAllFormations(),
  });

  const { data: formateurs = [], isLoading: isLoadingFormateurs } = useQuery({
    queryKey: ["formateurs"],
    queryFn: () => formateurService.getAllFormateurs(),
  });

  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["users"],
    queryFn: () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              {
                id: 1,
                name: "Admin User",
                email: "admin@example.com",
                role: "admin",
              },
              {
                id: 2,
                name: "Normal User",
                email: "user@example.com",
                role: "user",
              },
            ]),
          500
        )
      ),
  });

  const { data: appelsOffre, isLoading: isLoadingAppelsOffre } = useQuery({
    queryKey: ["appels-offre"],
    queryFn: () =>
      new Promise((resolve) =>
        setTimeout(
          () =>
            resolve([
              {
                id: 1,
                reference: "AO-2024-001",
                titre: "Appel d'offre pour formation en gestion de projet",
                datePublication: "2024-01-10",
                dateCloture: "2024-02-15",
                statut: "Publié",
              },
              {
                id: 2,
                reference: "AO-2024-002",
                titre: "Appel d'offre pour formation en développement durable",
                datePublication: "2024-01-15",
                dateCloture: "2024-03-01",
                statut: "En cours",
              },
            ]),
          500
        )
      ),
  });

  // Fix the slice error by ensuring formations is an array
  const recentFormations = Array.isArray(formations) ? formations.slice(0, 5) : [];

  const filteredFormations = formations
    ? formations.filter((formation) => {
        const formationDate = new Date(formation.startDate);
        const now = new Date();
        const isUpcoming = formationDate >= now;

        return (
          (!status ||
            (status === "upcoming" && isUpcoming) ||
            (status === "past" && !isUpcoming)) &&
          (!search ||
            formation.title.toLowerCase().includes(search.toLowerCase()))
        );
      })
    : [];

  // Calculate some metrics
  const totalFormations = formations ? formations.length : 0;
  const totalFormateurs = formateurs ? formateurs.length : 0;
  const totalUsers = users ? users.length : 0;
  const totalAppelsOffre = appelsOffre ? appelsOffre.length : 0;

  // Sample data for the chart
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Formations",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Appels d'offre",
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Fix the slice error for formateurs as well  
  const formateursList = Array.isArray(formateurs) ? formateurs.slice(0, 10) : [];

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground">
            Suivez l'activité de la plateforme et gérez les contenus.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Formations</CardTitle>
              <CardDescription>Nombre total de formations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFormations}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formateurs</CardTitle>
              <CardDescription>Nombre total de formateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFormateurs}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
              <CardDescription>Nombre total d'utilisateurs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Appels d'offre</CardTitle>
              <CardDescription>Nombre total d'appels d'offre</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalAppelsOffre}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques</CardTitle>
              <CardDescription>
                Aperçu de l'activité sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* <Bar data={chartData} /> */}
              <div>Chart</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sessions récentes</CardTitle>
              <CardDescription>Dernières formations ajoutées</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentFormations.map((formation) => (
                <div
                  key={formation.id}
                  className="border rounded-md p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{formation.title}</p>
                    <p className="text-sm text-gray-500">
                      {formation.startDate}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {formation.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="outline">Voir toutes les sessions</Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Formateurs</CardTitle>
            <CardDescription>Liste des formateurs inscrits</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Avatar</TableHead>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Nombre de formations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formateursList.map((formateur) => (
                  <TableRow key={formateur.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{formateur.nom}</TableCell>
                    <TableCell>{formateur.email}</TableCell>
                    <TableCell>
                      {
                        formations.filter(
                          (formation) => formation.trainerId === formateur.id
                        ).length
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liste des formations</CardTitle>
            <CardDescription>
              Gérez et suivez les formations proposées
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <Input
                  placeholder="Rechercher une formation..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tous</SelectItem>
                    <SelectItem value="upcoming">À venir</SelectItem>
                    <SelectItem value="past">Passées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Formateur</TableHead>
                    <TableHead>Participants</TableHead>
                    <TableHead>Statut</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFormations.map((formation) => (
                    <TableRow key={formation.id}>
                      <TableCell>{formation.title}</TableCell>
                      <TableCell>{formation.startDate}</TableCell>
                      <TableCell>{formation.trainerId}</TableCell>
                      <TableCell>{formation.maxParticipants}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{formation.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
