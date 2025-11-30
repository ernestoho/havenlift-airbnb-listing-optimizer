import React, { useState, useRef } from 'react';
import { z } from 'zod';
import { Toaster, toast } from '@/components/ui/sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Hero } from '@/components/marketing/Hero';
import { FeatureCard } from '@/components/marketing/FeatureCard';
import { ResultsPanel, OptimizationReport } from '@/components/marketing/ResultsPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  ShieldCheck,
  BarChart,
  PenSquare,
  Camera,
  Sparkles,
  Search,
  BadgeCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
const urlSchema = z.string().url({ message: "Por favor, introduce una URL válida." }).refine(
  (url) => url.includes('airbnb.com'),
  { message: "La URL debe ser de airbnb.com" }
);
const generateMockReport = (url: string): OptimizationReport => {
  const seed = url.length;
  const before = {
    occupancy: 60 + (seed % 15),
    adr: 120 + (seed % 30),
    bookings: 20 + (seed % 10),
    rev: (60 + (seed % 15)) * (120 + (seed % 30)),
  };
  const after = {
    occupancy: Math.min(95, before.occupancy + 15 + (seed % 10)),
    adr: before.adr + 10 + (seed % 15),
    bookings: before.bookings + 5 + (seed % 5),
    rev: (Math.min(95, before.occupancy + 15 + (seed % 10))) * (before.adr + 10 + (seed % 15)),
  };
  return {
    url,
    auditId: `hav-${Date.now()}`,
    timestamp: new Date().toISOString(),
    before,
    after,
    suggestedTitle: "✨ Apartamento de diseño con vistas y balcón en el centro",
    suggestions: [
      { type: 'title', score: 9, copy: "Optimiza el título con palabras clave como 'vistas', 'céntrico' y 'diseño' para atraer más clics." },
      { type: 'photos', score: 7, copy: "Añade fotos de alta resolución del baño y la cocina. Considera una foto del exterior del edificio." },
      { type: 'pricing', score: 8, copy: "Ajusta tus precios de fin de semana un 15% más alto para capturar la demanda local." },
    ],
    chartSeries: Array.from({ length: 12 }, (_, i) => ({
      date: `Mes ${i + 1}`,
      value: before.bookings + (i * (after.bookings - before.bookings)) / 11 + (Math.random() - 0.5) * 2,
    })),
  };
};
const features = [
  { icon: <BarChart className="h-8 w-8" />, title: "Auditoría Profunda", description: "Analizamos más de 50 puntos clave de tu anuncio, desde el título hasta la configuración de precios." },
  { icon: <PenSquare className="h-8 w-8" />, title: "Redacción con IA", description: "Generamos descripciones y títulos que venden, optimizados para el algoritmo de Airbnb." },
  { icon: <Camera className="h-8 w-8" />, title: "Mejora de Imagen", description: "Detectamos fotos de baja calidad y te recomendamos cómo mejorar tu galería para impactar." },
  { icon: <Sparkles className="h-8 w-8" />, title: "Precios Inteligentes", description: "Comparamos tu tarifa con la competencia y el mercado para sugerirte el precio óptimo." },
  { icon: <BadgeCheck className="h-8 w-8" />, title: "Análisis de Cumplimiento", description: "Revisamos que tu anuncio cumpla con las directrices de la plataforma para evitar penalizaciones." },
  { icon: <Search className="h-8 w-8" />, title: "Espía a la Competencia", description: "Identificamos a tus competidores directos y te mostramos sus fortalezas y debilidades." },
];
const SectionWrapper = ({ children }: { children: React.ReactNode }) => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8 }}
    >
      {children}
    </motion.div>
  );
};
export function HomePage() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<OptimizationReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const handleOptimize = () => {
    setError(null);
    const validation = urlSchema.safeParse(url);
    if (!validation.success) {
      setError(validation.error.issues[0].message);
      return;
    }
    setIsLoading(true);
    setReport(null);
    toast.info("Realizando auditoría de tu anuncio...");
    setTimeout(() => {
      const mockReport = generateMockReport(url);
      setReport(mockReport);
      setIsLoading(false);
      toast.success("¡Análisis completado!");
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }, 2500);
  };
  return (
    <div className="bg-background text-foreground">
      <ThemeToggle className="fixed top-4 right-4" />
      <Toaster richColors position="top-center" />
      <main>
        <Hero url={url} setUrl={setUrl} handleOptimize={handleOptimize} isLoading={isLoading} error={error} />
        <div ref={resultsRef} className="py-12 md:py-20 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {(isLoading || report) && <ResultsPanel isLoading={isLoading} report={report} />}
          </div>
        </div>
        <SectionWrapper>
          <div className="py-12 md:py-20 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-4xl md:text-5xl font-bold text-foreground">
                <span className="text-primary">+24%</span> Tarifa de reserva
              </p>
              <p className="mt-2 text-muted-foreground">vs. competidores locales, según análisis de anfitriones de Airbnb.</p>
            </div>
          </div>
        </SectionWrapper>
        <SectionWrapper>
          <div className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Capacidades básicas</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Todo lo que necesitas para convertir tu anuncio en una máquina de reservas.
                </p>
              </div>
              <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {features.map((feature) => (
                  <FeatureCard key={feature.title} icon={feature.icon} title={feature.title}>
                    {feature.description}
                  </FeatureCard>
                ))}
              </div>
            </div>
          </div>
        </SectionWrapper>
        <SectionWrapper>
          <div className="py-20 md:py-28 bg-secondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">¿Cómo funciona?</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  En solo tres pasos, obtén un plan de acción para optimizar tu anuncio.
                </p>
              </div>
              <div className="mt-16 space-y-16">
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="flex-1">
                    <img src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071&auto=format&fit=crop" alt="Paso 1" className="rounded-xl shadow-lg aspect-video object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold">1. Pega tu URL</h3>
                    <p className="mt-2 text-muted-foreground">Introduce la dirección de tu anuncio de Airbnb. Nuestro sistema la analizará al instante.</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
                  <div className="flex-1">
                    <img src="https://images.unsplash.com/photo-1600585152225-358b5c1fac95?q=80&w=2070&auto=format&fit=crop" alt="Paso 2" className="rounded-xl shadow-lg aspect-video object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold">2. Recibe el Análisis</h3>
                    <p className="mt-2 text-muted-foreground">Obtén un informe detallado con métricas, proyecciones y recomendaciones claras y accionables.</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                  <div className="flex-1">
                    <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=2074&auto=format&fit=crop" alt="Paso 3" className="rounded-xl shadow-lg aspect-video object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold">3. Aplica y Gana</h3>
                    <p className="mt-2 text-muted-foreground">Implementa los cambios sugeridos y observa cómo mejoran tu visibilidad y tus ingresos.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </SectionWrapper>
        <SectionWrapper>
          <div className="py-20 md:py-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Confianza y Seguridad</h2>
                <p className="mt-4 text-lg text-muted-foreground">
                  Tus datos están seguros. Solo analizamos la información pública de tu anuncio.
                </p>
              </div>
              <div className="mt-16 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <Card>
                  <CardContent className="p-6">
                    <ShieldCheck className="h-10 w-10 mx-auto text-primary" />
                    <h3 className="mt-4 font-semibold">Análisis Seguro</h3>
                    <p className="mt-1 text-sm text-muted-foreground">No pedimos acceso a tu cuenta. Todo el análisis es externo y seguro.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-4xl font-bold text-primary">1,000+</p>
                    <h3 className="mt-2 font-semibold">Anfitriones Satisfechos</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Únete a una comunidad de anfitriones que ya optimizan sus anuncios.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <BadgeCheck className="h-10 w-10 mx-auto text-primary" />
                    <h3 className="mt-4 font-semibold">Cumplimiento de Normas</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Nuestras sugerencias siempre respetan los términos de servicio de Airbnb.</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </SectionWrapper>
        <div className="bg-gradient-to-tr from-primary/90 to-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-primary-foreground">
              Convierte tu Airbnb en una máquina de reservas
            </h2>
            <div className="mt-8 max-w-xl mx-auto">
              <form onSubmit={(e) => { e.preventDefault(); handleOptimize(); }} className="relative flex flex-col sm:flex-row gap-2">
                <Input
                  type="url"
                  placeholder="Pega la URL de tu anuncio..."
                  className="h-14 text-base w-full bg-white text-foreground"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
                <Button type="submit" size="lg" className="h-14 px-8 text-base font-semibold bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto" disabled={isLoading}>
                  {isLoading ? 'Analizando...' : 'Optimizar Ahora'}
                </Button>
              </form>
              <p className="mt-4 text-xs text-primary-foreground/80">
                Sin tarjeta de crédito requerida.
              </p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HavenLift. Todos los derechos reservados.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-foreground">Privacidad</a>
            <a href="#" className="hover:text-foreground">Términos</a>
            <a href="#" className="hover:text-foreground">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
}