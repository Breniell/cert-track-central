
import { Formateur } from "@/types/Formation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts";

interface FormateurPerformanceChartProps {
  formateur: Formateur;
}

export function FormateurPerformanceChart({
  formateur,
}: FormateurPerformanceChartProps) {
  // If there are no evaluations, show a message
  if (!formateur.evaluations || formateur.evaluations.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Aucune évaluation disponible</p>
      </div>
    );
  }

  // Create data for the chart from evaluations
  const chartData = formateur.evaluations.map((evaluation) => ({
    id: `Formation #${evaluation.formation}`,
    score: evaluation.score,
  }));

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="id" />
          <YAxis domain={[0, 5]} />
          <Tooltip />
          <Bar dataKey="score" fill="#9b87f5" radius={[4, 4, 0, 0]}>
            <LabelList dataKey="score" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
