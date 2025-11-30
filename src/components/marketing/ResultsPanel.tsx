import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, CheckCircle, Download, Lightbulb, FileText, ImageIcon, TrendingUp, Building, Utensils, Bath } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
export interface OptimizationReport {
  url: string;
  auditId: string;
  timestamp: string;
  before: { occupancy: number; adr: number; bookings: number; rev: number; };
  after: { occupancy: number; adr: number; bookings: number; rev: number; };
  suggestions: { type: 'title' | 'photos' | 'pricing'; score: number; copy: string; }[];
  chartSeries: { date: string; value: number }[];
  suggestedTitle: string;
  titles: {
    before: string;
    alternatives: string[];
    keywords: string[];
    analysis: string;
  };
  description: {
    before: string;
    optimized: string;
    usps: string[];
    tips: string;
  };
  images: {
    currentCount: number;
    suggestions: {
      order: number[];
      captions: string[];
      missingTypes: string[];
    };
  };
  overall: {
    marketInsights: {
      rankings: number;
      views: number;
      bookings: number;
    };
    advice: string[];
  };
}
interface ResultsPanelProps {
  report: OptimizationReport | null;
  isLoading: boolean;
}
const MetricCard = ({ title, value, change, isCurrency = false, isPercentage = false }: { title: string; value: number; change?: number; isCurrency?: boolean; isPercentage?: boolean }) => (
  <div className="p-4 bg-secondary/80 rounded-lg text-center">
    <p className="text-sm text-muted-foreground">{title}</p>
    <p className="text-2xl font-bold text-foreground">
      {isCurrency ? `€${value.toFixed(2)}` : `${value.toFixed(isCurrency ? 2 : 0)}${isPercentage ? '%' : ''}`}
    </p>
    {change && change > 0 && (
      <p className="text-sm font-medium text-green-600 flex items-center justify-center gap-1">
        <ArrowUp className="h-4 w-4" /> +{change.toFixed(1)}%
      </p>
    )}
  </div>
);
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const SectionCard = ({ icon, title, children, delay = 0 }: { icon: React.ReactNode; title: string; children: React.ReactNode; delay?: number }) => (
  <motion.div variants={cardVariants} initial="hidden" animate="visible" transition={{ duration: 0.5, delay }}>
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        {icon}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  </motion.div>
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
  const missingTypeIcons: { [key: string]: React.ReactNode } = {
    'Exterior': <Building className="h-5 w-5" />,
    'Cocina': <Utensils className="h-5 w-5" />,
    'Baño': <Bath className="h-5 w-5" />,
  };
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-full overflow-hidden">
        <CardHeader className="bg-muted/50 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
          {/* Existing Metrics and Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Métricas Potenciales</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard title="Ocupación" value={report.after.occupancy} change={report.after.occupancy - report.before.occupancy} isPercentage />
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
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: 'var(--radius)' }} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#colorUv)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          {/* New AI-Powered Sections */}
          <div className="space-y-6">
            <SectionCard icon={<Lightbulb className="h-6 w-6 text-primary" />} title="Mejora de Título" delay={0.1}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-1">Título Actual</h4>
                  <p className="font-mono text-sm bg-secondary p-3 rounded-md text-muted-foreground">{report.titles.before}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Alternativas Sugeridas</h4>
                  <ul className="space-y-2 list-decimal list-inside">
                    {report.titles.alternatives.map((alt, i) => <li key={i} className="text-sm">{alt}</li>)}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Palabras Clave</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.titles.keywords.map(kw => <Badge key={kw} variant="secondary" className="bg-accent text-accent-foreground">{kw}</Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Análisis</h4>
                  <p className="text-sm text-muted-foreground">{report.titles.analysis}</p>
                </div>
              </div>
            </SectionCard>
            <SectionCard icon={<FileText className="h-6 w-6 text-primary" />} title="Optimización de Descripción" delay={0.2}>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Descripción Actual</h4>
                    <Textarea readOnly value={report.description.before} className="h-40 bg-secondary text-muted-foreground" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Descripción Optimizada</h4>
                    <Textarea readOnly value={report.description.optimized} className="h-40" />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Puntos de Venta Únicos (USPs)</h4>
                  <div className="flex flex-wrap gap-2">
                    {report.description.usps.map(usp => <Badge key={usp} className="bg-primary/90 text-primary-foreground">{usp}</Badge>)}
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">Consejos</h4>
                  <p className="text-sm text-muted-foreground">{report.description.tips}</p>
                </div>
              </div>
            </SectionCard>
            <SectionCard icon={<ImageIcon className="h-6 w-6 text-primary" />} title="Optimización de Imágenes" delay={0.3}>
              <div className="space-y-4">
                <h4 className="font-semibold text-sm mb-2">Orden y Enfoque Sugerido</h4>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {report.images.suggestions.order.map((imgIndex, displayIndex) => (
                    <div key={displayIndex} className="relative aspect-square">
                      <img src={`https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=400&h=400&fit=crop&seed=${imgIndex}`} alt={`Suggested image ${displayIndex + 1}`} className="w-full h-full object-cover rounded-md" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{displayIndex + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Tipos de Fotos Faltantes</h4>
                  <div className="flex flex-wrap gap-4">
                    {report.images.suggestions.missingTypes.map(type => (
                      <div key={type} className="flex items-center gap-2 text-sm text-muted-foreground">
                        {missingTypeIcons[type] || <ImageIcon className="h-5 w-5" />}
                        <span>{type}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionCard>
            <SectionCard icon={<TrendingUp className="h-6 w-6 text-primary" />} title="Mejora General del Anuncio" delay={0.4}>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Impacto Potencial en el Mercado</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MetricCard title="Ranking Local" value={report.overall.marketInsights.rankings} change={report.overall.marketInsights.rankings} isPercentage />
                    <MetricCard title="Visibilidad" value={report.overall.marketInsights.views} change={report.overall.marketInsights.views} isPercentage />
                    <MetricCard title="Reservas" value={report.overall.marketInsights.bookings} change={report.overall.marketInsights.bookings} isPercentage />
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2">Consejos Adicionales</h4>
                  <ul className="space-y-2">
                    {report.overall.advice.map((adv, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 mt-0.5 text-green-500 flex-shrink-0" />
                        <span className="text-muted-foreground">{adv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </SectionCard>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}