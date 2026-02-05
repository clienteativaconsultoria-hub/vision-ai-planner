import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { ArrowRight, ArrowLeft, Check, Briefcase, TrendingUp, Users, Target, AlertTriangle, DollarSign } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { generatePlan } from "@/lib/ai-service"
import { GenerationLoader } from "@/components/ui/GenerationLoader"

// --- Tipos e Dados do Formulário ---

type OnboardingData = {
  businessModel: string;
  niche: string;
  currentStage: string;
  teamSize: string;
  mainBottleneck: string[];
  monthlyRevenue: string;
  goal2026: string;
  // Novos campos para maior profundidade
  targetAudience: string; // Quem é o cliente ideal?
  keyStrengths: string;   // Pontos fortes atuais
  marketingChannels: string; // Canais de aquisição atuais
  // Novos campos de recursos
  investmentCapacity: string;
  timeAvailability: string;
  competitors: string;
  values: string;
}

const initialData: OnboardingData = {
  businessModel: "",
  niche: "",
  currentStage: "",
  teamSize: "",
  mainBottleneck: [],
  monthlyRevenue: "",
  goal2026: localStorage.getItem("vision_temp_goal") || "",
  targetAudience: "",
  keyStrengths: "",
  marketingChannels: "",
  investmentCapacity: "",
  timeAvailability: "",
  competitors: "",
  values: "",
}

// --- Opções de Resposta ---

const businessModels = [
  { id: "saas", label: "SaaS / Software", icon: Briefcase },
  { id: "agency", label: "Agência / Serviços", icon: Users },
  { id: "ecommerce", label: "E-commerce / Varejo", icon: DollarSign },
  { id: "infoproduct", label: "Infoproduto / Cursos", icon: TrendingUp },
  { id: "freelance", label: "Freelancer / Autônomo", icon: Target },
  { id: "other", label: "Outro", icon: AlertTriangle },
]

const stages = [
  { id: "ideation", label: "Ideação (Tirando do papel)" },
  { id: "validation", label: "Validação (Primeiras vendas)" },
  { id: "growth", label: "Crescimento (Escalando)" },
  { id: "consolidation", label: "Consolidação (Líder de mercado)" },
]

const bottlenecks = [
  { id: "acquisition", label: "Atrair Clientes (Marketing)" },
  { id: "sales", label: "Fechar Vendas (Comercial)" },
  { id: "delivery", label: "Entregar/Operacional" },
  { id: "hiring", label: "Contratação e Time" },
  { id: "finance", label: "Gestão Financeira" },
]

const revenues = [
  { id: "0-5k", label: "R$ 0 - R$ 5k" },
  { id: "5k-20k", label: "R$ 5k - R$ 20k" },
  { id: "20k-100k", label: "R$ 20k - R$ 100k" },
  { id: "100k+", label: "R$ 100k+" },
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(initialData)
  const [isGenerating, setIsGenerating] = useState(false)

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("vision_onboarding_data")
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        setData(prev => ({ ...prev, ...parsed }))
      } catch (e) {
        console.error("Failed to parse saved onboarding data", e)
      }
    }
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("vision_onboarding_data", JSON.stringify(data))
  }, [data])

  const totalSteps = 6 // Aumentado para 6 passos

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const updateData = (key: Exclude<keyof OnboardingData, "mainBottleneck">, value: string) => {
    setData(prev => ({ ...prev, [key]: value }))
  }

  const toggleBottleneck = (id: string) => {
    setData(prev => {
      const current = prev.mainBottleneck;
      if (current.includes(id)) {
        return { ...prev, mainBottleneck: current.filter(b => b !== id) };
      } else {
        return { ...prev, mainBottleneck: [...current, id] };
      }
    });
  }

  const handleSubmit = async () => {
    setIsGenerating(true)
    try {
      // 1. Gerar Plano com IA
      const plan = await generatePlan(data.goal2026, data)

      // 2. Salvar no Supabase
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error("Usuário não identificado. Por favor, faça login novamente.");
      }

      console.log("Saving plan for user:", user.id);

      // Desativar planos anteriores (Soft delete logic ou apenas flag)
      await supabase
        .from('strategic_plans')
        .update({ is_active: false })
        .eq('user_id', user.id)

      // Criar Novo Plano
      const planPayload = {
        user_id: user.id,
        goal: data.goal2026,
        context: data as any,
        quarters_data: plan.quarters as any,
        monthly_focus: plan.monthlyFocus as any,
        is_active: true
      };
      
      console.log("Inserting plan payload:", planPayload);

      const { data: savedPlan, error: planError } = await supabase
        .from('strategic_plans')
        .insert(planPayload)
        .select()
        .single()

      if (planError) {
        console.error("Plan insertion error:", planError);
        throw planError
      }
      if (!savedPlan) throw new Error("Erro ao criar plano estratégico")

      // Inserir Táticas (Bulk Insert)
      const tacticsData = plan.weeklyTactics.map((tactic, index) => ({
        plan_id: savedPlan.id,
        user_id: user.id,
        title: tactic.title,
        description: tactic.description,
        week_number: index + 1,
        display_order: index,
        status: 'pending'
      }))

      const { error: tacticsError } = await supabase
        .from('tactics')
        .insert(tacticsData as any)
        
      if (tacticsError) {
        console.error("Tactics insertion error:", tacticsError);
        throw tacticsError
      }

      // 3. Redirecionar
      console.log("Plan saved successfully. Redirecting...");
      await new Promise(resolve => setTimeout(resolve, 500));
      // Force reload to ensure Dashboard refetches
      window.location.href = "/dashboard";

    } catch (error: any) {
      console.error("Erro ao gerar plano:", error)
      alert(`Ocorreu um erro ao gerar seu plano: ${error.message || error}`)
    } finally {
      setIsGenerating(false)
    }
  }

  // --- Render Steps ---

  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-white">Qual seu modelo de negócio?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
        {businessModels.map((model) => (
          <button
            key={model.id}
            onClick={() => updateData("businessModel", model.id)}
            className={`p-4 rounded-xl border text-left transition-all flex flex-row sm:flex-col items-center sm:items-start gap-4 sm:gap-3 ${
              data.businessModel === model.id
                ? "bg-primary/20 border-primary text-white"
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
          >
            <model.icon className={`h-6 w-6 flex-shrink-0 ${data.businessModel === model.id ? "text-primary" : "text-gray-500"}`} />
            <span className="font-medium text-sm md:text-base">{model.label}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Qual seu nicho de mercado?</h2>
        <input
          type="text"
          value={data.niche}
          onChange={(e) => updateData("niche", e.target.value)}
          placeholder="Ex: Odontologia, Moda Feminina, SaaS B2B..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors text-sm md:text-base"
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Em qual estágio você está?</h2>
        <div className="space-y-3">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => updateData("currentStage", stage.id)}
              className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                data.currentStage === stage.id
                  ? "bg-primary/20 border-primary text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <span className="text-sm md:text-base">{stage.label}</span>
              {data.currentStage === stage.id && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Faturamento Mensal Atual</h2>
        <div className="grid grid-cols-2 gap-3">
          {revenues.map((rev) => (
            <button
              key={rev.id}
              onClick={() => updateData("monthlyRevenue", rev.id)}
              className={`p-3 rounded-lg border text-center transition-all text-sm md:text-base ${
                data.monthlyRevenue === rev.id
                  ? "bg-primary/20 border-primary text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {rev.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Quais seus maiores gargalos hoje?</h2>
        <p className="text-gray-400 mb-3 md:mb-4 text-xs md:text-sm">Selecione todos que se aplicam.</p>
        <div className="space-y-2 md:space-y-3">
          {bottlenecks.map((b) => (
            <button
              key={b.id}
              onClick={() => toggleBottleneck(b.id)}
              className={`w-full p-3 md:p-4 rounded-xl border text-left transition-all flex items-center justify-between text-sm md:text-base ${
                data.mainBottleneck.includes(b.id)
                  ? "bg-primary/20 border-primary text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              <span>{b.label}</span>
              {data.mainBottleneck.includes(b.id) && <Check className="h-4 w-4 md:h-5 md:w-5 text-primary" />}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Tamanho do Time</h2>
        <input
          type="text"
          value={data.teamSize}
          onChange={(e) => updateData("teamSize", e.target.value)}
          placeholder="Ex: Eu sozinho, 5 pessoas, 2 sócios..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-primary transition-colors placeholder:text-sm md:placeholder:text-base"
        />
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-white">Aprofundando no Negócio</h2>
      
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">Quem é seu cliente ideal (Target Audience)?</label>
        <textarea
          value={data.targetAudience}
          onChange={(e) => updateData("targetAudience", e.target.value)}
          className="w-full h-24 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-sm md:placeholder:text-base"
          placeholder="Ex: Pequenos empresários de e-commerce que faturam até 50k..."
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">Quais seus principais canais de aquisição hoje?</label>
        <input
          type="text"
          value={data.marketingChannels}
          onChange={(e) => updateData("marketingChannels", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-primary transition-colors placeholder:text-sm md:placeholder:text-base"
          placeholder="Ex: Instagram Orgânico, Google Ads, Indicação..."
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">Qual seu maior diferencial competitivo (Key Strength)?</label>
        <input
          type="text"
          value={data.keyStrengths}
          onChange={(e) => updateData("keyStrengths", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-primary transition-colors placeholder:text-sm md:placeholder:text-base"
          placeholder="Ex: Atendimento rápido, Tecnologia proprietária, Marca forte..."
        />
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-white">Recursos e Restrições</h2>
      
      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">Capacidade de Investimento (R$)</label>
        <input
          type="text"
          value={data.investmentCapacity}
          onChange={(e) => updateData("investmentCapacity", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-primary transition-colors placeholder:text-sm md:placeholder:text-base"
          placeholder="Ex: Tenho R$ 10k para investir em tráfego, ou 'Baixo investimento'..."
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">Disponibilidade de Tempo</label>
        <input
          type="text"
          value={data.timeAvailability}
          onChange={(e) => updateData("timeAvailability", e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-primary transition-colors placeholder:text-sm md:placeholder:text-base"
          placeholder="Ex: Full-time, 2h por dia, Finais de semana..."
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">Principais Concorrentes</label>
        <textarea
          value={data.competitors}
          onChange={(e) => updateData("competitors", e.target.value)}
          className="w-full h-20 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-sm md:placeholder:text-base"
          placeholder="Ex: Empresa X, Fulano de Tal..."
        />
      </div>

      <div>
        <label className="block text-xs md:text-sm font-medium text-gray-400 mb-2">Valores e Não-Negociáveis</label>
        <textarea
          value={data.values}
          onChange={(e) => updateData("values", e.target.value)}
          className="w-full h-20 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-sm md:text-base text-white focus:outline-none focus:border-primary transition-colors resize-none placeholder:text-sm md:placeholder:text-base"
          placeholder="Ex: Não quero fazer dancinha no TikTok, Não quero trabalhar aos domingos..."
        />
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-bold text-white">Defina sua Meta Principal para 2026</h2>
      <p className="text-sm md:text-base text-gray-400">Seja específico. O que você quer alcançar até 31 de Dezembro de 2026?</p>
      
      <div className="relative">
        <textarea
          value={data.goal2026}
          onChange={(e) => updateData("goal2026", e.target.value)}
          maxLength={150}
          className="w-full h-32 bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-primary transition-colors text-base md:text-lg resize-none placeholder:text-base md:placeholder:text-lg"
          placeholder="Ex: Faturar R$ 1 Milhão com margem de 30% vendendo consultoria..."
        />
        <div className="absolute bottom-3 right-3 text-xs text-gray-500">
          {data.goal2026.length}/150
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <h3 className="text-primary font-bold mb-2 flex items-center gap-2 text-sm md:text-base">
          <Target className="h-4 w-4" /> Resumo do Contexto
        </h3>
        <ul className="text-xs md:text-sm text-gray-300 space-y-1">
          <li>• Modelo: {businessModels.find(m => m.id === data.businessModel)?.label}</li>
          <li>• Estágio: {stages.find(s => s.id === data.currentStage)?.label}</li>
          <li>• Gargalos: {data.mainBottleneck.map(id => bottlenecks.find(b => b.id === id)?.label).join(", ")}</li>
          <li>• Cliente: {data.targetAudience.substring(0, 30)}...</li>
          <li>• Investimento: {data.investmentCapacity}</li>
        </ul>
      </div>
    </div>
  )

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <GenerationLoader isVisible={isGenerating} />
      
      {/* Header Simples */}
      <header className="h-16 border-b border-white/5 flex items-center px-4 md:px-8 flex-shrink-0">
        <span className="text-lg font-bold tracking-tight text-white">
          Vision<span className="text-primary">.ai</span>
        </span>
      </header>

      <main className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="min-h-full flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-6 md:mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase tracking-wider">
              <span>Passo {step} de {totalSteps}</span>
              <span>{Math.round((step / totalSteps) * 100)}%</span>
            </div>
            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${(step / totalSteps) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-900/50 border border-white/5 rounded-2xl p-5 md:p-8 backdrop-blur-sm"
            >
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
              {step === 4 && renderStep4()}
              {step === 5 && renderStep5()}
              {step === 6 && renderStep6()}
            </motion.div>
          </AnimatePresence>


          {/* Navigation */}
          <div className="flex justify-between mt-6 md:mt-8">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 1}
              className={`text-gray-400 hover:text-white text-sm md:text-base ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
            </Button>
            
            <Button
              size="lg"
              onClick={handleNext}
              className="bg-primary hover:bg-primary/90 text-black font-bold px-6 md:px-8 text-sm md:text-base"
              disabled={
                (step === 1 && (!data.businessModel || !data.niche)) ||
                (step === 2 && (!data.currentStage || !data.monthlyRevenue)) ||
                (step === 3 && (data.mainBottleneck.length === 0 || !data.teamSize)) ||
                (step === 4 && (!data.targetAudience || !data.marketingChannels)) ||
                (step === 5 && (!data.investmentCapacity || !data.timeAvailability)) ||
                (step === 6 && !data.goal2026)
              }
            >
              {step === totalSteps ? "Gerar Estratégia" : "Próximo"}
              {step !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </div>
        </div>
        </div>
      </main>
    </div>
  )
}
