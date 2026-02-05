import { useState } from "react"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Target, Users, Megaphone, Copy, Check, BarChart3, Zap, Fingerprint } from "lucide-react"

// Dados da Estratégia
const STRATEGY = {
  offer: {
    name: "Vision AI Planner 2026",
    price: "R$ 49,90",
    promise: "Planejamento Estratégico Completo em Segundos com IA",
    pain: "Sensação de atraso, falta de clareza, metas abandonadas em Fevereiro."
  },
  audiences: [
    {
      name: "Empreendedores Digitais",
      interests: ["Marketing Digital", "Startup", "SaaS", "Produtividade", "Notion", "ClickUp"],
      pain: "Muitas ideias, pouca execução. Precisam de um plano claro.",
      hook: "Pare de planejar no papel de pão. Use IA para criar um roadmap estratégico real."
    },
    {
      name: "TDAH & Procrastinadores",
      interests: ["TDAH Adulto", "Dopamina", "Desenvolvimento Pessoal", "Bullet Journal"],
      pain: "Paralisia por análise. Começam o ano bem e param.",
      hook: "Seu cérebro precisa de dopamina visual. O Vision AI gamifica suas metas."
    },
    {
      name: "Carreira & Corporativo",
      interests: ["LinkedIn", "Gestão de Projetos", "Liderança", "MBA"],
      pain: "Precisam mostrar resultados e organização para crescer.",
      hook: "Transforme sua ambição em um plano de ação estratégico profissional."
    }
  ],
  ads: [
    {
      type: "Video / Reels",
      hook: "Fevereiro chegou e você ainda não começou?",
      script: "POV: Você percebeu que 1/12 do ano já passou e suas metas continuam no papel. [Mostra a tela do Vision gerando o plano]. A IA cria seu roadmap mês a mês, semana a semana. Pare de se enganar. Clique e comece 2026 agora.",
      cta: "Gerar Meu Plano Agora"
    },
    {
      type: "Static / Carousel",
      headline: "Não é mais um planner de papel.",
      body: "É um estrategista de IA. 1. Você define a meta. 2. A IA quebra em táticas. 3. Você executa (e ganha XP).",
      visual: "Comparativo: Planner Comum (Confuso) vs Vision AI (Estruturado e Dark Mode bonito)."
    },
    {
      type: "Direct Response / Story",
      hook: "O segredo de quem executa 10x mais.",
      script: "Não é força de vontade, é clareza. O Vision AI remove a névoa mental. Ele diz exatamente o que fazer na segunda-feira de manhã.",
      cta: "Desbloquear Acesso Vitalício"
    }
  ]
}

export default function AdsPage() {
  const [copied, setCopied] = useState<string | null>(null)

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
                      <h3 className="font-bold text-white text-lg">"{ad.hook || ad.headline}"</h3>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => copyToClipboard(ad.script || ad.body || "", `ad-${i}`)}
                      className="gap-2 border-white/10 hover:bg-white/10"
                    >
                      {copied === `ad-${i}` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      Copiar Copy
                    </Button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="bg-black/40 p-4 rounded-lg border border-white/5 font-mono text-sm text-gray-300 leading-relaxed">
                        {ad.script || ad.body}
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Chamada para Ação (CTA):</span>
                        <span className="font-bold text-primary">{ad.cta || "Saiba Mais"}</span>
                      </div>
                    </div>
                    
                    {ad.visual && (
                      <div className="bg-white/5 p-4 rounded-lg flex items-center justify-center border border-dashed border-white/20">
                        <div className="text-center">
                          <BarChart3 className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                          <p className="text-sm text-muted-foreground max-w-[200px]">{ad.visual}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
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
