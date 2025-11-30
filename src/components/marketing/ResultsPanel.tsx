import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, CheckCircle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
export interface OptimizationReport {
  url: string;
  auditId: string;
  timestamp: string;
  before: {
    occupancy: number;
    adr: number;
    bookings: number;
    rev: number;
  };
  after: {
    occupancy: number;
    adr: number;
    bookings: number;
    rev: number;
  };
  suggestions: {
    type: 'title' | 'photos' | 'pricing';
    score: number;
    copy: string;
  }[];
  chartSeries: { date: string; value: number }[];
  suggestedTitle: string;
}
interface ResultsPanelProps {
  report: OptimizationReport | null;
  isLoading: boolean;
}
const MetricCard = ({ title, value, change, isCurrency = false }: { title: string; value: number; change: number; isCurrency?: boolean }) => (
  <div className="p-4 bg-secondary rounded-lg text-center">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold text-foreground">
      {isCurrency ? `€${value.toFixed(2)}` : `${value.toFixed(isCurrency ? 2 : 0)}%`}
    </p>
    {change > 0 && (
      <p className="text-sm font-medium text-green-600 flex items-center justify-center gap-1">
        <ArrowUp className="h-4 w-4" /> +{change.toFixed(1)}%
      </p>
    )}
  </div>
);
export function ResultsPanel({ report, isLoading }: ResultsPanelProps) {
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-48 w-full" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  if (!report) {
    return null;
  }
  const handleDownload = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(report, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `havenlift-report-${report.auditId}.json`;
    link.click();
    toast.success("Report downloaded successfully!");
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-muted/50 p-6 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl">Informe de Optimización</CardTitle>
            <CardDescription>Resultados del análisis para tu anuncio.</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Métricas Potenciales</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard title="Ocupación" value={report.after.occupancy} change={report.after.occupancy - report.before.occupancy} />
              <MetricCard title="Tarifa Media (ADR)" value={report.after.adr} change={((report.after.adr - report.before.adr) / report.before.adr) * 100} isCurrency />
              <MetricCard title="Ingresos" value={report.after.rev} change={((report.after.rev - report.before.rev) / report.before.rev) * 100} isCurrency />
              <MetricCard title="Reservas" value={report.after.bookings} change={((report.after.bookings - report.before.bookings) / report.before.bookings) * 100} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Proyección de Reservas</h3>
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={report.chartSeries} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={{ stroke: 'hsl(var(--border))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} tickLine={{ stroke: 'hsl(var(--border))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                      borderRadius: 'var(--radius)',
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.1)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Recomendaciones Clave</h3>
            <div className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Nuevo Título Sugerido
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-mono text-sm bg-secondary p-3 rounded-md">{report.suggestedTitle}</p>
                </CardContent>
              </Card>
              {report.suggestions.map((s, i) => (
                <Card key={i}>
                  <CardContent className="p-4 flex items-start gap-4">
                    <Badge variant={s.score > 8 ? "default" : "secondary"}>Puntuación: {s.score}/10</Badge>
                    <p className="text-sm text-muted-foreground flex-1">{s.copy}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}