import React from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'lucide-react';
interface HeroProps {
  url: string;
  setUrl: (url: string) => void;
  handleOptimize: () => void;
  isLoading: boolean;
  error?: string | null;
}
export function Hero({ url, setUrl, handleOptimize, isLoading, error }: HeroProps) {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center text-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=2070&auto=format&fit=crop"
          alt="Modern living room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-primary/30" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <p className="font-semibold text-primary">
            Optimización de listados impulsada por IA
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground">
            Transforma tu Airbnb en un imán de reservas
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Analizamos tu anuncio, identificamos oportunidades y te damos las claves para destacar, aumentar tu ocupación y maximizar tus ingresos.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 max-w-xl mx-auto"
        >
          <form onSubmit={(e) => { e.preventDefault(); handleOptimize(); }} className="space-y-3">
            <div className="relative flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="url"
                  placeholder="Pega la URL de tu anuncio de Airbnb..."
                  className="h-14 pl-10 text-base w-full"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                  aria-label="URL de tu anuncio de Airbnb"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="h-14 px-8 text-base font-semibold w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading}
              >
                {isLoading ? 'Analizando...' : 'Optimizar'}
              </Button>
            </div>
            {error && <p className="text-sm text-destructive text-left">{error}</p>}
          </form>
          <p className="mt-4 text-xs text-muted-foreground">
            Auditoría inicial gratuita • Análisis de la competencia • Estrategia de SEO y precios
          </p>
        </motion.div>
      </div>
    </section>
  );
}