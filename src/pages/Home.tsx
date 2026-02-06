import { useState, useEffect } from "react"
import { AppLayout } from "@/components/layout/AppLayout"
import { Button } from "@/components/ui/Button"
import { Sparkles, ArrowRight, ArrowDown, LayoutDashboard, BrainCircuit, Target, AlertTriangle, CheckCircle2, XCircle, Clock, Users, Briefcase, TrendingUp, Check, Calendar, Trophy, Pencil, RefreshCw, Map, BarChart3 } from "lucide-react"
import { motion, useMotionTemplate, useMotionValue } from "framer-motion"
import { GenerationLoader } from "@/components/ui/GenerationLoader"
import { AuthDialog } from "@/components/auth/AuthDialog"
// import { generatePlan } from "@/lib/ai-service"

// --- Components ---

function SpotlightCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  return (
    <div
      className={`group relative border border-white/10 bg-gray-900/50 overflow-hidden rounded-xl ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              650px circle at ${mouseX}px ${mouseY}px,
              rgba(255, 255, 255, 0.1),
              transparent 80%
            )
          `,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  )
}

function FakeUI() {
  return (
    <motion.div 
      initial={{ rotateX: 20, rotateY: -20, opacity: 0, y: 50 }}
      animate={{ rotateX: 5, rotateY: -5, opacity: 1, y: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      style={{ perspective: 1000 }}
      className="relative w-full max-w-3xl mx-auto"
    >
      <div className="relative rounded-xl border border-white/10 bg-gray-950/80 backdrop-blur-xl shadow-2xl overflow-hidden transform transition-all hover:rotate-0 hover:scale-[1.02] duration-500">
        {/* Fake Header */}
        <div className="h-10 border-b border-white/10 bg-white/5 flex items-center px-4 gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="ml-4 h-4 w-32 rounded-full bg-white/10" />
        </div>
        
        {/* Fake Content */}
        <div className="p-6 grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 space-y-3">
            <div className="h-8 w-full rounded bg-primary/20" />
            <div className="h-4 w-3/4 rounded bg-white/5" />
            <div className="h-4 w-2/3 rounded bg-white/5" />
            <div className="h-4 w-4/5 rounded bg-white/5" />
          </div>
          
          {/* Main Area */}
          <div className="col-span-9 space-y-4">
            <div className="flex justify-between items-center">
              <div className="h-8 w-1/3 rounded bg-white/10" />
              <div className="h-8 w-24 rounded bg-primary" />
            </div>
            
            {/* Timeline/Grid */}
            <div className="grid grid-cols-4 gap-3 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 rounded-lg border border-white/5 bg-white/5 p-3 space-y-2">
                  <div className="h-3 w-1/2 rounded bg-white/10" />
                  <div className="h-1.5 w-full rounded bg-white/5" />
                  <div className="h-1.5 w-2/3 rounded bg-white/5" />
                </div>
              ))}
            </div>

            {/* Action List */}
            <div className="space-y-2 mt-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded border border-white/5 bg-white/[0.02]">
                  <div className="w-4 h-4 rounded-full border border-primary/50" />
                  <div className="h-3 w-2/3 rounded bg-white/10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Glow Effect behind UI */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-2xl -z-10" />
      </div>
    </motion.div>
  )
}

function OfferTimer() {
  const [timeLeft, setTimeLeft] = useState("")
  
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      
      const diff = endOfDay.getTime() - now.getTime()
      
      if (diff <= 0) return "00:00:00"
      
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / (1000 * 60)) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    setTimeLeft(calculateTimeLeft())
    
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-center gap-2 text-red-500 font-mono text-sm bg-red-500/10 border border-red-500/20 py-1.5 px-3 rounded-lg mx-auto w-fit mt-3">
      <Clock className="w-4 h-4" />
      <span className="font-bold">Esta oferta expira em {timeLeft}</span>
    </div>
  )
}

export default function Home() {
  const [isLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleAuthClick = () => {
    // Rastrear intenção de compra no Meta Ads
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout');
    }
    setShowAuthModal(true)
  }

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing')
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <AppLayout onAuthClick={scrollToPricing}>
      <GenerationLoader isVisible={isLoading} />
      <AuthDialog isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

      <div className="min-h-screen font-sans bg-background">
        
        {/* --- 1. Hero Section (O Impacto Imediato) --- */}
        <section className="relative pt-24 pb-16 md:pt-48 md:pb-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
              
              {/* Left Column: Content */}
              <div className="text-left space-y-6 md:space-y-10">
                {/* Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/10 backdrop-blur-md shadow-[0_0_15px_rgba(249,115,22,0.1)] hover:border-primary/40 transition-colors cursor-default"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  <span className="text-xs font-bold text-primary tracking-wide uppercase">Vision AI</span>
                </motion.div>

                {/* Headline */}
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white leading-[1.1]"
                >
                  Fevereiro chegou. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-300 to-primary animate-gradient-x">
                    1/12 do ano já virou fumaça.
                  </span>
                </motion.h1>

                {/* Subheadline */}
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg md:text-xl text-gray-400 max-w-xl leading-relaxed"
                >
                  Sua meta de 2026 vai ser igual a de 2025 (esquecida) ou você vai instalar um <strong className="text-white">Sistema de Execução</strong>? Acorde segunda com o GPS ligado e apenas siga o passo a passo.
                </motion.p>

                {/* Terminal Input & CTA */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-8 flex flex-col sm:flex-row gap-4 justify-start max-w-lg"
                >
                   <Button 
                      size="lg" 
                      onClick={scrollToPricing}
                      className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_30px_rgba(249,115,22,0.5)] transition-all rounded-xl h-14 px-8"
                    >
                      Começar Agora
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                    
                    <button 
                      onClick={scrollToPricing}
                      className="flex items-center justify-center w-full sm:w-auto px-6 h-14 rounded-xl border border-white/10 hover:bg-white/5 font-bold text-sm md:text-base text-white transition-colors whitespace-nowrap"
                    >
                      Quero Destravar meu Ano
                    </button>
                </motion.div>
              </div>

              {/* Right Column: Visual */}
              <div className="relative hidden lg:block perspective-[2000px]">
                <div className="absolute inset-0 bg-primary/10 blur-[100px] -z-10" />
                <FakeUI />
              </div>

            </div>
          </div>
        </section>

        {/* --- 2. A Seção de Agitação (O Inimigo Oculto) --- */}
        <section className="py-12 md:py-24 bg-[#0a0a0a] border-y border-white/5 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Por que 92% dos planos morrem antes do Carnaval?</h2>
              <p className="text-gray-400">O problema não é você. É o método.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
              {[
                { 
                  title: "A Paralisia da Escolha", 
                  desc: "Você já salvou 47 posts no Instagram. Comprou 3 cursos. Mas na segunda de manhã, não sabe qual a PRIMEIRA tarefa do dia. Informação sem sistema = Paralisia.", 
                  icon: AlertTriangle,
                  color: "text-yellow-500"
                },
                { 
                  title: "A Ilusão do Movimento", 
                  desc: "\"Quero faturar 100k\" não é uma meta. É um desejo. Seu cérebro precisa de números, prazos e tarefas. Sem isso, você trabalha muito mas nunca sabe se está avançando.", 
                  icon: XCircle,
                  color: "text-red-500"
                },
                { 
                  title: "O Caos do Cotidiano", 
                  desc: "Planilhas vazias. Post-its perdidos. Você começa segunda motivado e termina sexta se perguntando \"onde foi parar minha semana?\". O urgente sempre ganha do importante.", 
                  icon: Clock,
                  color: "text-orange-500"
                },
              ].map((item, i) => (
                <div key={i} className="relative z-10 bg-gray-900/50 border border-white/5 p-8 rounded-2xl hover:border-white/10 transition-colors group">
                  <div className={`w-12 h-12 bg-white/5 rounded-lg flex items-center justify-center mb-6 ${item.color} bg-opacity-10`}>
                    <item.icon className={`h-6 w-6 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 3. A Virada de Chave (O Mecanismo Único) --- */}
        <section className="py-16 md:py-32 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center max-w-6xl mx-auto">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-5xl font-heading font-bold text-white leading-tight">
                  Não é falta de <span className="text-gray-500 line-through decoration-gray-700 decoration-2">disciplina</span>. <br />
                  É falta de <span className="text-primary">clareza.</span>
                </h2>
                <div className="space-y-6 text-lg text-gray-400">
                  <p>
                    Empresas de bilhões não fazem "resoluções de ano novo". Elas pegam a meta do Q4 e fazem <strong className="text-white">engenharia reversa</strong> até a tarefa de segunda-feira.
                  </p>
                  <p>
                    O Vision AI faz isso com sua vida profissional:
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Pegamos sua meta (ex: \"Faturar 100k em 2026\")",
                      "Quebramos em 4 trimestres com marcos claros",
                      "Dividimos em 12 meses de foco específico",
                      "Entregamos 52 semanas de tarefas executáveis"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-white">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="pt-4 border-t border-white/10 text-sm">
                    Você para de olhar pro topo da montanha. E foca só no próximo passo. É assim que a ansiedade de "não estar fazendo o suficiente" desaparece.
                  </p>
                </div>
              </div>
              
              {/* Visual Gráfico Animado (Abstrato) */}
              <div className="relative h-[400px] md:h-[500px] bg-gray-900 rounded-2xl border border-white/10 p-8 flex flex-col justify-center items-center overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02]" />
                <div className="relative z-10 w-full max-w-xs space-y-4">
                  {/* Big Block */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="h-24 w-full bg-primary rounded-xl flex items-center justify-center text-black font-bold text-xl"
                  >
                    META 2026
                  </motion.div>
                  {/* Arrow */}
                  <div className="flex justify-center"><ArrowRight className="rotate-90 text-gray-600" /></div>
                  {/* 4 Blocks */}
                  <div className="grid grid-cols-2 gap-2">
                    {[1,2,3,4].map(i => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.2 }}
                        className="h-16 bg-gray-800 rounded-lg border border-white/10 flex items-center justify-center text-xs text-gray-400"
                      >
                        Q{i}
                      </motion.div>
                    ))}
                  </div>
                  {/* Arrow */}
                  <div className="flex justify-center"><ArrowRight className="rotate-90 text-gray-600" /></div>
                  {/* Many Small Blocks */}
                  <div className="grid grid-cols-6 gap-1">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 1 + (i * 0.05) }}
                        className="h-6 bg-green-500/20 rounded border border-green-500/30"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 3.5. O Stack de Crescimento (Visual Flow) --- */}
        <section className="py-12 md:py-24 bg-zinc-900/50 border-y border-white/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16 max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight">
                O Stack de Crescimento
              </h2>
              <p className="text-lg text-gray-400">
                Do objetivo à execução em 3 passos simples.
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-6xl mx-auto">
              {/* Passo 1 */}
              <div className="flex-1 flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 w-full">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 mb-2">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-white">1. O Alvo</h3>
                <p className="text-gray-400 text-sm">
                  Você define a meta de faturamento.
                </p>
              </div>

              {/* Seta 1 */}
              <div className="text-gray-600">
                <ArrowRight className="h-8 w-8 rotate-90 md:rotate-0" />
              </div>

              {/* Passo 2 */}
              <div className="flex-1 flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 w-full">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20 mb-2">
                  <BrainCircuit className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold text-white">2. O Motor</h3>
                <p className="text-gray-400 text-sm">
                  Nossa IA desenha a estratégia de mercado.
                </p>
              </div>

              {/* Seta 2 */}
              <div className="text-gray-600">
                <ArrowRight className="h-8 w-8 rotate-90 md:rotate-0" />
              </div>

              {/* Passo 3 */}
              <div className="flex-1 flex flex-col items-center text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 w-full">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 flex items-center justify-center border border-green-500/20 mb-2">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-white">3. A Ação</h3>
                <p className="text-gray-400 text-sm">
                  Você recebe tarefas diárias práticas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- 4. O Produto (Bento Grid / Features) --- */}
        <section id="features" className="py-16 md:py-32 bg-black/40 relative">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 md:mb-20">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-4 leading-tight">
                O Comando Central da Sua Vida
              </h2>
              <p className="text-primary/90 font-medium text-lg md:text-xl max-w-2xl mx-auto">
                Não é mais uma aba aberta no seu navegador. É a única que importa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              
              {/* Box 1 (Grande - Destaque): O Estrategista AI */}
              <SpotlightCard className="md:col-span-2 p-8 min-h-[300px] flex flex-col justify-between">
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center mb-6">
                    <BrainCircuit className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Seu Estrategista Pessoal</h3>
                  <div className="text-gray-400 max-w-md text-lg space-y-4">
                    <p>A IA adapta o plano à SUA realidade — não ao contrário.</p>
                    <ul className="space-y-1 text-sm text-gray-500">
                      <li>Tem pouco tempo? O plano é enxuto.</li>
                      <li>Sem orçamento? O plano é orgânico.</li>
                      <li>Começando do zero? O plano é progressivo.</li>
                    </ul>
                    <p>Zero conselhos genéricos. Só ações que funcionam com o que você TEM agora.</p>
                  </div>
                </div>
                <div className="absolute right-0 bottom-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
              </SpotlightCard>

              {/* Box 2 (Médio): Timeline Visual */}
              <SpotlightCard className="md:col-span-1 p-8">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-6">
                  <LayoutDashboard className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Acompanhamento que Funciona</h3>
                <div className="text-gray-400 text-sm leading-relaxed space-y-3">
                  <p>Veja exatamente onde você está vs. onde deveria estar.</p>
                  <p>O sistema mostra se você está no caminho certo ou precisa ajustar a rota. Sem culpa. Sem pressão desnecessária. Só clareza do que fazer agora.</p>
                </div>
              </SpotlightCard>

              {/* Box 3 (Pequeno): O "Como Fazer" */}
              <SpotlightCard className="md:col-span-1 p-8">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-6">
                  <Target className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Instruções Práticas (Zero Teoria)</h3>
                <div className="text-gray-400 text-sm leading-relaxed space-y-3">
                  <p>Não dizemos apenas "Divulgue seu trabalho". Dizemos exatamente COMO divulgar, ONDE postar e QUANDO fazer.</p>
                  <p>Cada passo vem com instruções claras. Você não precisa adivinhar. Só executar.</p>
                </div>
              </SpotlightCard>

              {/* Box 4: Social Proof */}
              <SpotlightCard className="md:col-span-2 p-8 flex items-center justify-between bg-white/[0.02]">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Usado por quem faz acontecer</h3>
                  <p className="text-gray-400 text-sm">Profissionais que cansaram de planejar e nunca executar. Pessoas que querem resultados reais, não só motivação temporária.</p>
                </div>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center text-xs text-white font-medium">
                      U{i}
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-gray-900 bg-primary flex items-center justify-center text-xs text-white font-bold">
                    +1k
                  </div>
                </div>
              </SpotlightCard>
            </div>
            
            <div className="mt-12 text-center">
              <a href="#pricing" className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary">
                Ver Planos e Preços
              </a>
            </div>
          </div>
        </section>

        {/* --- 4.5. O Arsenal (Grid de Features Extras) --- */}
        <section className="py-20 md:py-32 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/50 to-black z-0" />
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">
                O Arsenal Completo
              </h2>
              <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                Tudo o que você precisa para dominar 2026. Sem "plugins extras". Tudo incluso.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Calendar, title: "Dias de Foco", desc: "Visualize e proteja seus blocos de produtividade máxima." },
                { icon: Trophy, title: "Semanas Perfeitas", desc: "Gamificação que recompensa sua consistência semanal." },
                { icon: Pencil, title: "Edição em Tempo Real", desc: "Sua rotina mudou? Ajuste tarefas e planos instantaneamente." },
                { icon: RefreshCw, title: "Recalcular Rota", desc: "Imprevistos acontecem. A IA recria o plano em segundos." },
                { icon: Map, title: "Roteiro 2026", desc: "Visão anual clara para você nunca perder o norte." },
                { icon: BarChart3, title: "Metas & KPIs", desc: "Painel focado somente nos números que movem o ponteiro." },
              ].map((item, i) => (
                <div key={i} className="group relative p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all duration-300 hover:bg-white/[0.07] overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 transition-opacity opacity-0 group-hover:opacity-100" />
                  
                  <div className="relative z-10 flex flex-col items-start text-left">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-primary mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300 group-hover:border-primary/30">
                      <item.icon className="h-7 w-7" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <a href="#pricing" className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 text-base font-bold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-primary/50 hover:text-primary">
                Consultar Valores
              </a>
            </div>
          </div>
        </section>

        {/* --- 5. A Prova Lógica (Comparativo) --- */}
        <section className="py-16 md:py-24 border-y border-white/5">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white">A diferença é brutal.</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* O Jeito Velho */}
              <div className="p-8 rounded-2xl border border-white/5 bg-gray-900/30 opacity-70">
                <h3 className="text-xl font-bold text-gray-400 mb-6 border-b border-white/5 pb-4">Planejamento Tradicional</h3>
                <ul className="space-y-4 text-gray-500">
                  <li className="flex items-center gap-3"><XCircle className="h-5 w-5" /> 10 horas montando planilha bonita</li>
                  <li className="flex items-center gap-3"><XCircle className="h-5 w-5" /> Metas genéricas ("Vender mais", "Postar todo dia")</li>
                  <li className="flex items-center gap-3"><XCircle className="h-5 w-5" /> Você tem que LEMBRAR de revisar</li>
                  <li className="flex items-center gap-3"><XCircle className="h-5 w-5" /> Resultado: Abandono em 6 semanas</li>
                </ul>
              </div>

              {/* O Jeito Vision */}
              <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl -z-10" />
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" /> Com Vision AI
                </h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> 15 minutos gerando o plano completo</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Metas executáveis ("10 DMs/dia para perfis XYZ")</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> O sistema te COBRA semanalmente</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="h-5 w-5 text-primary" /> Resultado: Tração real em 11 meses</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- 6. Quem deve usar (Segmentação) --- */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-12">Construído para quem executa</h2>
            <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Briefcase, title: "Freelancers", desc: "Sair do \"mês bom, mês ruim\" e ter previsibilidade." },
                { icon: Users, title: "Agências", desc: "Estruturar processos antes de contratar (e quebrar depois)." },
                { icon: TrendingUp, title: "Empreendedores Digitais", desc: "Parar de comprar curso e começar a APLICAR o que já sabe." },
                { icon: Target, title: "CLTs Planejando a Saída", desc: "Construir renda paralela sem largar o emprego de cabeça." },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl border border-white/5 bg-gray-900/50 hover:bg-gray-900 transition-colors">
                  <div className="w-10 h-10 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-4 text-gray-300">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 6.5. Pricing (A Oferta SaaS) --- */}
        <section id="pricing" className="py-20 md:py-24 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10" />

          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto">
              <div className="relative group">
                {/* Border Gradient */}
                <div className="absolute -inset-[1px] bg-gradient-to-b from-primary via-orange-500 to-primary rounded-2xl opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-[#0a0a0a] rounded-2xl p-8 md:p-12 text-center h-full flex flex-col">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-primary to-orange-500 text-black font-extrabold px-6 py-1.5 rounded-full text-sm uppercase tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.4)]">
                    Oferta Exclusiva
                  </div>

                  <h2 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2 mt-4">
                    Vision AI Pro
                  </h2>
                  <p className="text-gray-400 text-sm">O GPS do seu crescimento profissional.</p>
                  
                  <div className="my-8 py-6 border-y border-white/5 bg-white/[0.02] -mx-8 md:-mx-12">
                    <div className="text-center space-y-1">
                      <p className="text-gray-500 text-sm font-medium line-through">
                        Preço Normal: R$ 97/mês
                      </p>
                      
                      <div className="flex flex-col items-center">
                         <span className="text-white font-bold mb-1">Preço de Lançamento Fevereiro:</span>
                         <div className="flex items-end gap-1">
                             <span className="text-5xl md:text-6xl font-heading font-bold text-white tracking-tighter">R$ 49,90</span>
                             <span className="text-gray-500 font-medium mb-1.5 text-lg">/mês</span>
                         </div>
                      </div>

                      <OfferTimer />

                      <p className="text-green-500 font-bold text-xs mt-3 flex items-center justify-center gap-1 text-center max-w-xs mx-auto">
                        <Sparkles className="h-3 w-3 flex-shrink-0" />
                        Custa menos que um café por dia.
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-4 text-left mb-10 flex-grow">
                    {[
                      "Acesso Ilimitado à IA Vision Planner",
                      "Dashboard de Acompanhamento 2026",
                      "Ajustes de Rota em Tempo Real",
                      "Check-ins Semanais Gamificados",
                      "Acesso Mobile & Desktop"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 bg-primary/20 p-1 rounded-full">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-gray-200 text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    size="xl" 
                    onClick={handleAuthClick}
                    className="w-full bg-primary hover:bg-orange-500 text-white font-bold h-14 text-lg shadow-[0_0_20px_rgba(249,115,22,0.2)] hover:shadow-[0_0_40px_rgba(249,115,22,0.4)] transition-all mb-4"
                  >
                    Garantir Acesso Vision Pro
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  
                  <div className="mt-4 p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-gray-400 leading-relaxed text-center">
                      <strong className="text-white block mb-1">Garantia Blindada de 7 Dias:</strong>
                      Entre, gere seu plano anual e teste a IA. Se sentir que sua rotina não ficou mais fácil, nós devolvemos 100% do seu dinheiro. Sem letras miúdas. O risco é todo nosso.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --- 7. FAQ Section (Accordion Style) --- */}
        <section className="py-20 md:py-24 border-t border-white/5 bg-black/20">
          <div className="container mx-auto px-4 max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-heading font-bold text-white mb-6">Dúvidas Frequentes</h2>
              <p className="text-gray-400">Tudo o que você precisa saber antes de começar.</p>
            </div>
            
            <div className="space-y-4">
              {[
                { 
                  q: "Isso realmente funciona pra quem não empreende?", 
                  a: "Sim. O sistema foi treinado com milhares de cenários profissionais. Se você quer ser promovido, mudar de carreira ou iniciar um projeto paralelo, a lógica de 'Engenharia Reversa' funciona exatamente igual." 
                },
                { 
                  q: "Preciso entender de IA ou tecnologia?", 
                  a: "Zero. Nossa interface é conversacional. É como falar com um mentor no WhatsApp. Você diz o que quer, e a IA faz todo o trabalho pesado de estruturação e quebra de tarefas." 
                },
                { 
                  q: "E se minha meta mudar no meio do ano?", 
                  a: "A vida acontece. É por isso que temos o botão 'Recalcular Rota'. Com um clique, o sistema reajusta todo o seu plano futuro baseando-se na sua nova realidade, sem você perder o que já construiu." 
                },
                { 
                  q: "Qual a garantia que tenho?", 
                  a: "Risco Zero. Você entra, gera seu plano, usa o sistema por 7 dias. Se achar que não valeu cada centavo, nós devolvemos 100% do seu dinheiro. Sem perguntas, sem burocracia." 
                }
              ].map((item, i) => (
                <details key={i} className="group bg-white/[0.03] border border-white/5 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 text-white group-open:bg-white/[0.02] transition-colors">
                    <h3 className="font-bold text-lg md:text-xl">{item.q}</h3>
                    <div className="white-icon-wrapper group-open:-rotate-180 transition-transform duration-300">
                      <ArrowDown className="h-5 w-5 text-gray-400" />
                    </div>
                  </summary>
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="px-6 pb-6 pt-2 text-gray-400 leading-relaxed border-t border-white/5"
                  >
                    {item.a}
                  </motion.div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* --- 8. O CTA Final (Arresting Visual) --- */}
        <section className="py-24 md:py-40 relative overflow-hidden flex items-center justify-center">
          {/* Intense Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-primary/20 z-0" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15)_0%,transparent_70%)] z-0" />
          <div className="absolute bottom-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          
          <div className="container mx-auto px-4 text-center relative z-10 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-medium text-sm mb-8 animate-pulse">
              <Clock className="w-4 h-4" />
              Tempo esgotando
            </div>

            <h2 className="text-4xl md:text-7xl font-heading font-bold text-white mb-8 tracking-tight leading-none">
              Janeiro já foi.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-500">
                Fevereiro está acabando.
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              A diferença entre quem realiza e quem só sonha é o <strong className="text-white">método</strong>. Você vai deixar mais um ano escorrer pelas mãos ou vai assumir o controle agora?
            </p>
            
            <div className="flex flex-col items-center gap-6">
              <Button size="xl" onClick={scrollToPricing} className="w-full md:w-auto h-auto py-4 md:h-20 md:py-0 px-6 md:px-12 text-lg md:text-xl bg-primary hover:bg-orange-500 text-white font-bold shadow-[0_0_60px_rgba(249,115,22,0.4)] hover:shadow-[0_0_100px_rgba(249,115,22,0.6)] hover:scale-105 transition-all rounded-2xl border-t border-white/20 whitespace-normal">
                Gerar Meu Plano de Execução
                <ArrowRight className="ml-3 h-6 w-6 md:h-7 md:w-7 flex-shrink-0" />
              </Button>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Teste Grátis de 7 Dias</span>
                <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Cancelamento Fácil</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </AppLayout>
  )
}
