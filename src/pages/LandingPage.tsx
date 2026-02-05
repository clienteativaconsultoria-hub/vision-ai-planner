import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, BarChart3, Users } from "lucide-react";
import { SpotlightCard } from "../components/ui/SpotlightCard";
import { Button } from "../components/ui/Button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      {/* Noise Texture Overlay */}
      <div className="fixed inset-0 z-50 pointer-events-none opacity-[0.03] bg-noise mix-blend-overlay"></div>

      {/* Navbar Simplificada */}
      <nav className="fixed top-0 left-0 right-0 z-40 border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary shadow-[0_0_15px_rgba(249,115,22,0.5)]" />
            <span className="font-heading text-xl font-bold tracking-tight">Vision Project</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-primary transition-colors">Depoimentos</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Preços</a>
          </div>
          <Button variant="primary" className="h-9 px-4 text-sm">
            Começar Agora
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-30 pointer-events-none" />
        
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-primary mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Novo Lançamento 2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto max-w-4xl font-heading text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
          >
            O Futuro do <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
              SaaS Design
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Uma landing page completa com todas as texturas, cores e componentes que você precisa para lançar seu próximo projeto com visual High-End.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button variant="primary" className="h-12 px-8 text-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-shadow">
              Explorar Template
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="ghost" className="h-12 px-8 text-lg">
              Ver Documentação
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Grid (Bento) */}
      <section id="features" className="py-24 relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="font-heading text-3xl font-bold md:text-5xl">Stack de Tecnologia</h2>
            <p className="mt-4 text-muted-foreground">Construído com as melhores ferramentas do mercado.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <SpotlightCard className="col-span-1 md:col-span-2 p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2">Performance Extrema</h3>
              <p className="text-muted-foreground">
                Otimizado para Core Web Vitals. Carregamento instantâneo com Vite e componentes leves.
                Animações fluidas rodando a 60fps.
              </p>
            </SpotlightCard>

            <SpotlightCard className="col-span-1 p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Segurança</h3>
              <p className="text-muted-foreground">
                Autenticação robusta e proteção de dados via RLS.
              </p>
            </SpotlightCard>

            <SpotlightCard className="col-span-1 p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-xl font-bold mb-2">Analytics</h3>
              <p className="text-muted-foreground">
                Dashboards integrados com gráficos em tempo real.
              </p>
            </SpotlightCard>

            <SpotlightCard className="col-span-1 md:col-span-2 p-8">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-2">Colaboração em Tempo Real</h3>
              <p className="text-muted-foreground">
                Trabalhe com seu time simultaneamente. Sincronização automática de estado e dados
                para que ninguém perca nada.
              </p>
            </SpotlightCard>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="font-heading text-4xl font-bold md:text-6xl mb-6">
            Pronto para começar?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Copie este código e comece seu próximo projeto SaaS com o pé direito.
            Design system completo incluso.
          </p>
          <Button variant="primary" className="h-14 px-10 text-xl shadow-[0_0_30px_rgba(249,115,22,0.4)]">
            Clonar Projeto Agora
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Vision Project Design System © 2026. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
