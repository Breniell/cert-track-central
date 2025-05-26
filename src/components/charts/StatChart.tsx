
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface StatChartProps {
  title: string;
  description?: string;
  data: any[];
  type: 'bar' | 'pie' | 'line';
  dataKey?: string;
  xAxisKey?: string;
  colors?: string[];
  height?: number;
}

export default function StatChart({ 
  title, 
  description, 
  data, 
  type, 
  dataKey = 'value', 
  xAxisKey = 'name',
  colors = ['#28a745', '#dc3545', '#343a40', '#6f42c1', '#fd7e14'],
  height = 300 
}: StatChartProps) {
  
  const CIMENCAM_COLORS = {
    green: '#28a745',
    red: '#dc3545',
    gray: '#343a40',
    white: '#ffffff'
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke={CIMENCAM_COLORS.gray}
                fontSize={12}
              />
              <YAxis 
                stroke={CIMENCAM_COLORS.gray}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: `1px solid ${CIMENCAM_COLORS.green}`,
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey={dataKey} 
                fill={CIMENCAM_COLORS.green}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey={dataKey}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: `1px solid ${CIMENCAM_COLORS.green}`,
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey={xAxisKey} 
                stroke={CIMENCAM_COLORS.gray}
                fontSize={12}
              />
              <YAxis 
                stroke={CIMENCAM_COLORS.gray}
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: `1px solid ${CIMENCAM_COLORS.green}`,
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey={dataKey} 
                stroke={CIMENCAM_COLORS.green}
                strokeWidth={3}
                dot={{ fill: CIMENCAM_COLORS.green, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: CIMENCAM_COLORS.green }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Type de graphique non supporté</div>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-cimencam-gray">{title}</CardTitle>
        {description && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {data && data.length > 0 ? (
          renderChart()
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Aucune donnée disponible
          </div>
        )}
      </CardContent>
    </Card>
  );
}
