import { useState, useRef, useCallback } from "react"
import type { RefObject } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Target, Users, Megaphone, Copy, Check, Zap, Fingerprint, Download, Image as ImageIcon, XCircle, AlertTriangle } from "lucide-react"
import { toPng } from 'html-to-image'

// Dados da Estratégia
const STRATEGY = {
  offer: {
    name: "Vision AI Planner 2026",
    price: "R$ 49,90",
    promise: "De Metas Abstratas para um Plano Executável em Segundos",
    pain: "A frustração de chegar no fim do ano e não ter realizado nada."
  },
  audiences: [
    {
      name: "Público Aberto (Broad)",
      interests: ["Nenhum (Sem segmentação)"],
      pain: "O Criativo qualifica.",
      hook: "Deixe o algoritmo do Meta encontrar os compradores baseado em quem clica no anúncio (Creative-First Strategy)."
    },
    {
      name: "Stack de Interesses (Teste)",
      interests: ["Marketing Digital", "Empreendedorismo", "Produtividade", "Notion", "Trello"],
      pain: "Buscam ferramentas, mas falham na execução.",
      hook: "Para quem já testou tudo e continua desorganizado."
    }
  ],
  ads: [
    {
      type: "Imagem Estática (Stop Scroll)",
      hook: "1/12 do ano morreu.",
      script: "Você já salvou 47 posts de 'produtividade' no Instagram. Tem Notion, Trello, planilha do Google e 4 bloquinhos de papel. Mas na segunda de manhã você acorda e pensa: 'Por onde eu começo?' O problema não é falta de ferramenta. É falta de SISTEMA. Vision AI pega sua meta e gera: 52 semanas de tarefas claras. O que fazer essa segunda (não semana que vem).",
      cta: "Gerar Meu Plano Agora"
    },
    {
      type: "Imagem Estática (Prova Visual - Dashboard)",
      hook: "A pior sensação do mundo é terminar a sexta exausto sem ter avançado.",
      script: "Vision AI resolve isso em 3 níveis: 1. Segunda: Lista exata do que fazer. 2. Sexta: Relatório visual (você avançou 35% da meta). 3. Fim do mês: IA recalcula a rota se você atrasou. Seu cérebro RELAXA porque o sistema pensa por você. R$ 49,90/mês • Primeira semana grátis.",
      cta: "Testar 7 Dias Grátis"
    },
    {
      type: "Imagem Estática (Punch Tipográfico)",
      hook: "Sua meta vai morrer (de novo)?",
      script: "Fevereiro acabando. Sua meta de 2026 tá igual a de 2025? (Esquecida numa planilha que você abriu 1x?) Empresas de bilhões não fazem 'resoluções'. Elas fazem ENGENHARIA REVERSA. Vision AI faz isso com sua vida em 15 minutos. Você fala: 'Quero faturar 80k em 2026'. A IA cospe: 52 semanas de ações práticas. Não é motivação. É um GPS que te cobra toda semana.",
      cta: "Começar Agora"
    }
  ]
}

const CreativeGenerator = () => {
  const ref1 = useRef<HTMLDivElement>(null)
  const ref2 = useRef<HTMLDivElement>(null)
  const ref3 = useRef<HTMLDivElement>(null)
  const refBanner300x250 = useRef<HTMLDivElement>(null)

  const downloadCreative = useCallback(async (ref: RefObject<HTMLDivElement | null>, name: string) => {
    if (ref.current === null) return

    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${name}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
    }
  }, [])

  return (
    <div className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Creative 1: Stop Scroll (Dor Visual - Calendar) */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium text-center">Criativo 1: "Stop Scroll - Dor Visual"</p>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-background max-w-[360px] mx-auto shadow-2xl">
             <div ref={ref1} className="w-[360px] h-[360px] relative bg-gradient-to-br from-black to-zinc-900 flex flex-col p-6 overflow-hidden">
                {/* Background Calendar Overlay */}
                <div className="absolute inset-0 opacity-10 pointer-events-none flex flex-wrap gap-2 p-4">
                   {Array.from({ length: 12 }).map((_, i) => (
                     <div key={i} className="w-16 h-16 border border-white/20 rounded-md" />
                   ))}
                </div>

                {/* Central Focus */}
                <div className="relative z-10 flex flex-col h-full justify-center text-center">
                   
                   {/* January Crossed Out */}
                   <div className="relative mx-auto mb-8">
                      <div className="w-24 h-24 border border-zinc-700 bg-zinc-900 rounded-xl flex items-center justify-center relative">
                        <span className="text-zinc-500 font-bold">JAN</span>
                        <XCircle className="absolute inset-0 w-full h-full text-red-600 opacity-80" strokeWidth={1} />
                      </div>
                      <p className="text-red-500 text-xs font-bold mt-2 uppercase tracking-tight">Perdido</p>
                   </div>

                   <h2 className="text-3xl font-heading font-bold text-white leading-tight mb-4">
                     1/12 do ano <br/>
                     <span className="text-red-500">MORREU.</span>
                   </h2>

                   <div className="bg-white/5 border border-white/10 rounded-lg p-3 text-left">
                     <p className="text-zinc-300 text-sm mb-1">❌ 11 apps de produtividade</p>
                     <p className="text-zinc-300 text-sm">❌ 0 clareza pra segunda-feira</p>
                   </div>
                </div>

                {/* Footer Logo */}
                <div className="absolute bottom-4 left-0 right-0 text-center">
                   <div className="flex items-center justify-center gap-1.5 opacity-50">
                     <Zap className="w-3 h-3 text-white" />
                     <span className="text-[10px] text-white tracking-[0.2em] font-bold">VISION.AI</span>
                   </div>
                </div>
             </div>
          </div>
          <Button onClick={() => downloadCreative(ref1, 'vision-creative-1-stop-scroll')} className="w-full gap-2" variant="outline">
            <Download className="w-4 h-4" /> Baixar (Stop Scroll)
          </Button>
        </div>

        {/* Creative 2: Social Proof + Urgency (Dashboard) */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium text-center">Criativo 2: "Prova Social + Urgência"</p>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-background max-w-[360px] mx-auto shadow-2xl">
             <div ref={ref2} className="w-[360px] h-[360px] relative bg-white overflow-hidden flex flex-col justify-between">
                
                {/* Header Text */}
                <div className="p-6 pb-2 text-center z-10">
                   <h2 className="text-zinc-900 text-xl font-bold leading-tight">
                     Sexta-feira, 18h.
                   </h2>
                   <p className="text-zinc-500 text-sm mt-1 mb-4 leading-tight">
                     Você sabe <span className="text-zinc-900 font-bold bg-yellow-200 px-1">EXATAMENTE</span> o que avançou essa semana?
                   </p>
                </div>

                {/* Dashboard Mockup (Floating) */}
                <div className="mx-6 mb-4 bg-zinc-900 rounded-xl p-4 shadow-2xl transform rotate-[-2deg] border border-zinc-200 scale-105">
                   {/* Progress */}
                   <div className="flex justify-between text-[10px] text-zinc-400 mb-1 font-mono">
                     <span>META MENSAL</span>
                     <span className="text-green-400 font-bold">35%</span>
                   </div>
                   <div className="h-1.5 bg-zinc-800 rounded-full mb-4 overflow-hidden">
                     <div className="h-full w-[35%] bg-green-500" />
                   </div>

                   {/* Tasks */}
                   <div className="space-y-2">
                     {[1,2,3].map(i => (
                       <div key={i} className="flex items-center gap-2">
                         <div className="w-4 h-4 rounded-full bg-green-500/20 flex items-center justify-center">
                           <Check className="w-2.5 h-2.5 text-green-500" />
                         </div>
                         <div className="h-2 w-32 bg-zinc-800 rounded animate-pulse" />
                       </div>
                     ))}
                     <div className="flex items-center gap-2 opacity-50">
                        <div className="w-4 h-4 rounded-full border border-zinc-700" />
                        <div className="h-2 w-24 bg-zinc-800/50 rounded" />
                     </div>
                   </div>

                   {/* Alert Tag */}
                   <div className="mt-4 inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded text-[10px] text-red-400 font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      Você está 2 dias atrasado
                   </div>
                </div>

                {/* Footer Social Proof */}
                <div className="bg-zinc-50 border-t border-zinc-100 p-4 text-center">
                   <div className="flex items-center justify-center -space-x-2 mb-2">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-6 h-6 rounded-full bg-zinc-300 border-2 border-white" />
                      ))}
                   </div>
                   <p className="text-[10px] text-zinc-500 font-medium tracking-tight">
                     <span className="text-zinc-900 font-bold">+1.200 pessoas</span> já salvaram fevereiro
                   </p>
                   <p className="text-[8px] text-zinc-400 mt-1 uppercase tracking-widest font-bold">VISION.AI</p>
                </div>
             </div>
          </div>
          <Button onClick={() => downloadCreative(ref2, 'vision-creative-2-proof')} className="w-full gap-2" variant="outline">
             <Download className="w-4 h-4" /> Baixar (Social Proof)
          </Button>
        </div>

        {/* Creative 3: Punch Typography */}
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground font-medium text-center">Criativo 3: "Punch Tipográfico"</p>
          <div className="border border-white/10 rounded-lg overflow-hidden bg-background max-w-[360px] mx-auto shadow-2xl">
             <div ref={ref3} className="w-[360px] h-[360px] relative bg-black flex flex-col justify-between p-8 overflow-hidden">
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                   {/* Top */}
                   <div>
                     <h1 className="text-6xl font-heading font-bold text-white leading-none tracking-tighter">
                       11 <br/>
                       meses
                     </h1>
                     <p className="text-zinc-500 text-lg font-medium tracking-tight mt-1">
                       sobraram.
                     </p>
                   </div>

                   {/* Middle */}
                   <div className="space-y-4">
                      <h2 className="text-2xl text-zinc-300 font-medium leading-tight">
                        Sua meta <span className="text-white border-b-2 border-red-600">vai morrer</span> <br/>
                        (de novo)
                      </h2>
                      
                      <p className="text-sm text-zinc-500 italic">
                        ou você vai instalar <br/>
                        um SISTEMA?
                      </p>
                   </div>

                   {/* Bottom */}
                   <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-zinc-500 tracking-[0.2em] font-bold uppercase mb-0.5">VISION.AI</p>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded border border-green-400/20">
                          Teste 7 dias grátis
                        </span>
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <Button onClick={() => downloadCreative(ref3, 'vision-creative-3-typography')} className="w-full gap-2" variant="outline">
            <Download className="w-4 h-4" /> Baixar (Tipográfico)
          </Button>
        </div>

      </div>
      
      {/* Banner 300x250 - Checkout */}
      <div className="mt-12 pt-8 border-t border-white/10">
        <p className="text-sm text-muted-foreground font-medium text-center mb-6">Banner 300x250 - Checkout</p>
        <div className="flex flex-col items-center gap-4">
          <div className="border border-white/10 rounded-lg overflow-hidden bg-background shadow-2xl">
            <div ref={refBanner300x250} className="w-[300px] h-[250px] relative bg-gradient-to-br from-[#FFFBF7] via-[#FFECD1] to-[#FAF7F5] flex flex-col overflow-hidden">
              {/* Top accent bar - gradient */}
              <div className="h-1 bg-gradient-to-r from-[#FF6B35] to-[#FF7849]" />
              
              {/* Content */}
              <div className="flex flex-col h-full px-4 py-3 justify-between gap-2">
                {/* Header Row - Logo + Badge */}
                <div className="flex items-center justify-between gap-2 flex-shrink-0">
                  <span className="text-[11px] font-black tracking-widest text-[#FF6B35] uppercase">Vision AI</span>
                  <span className="text-[9px] bg-[#FFF4E6] text-[#FF6B35] px-2 py-0.5 rounded-full font-bold border border-[#FF7849]/20 whitespace-nowrap">7 dias grátis</span>
                </div>

                {/* Main Headline - Strong AIDA */}
                <div className="space-y-0.5 flex-shrink-0">
                  <h2 className="text-[18px] font-black text-[#1A1A1A] leading-tight tracking-tight">
                    Transforme seus<br/>objetivos em ação
                  </h2>
                  <p className="text-[9px] text-[#666666] leading-snug font-medium">
                    52 semanas de tarefas claras. Sem procrastinação.
                  </p>
                </div>

                {/* Social Proof Box */}
                <div className="bg-[#FFF4E6] border border-[#FF7849]/25 px-3 py-2 rounded-lg space-y-0.5 flex-shrink-0">
                  <div className="text-[9px] font-black text-[#FF6B35]">
                    +1.200 usuários
                  </div>
                  <div className="text-[8px] text-[#2D2D2D] font-medium leading-tight">
                    já realizaram seus objetivos em fevereiro
                  </div>
                </div>

                {/* Benefits List */}
                <div className="space-y-1 text-[9px] flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] flex-shrink-0" />
                    <span className="text-[#2D2D2D] font-medium">Seu plano em 15 minutos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] flex-shrink-0" />
                    <span className="text-[#2D2D2D] font-medium">Acompanhamento semanal</span>
                  </div>
                </div>

                {/* CTA Button - High Contrast */}
                <div className="space-y-1 flex-shrink-0">
                  <button className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF7849] text-white py-2 rounded-lg font-black text-[10px] leading-none hover:shadow-md hover:from-[#FF5520] hover:to-[#FF6830] transition-all duration-200 uppercase tracking-wide">
                    Começar agora
                  </button>
                  <p className="text-[7px] text-[#666666] text-center font-medium">
                    Sem cartão. Sem compromisso.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <Button onClick={() => downloadCreative(refBanner300x250, 'vision-banner-300x250-checkout')} className="gap-2" variant="outline">
            <Download className="w-4 h-4" /> Baixar Banner 300x250
          </Button>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground mt-8">
        * As imagens são geradas em alta resolução (1080x1080 - Pixel Perfect) ao clicar em baixar. Banner: 600x500.
      </p>
    </div>
  )
}

export default function AdsPage() {
  const [copied, setCopied] = useState<string | null>(null)
  const refLogoDark = useRef<HTMLDivElement>(null)
  const refLogoLight = useRef<HTMLDivElement>(null)
  const refLogoBrand = useRef<HTMLDivElement>(null)

  const downloadCreative = useCallback(async (ref: RefObject<HTMLDivElement | null>, name: string) => {
    if (ref.current === null) return

    try {
      const dataUrl = await toPng(ref.current, { cacheBust: true, pixelRatio: 2 })
      const link = document.createElement('a')
      link.download = `${name}.png`
      link.href = dataUrl
      link.click()
    } catch (err) {
      console.error(err)
    }
  }, [])

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="border-b border-white/10 pb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/20 p-3 rounded-lg">
              <Megaphone className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-heading font-bold text-white">Central de Estratégia de Ads</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Painel interno para construção de campanhas, definição de públicos e scripts de criativos para o Meta Ads.
          </p>
        </div>

        {/* 1. A Oferta */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-primary">
            <Zap className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-widest">A Oferta Irresistível</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/5 border-white/10 hover:border-primary/50 transition-colors">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Produto Principal</h3>
              <p className="text-2xl font-bold text-white">{STRATEGY.offer.name}</p>
            </Card>
            <Card className="p-6 bg-white/5 border-white/10 hover:border-primary/50 transition-colors">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Preço da Oferta</h3>
              <p className="text-2xl font-bold text-green-400">{STRATEGY.offer.price}</p>
              <span className="text-xs text-muted-foreground">Valor percebido: R$ 297,00</span>
            </Card>
            <Card className="p-6 bg-white/5 border-white/10 hover:border-primary/50 transition-colors">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Grande Promessa</h3>
              <p className="text-lg font-medium text-white leading-tight">{STRATEGY.offer.promise}</p>
            </Card>
          </div>
        </section>

        {/* 2. Públicos Alvo */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-blue-400">
            <Target className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Públicos & Targeting</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {STRATEGY.audiences.map((aud, i) => (
              <Card key={i} className="p-6 bg-white/5 border-white/10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-500/20 p-2 rounded text-blue-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-lg text-white">{aud.name}</h3>
                </div>
                
                <div className="space-y-4 flex-1">
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase block mb-2">Interesses (Meta Ads)</span>
                    <div className="flex flex-wrap gap-2">
                      {aud.interests.map((tag, j) => (
                        <span key={j} className="text-xs bg-white/10 px-2 py-1 rounded text-red-200 border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">A Dor (Pain)</span>
                    <p className="text-sm text-red-200/80 italic">"{aud.pain}"</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase block mb-1">O Gancho (Hook)</span>
                    <p className="text-sm text-green-200/80 font-medium">"{aud.hook}"</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 3. Criativos e Scripts */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-purple-400">
            <Fingerprint className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Scripts & Criativos</h2>
          </div>

          <div className="space-y-6">
            {STRATEGY.ads.map((ad, i) => (
              <Card key={i} className="overflow-hidden border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500/20 px-3 py-1 rounded text-purple-300 text-xs font-bold uppercase">
                        {ad.type}
                      </div>
                      <h3 className="font-bold text-white text-lg">"{ad.hook}"</h3>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(ad.script || "", `ad-${i}`)}
                      className="gap-2 border-white/10 hover:bg-white/10"
                    >
                      {copied === `ad-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      Copiar Copy
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-sm text-gray-300 leading-relaxed">
                      {ad.script}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Chamada para Ação (CTA):</span>
                      <span className="font-bold text-primary">{ad.cta || "Saiba Mais"}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 4. Gerador de Criativos */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-pink-400">
            <ImageIcon className="w-5 h-5" />
            <h2 className="text-xs font-bold uppercase tracking-widest">Gerador de Criativos</h2>
          </div>
          
          <Card className="p-8 border-white/10 bg-black/20">
            <CreativeGenerator />
          </Card>
        </section>

        {/* 5. Identidade Visual */}
        <section>
          <div className="flex items-center gap-2 mb-6 text-orange-500">
            <h2 className="text-xs font-bold uppercase tracking-widest">Identidade Visual</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Logo Dark Mode */}
            <div className="space-y-3">
              <div 
                ref={refLogoDark}
                className="w-full rounded-xl border shadow-sm p-8 border-white/10 bg-[#0f0f12] flex flex-col items-center justify-center gap-4 h-48 relative overflow-hidden group"
              >
                 <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-600">DARK BG</div>
                 <div className="flex items-center gap-2 scale-125 group-hover:scale-150 transition-transform duration-500">
                    <span className="text-3xl font-heading font-bold tracking-tighter text-white">
                      Vision<span className="text-orange-500">.ai</span>
                    </span>
                 </div>
              </div>
              <Button onClick={() => downloadCreative(refLogoDark, 'vision-logo-dark')} className="w-full gap-2" variant="outline">
                <Download className="w-4 h-4" /> Baixar
              </Button>
            </div>

             {/* Logo Light Mode */}
             <div className="space-y-3">
              <div 
                ref={refLogoLight}
                className="w-full rounded-xl border shadow-sm p-8 border-white/10 bg-white flex flex-col items-center justify-center gap-4 h-48 relative overflow-hidden group"
              >
                 <div className="absolute top-2 left-2 text-[10px] font-mono text-zinc-400">LIGHT BG</div>
                 <div className="flex items-center gap-2 scale-125 group-hover:scale-150 transition-transform duration-500">
                    <span className="text-3xl font-heading font-bold tracking-tighter text-black">
                      Vision<span className="text-orange-500">.ai</span>
                    </span>
                 </div>
              </div>
              <Button onClick={() => downloadCreative(refLogoLight, 'vision-logo-light')} className="w-full gap-2" variant="outline">
                <Download className="w-4 h-4" /> Baixar
              </Button>
            </div>

             {/* Logo Brand Color - Monochrome */}
             <div className="space-y-3">
              <div 
                ref={refLogoBrand}
                className="w-full rounded-xl border shadow-sm p-8 border-white/10 bg-orange-500 flex flex-col items-center justify-center gap-4 h-48 relative overflow-hidden group"
              >
                 <div className="absolute top-2 left-2 text-[10px] font-mono text-orange-900/60">BRAND BG</div>
                 <div className="flex items-center gap-2 scale-125 group-hover:scale-150 transition-transform duration-500">
                    <span className="text-3xl font-heading font-bold tracking-tighter text-white">
                      Vision.ai
                    </span>
                 </div>
              </div>
              <Button onClick={() => downloadCreative(refLogoBrand, 'vision-logo-brand')} className="w-full gap-2" variant="outline">
                <Download className="w-4 h-4" /> Baixar
              </Button>
            </div>
          </div>
        </section>

        {/* Footer Link */}
        <div className="pt-12 border-t border-white/10 text-center">
          <p className="text-muted-foreground text-sm mb-4">
            Use esta página para orientar a criação das campanhas no Gerenciador de Anúncios.
          </p>
          <a href="/landing" className="text-primary hover:underline text-sm font-medium">Visualizar Landing Page de Destino &rarr;</a>
        </div>

      </div>
    </div>
  )
}
