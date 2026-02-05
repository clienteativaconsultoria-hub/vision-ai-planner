import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { 
  CheckCircle2, 
  Circle, 
  Target,
  ChevronRight,
  Lock,
  ArrowRight,
  PlayCircle,
  Map as MapIcon,
  Loader2,
  Pencil,
  Save,
  X,
  Info,
  Plus,
  Trash2,
  CheckSquare,
  FileText
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"

import { recalculatePlan } from "@/lib/ai-service"
import { RecalculateDialog } from "@/components/dashboard/RecalculateDialog"
import { checkAndUpdateStreak } from "@/lib/gamification"
import { StreakWidget } from "@/components/dashboard/StreakWidget"
import { caktoService } from "@/lib/cakto"

const transformPlanToDashboardData = (dbPlan: any) => {
  // Map quarters_data (from strategic_plans)
  const safeQuarters = {
    q1: Array.isArray(dbPlan?.quarters_data?.q1) ? dbPlan.quarters_data.q1 : [],
    q2: Array.isArray(dbPlan?.quarters_data?.q2) ? dbPlan.quarters_data.q2 : [],
    q3: Array.isArray(dbPlan?.quarters_data?.q3) ? dbPlan.quarters_data.q3 : [],
    q4: Array.isArray(dbPlan?.quarters_data?.q4) ? dbPlan.quarters_data.q4 : [],
  };

  const quarters = [
    { id: 'q1', label: 'Q1', period: 'Janeiro - Março', focus: safeQuarters.q1[0] || 'Foco Q1' },
    { id: 'q2', label: 'Q2', period: 'Abril - Junho', focus: safeQuarters.q2[0] || 'Foco Q2' },
    { id: 'q3', label: 'Q3', period: 'Julho - Setembro', focus: safeQuarters.q3[0] || 'Foco Q3' },
    { id: 'q4', label: 'Q4', period: 'Outubro - Dezembro', focus: safeQuarters.q4[0] || 'Foco Q4' },
  ];

  // Tactics come joined as 'tactics' array. Sort by week_number.
  const allTactics = (dbPlan.tactics || []).sort((a: any, b: any) => (a.week_number || 0) - (b.week_number || 0));
  const completedCount = allTactics.filter((t: any) => t.status === 'completed').length;
  const totalTactics = allTactics.length || 52;

  return {
    id: dbPlan.id,
    title: dbPlan.goal,
    description: "Plano Estratégico Gerado por IA",
    status: dbPlan.is_active ? "ativo" : "inativo",
    context: dbPlan.context,
    progress: Math.round((completedCount / totalTactics) * 100),
    quarters: quarters.map((q, index) => {
      const startWeek = (index * 13) + 1; // 1, 14, 27, 40
      const endWeek = startWeek + 12;     // 13, 26, 39, 52
      
      const quarterTactics = allTactics.filter((t: any) => {
        const w = t.week_number || 0;
        return w >= startWeek && w <= endWeek;
      });
      
      // Fill missing weeks if necessary (optional, but good for UI consistency)
      // For now assume DB has all 52 weeks.
      
      return {
        id: q.id,
        quarter: q.label,
        period: q.period,
        focus: q.focus,
        status: index === 0 ? "current" : "locked", 
        actions: quarterTactics.map((tactic: any) => {
          return {
            id: tactic.id,
            globalIndex: (tactic.week_number || 1) - 1,
            week: tactic.week_number,
            title: tactic.title,
            instruction: tactic.description || tactic.title,
            description: tactic.description,
            notes: "", // Not in schema yet
            checklist: [], // Not in schema yet
            status: tactic.status === 'completed' ? "feito" : "pendente"
          };
        })
      };
    })
  };
};

export default function Dashboard() {
  const [planData, setPlanData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [recalculating, setRecalculating] = useState(false)
  const [showRecalculateModal, setShowRecalculateModal] = useState(false)
  // const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  // const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [expandedQuarter, setExpandedQuarter] = useState<string | null>("q1")
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [taskNotes, setTaskNotes] = useState("")
  const [taskChecklist, setTaskChecklist] = useState<any[]>([])
  const [streak, setStreak] = useState(0)
  // const [perfectWeeks, setPerfectWeeks] = useState(0)
  const completedTacticsRef = useRef<Set<number>>(new Set())

  useEffect(() => {
    if (selectedTask) {
      setTaskNotes(selectedTask.notes || "")
      setTaskChecklist(selectedTask.checklist || [])
    }
  }, [selectedTask])

  const navigate = useNavigate()

  // Simulating Free/Pro status. In a real app, fetch this from 'profiles' table.
  const isPremium = true; 

  const handleRecalculateClick = () => {
    setShowRecalculateModal(true)
  }

  /*
  const handleSubscribe = async () => {
    setIsProcessingPayment(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user || !user.email) {
        alert("Erro ao identificar usuário. Faça login novamente.");
        return;
      }

      console.log("Iniciando checkout Cakto para:", user.email);

      // Create checkout link via Cakto API
      const checkoutData = await caktoService.createCheckout({
        customer: {
          name: user.user_metadata?.full_name || "Usuário Vision",
          email: user.email,
          phone: "", // Optional if not required
          document: "" // Optional if not required
        },
        items: [
          ...
        ]
      })
    } catch (error) {
       // ...
    }
  }
  */
          {
            title: "Vision AI Pro - Assinatura Mensal",
            unit_price: 49.90,
            quantity: 1,
            tangible: false
          }
        ]
      });

      console.log("Resposta Cakto:", checkoutData);

      // Redirect to payment page
      // Adjust property name based on real API response (e.g. checkout_url, payment_link)
      if (checkoutData && checkoutData.checkout_url) {
        window.location.href = checkoutData.checkout_url;
      } else if (checkoutData && checkoutData.link) {
         window.location.href = checkoutData.link;
      } else {
         // Fallback if API response is different than expected
         console.warn("URL de checkout não encontrada na resposta:", checkoutData);
         alert("Erro ao gerar link de pagamento. Tente novamente.");
      }

    } catch (error) {
      console.error("Erro no pagamento:", error);
      alert("Falha ao iniciar pagamento. Verifique o console.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    async function fetchPlan() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate("/")
          return
        }

        // Fetch Streak
        const streakData = await checkAndUpdateStreak(user.id)
        if (streakData) {
          setStreak(streakData.current_streak)
        }

        const { data, error } = await supabase
          .from('strategic_plans')
          .select('*, tactics(*)')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) {
          console.error("Error fetching plan:", error)
          alert("Erro ao carregar seu plano. Por favor, recarregue a página.")
          setLoading(false)
          return
        }

        if (!data) {
          console.warn("Plan not found (active), redirecting to onboarding")
          navigate("/onboarding")
          return
        }

        // Calculate Perfect Weeks (TODO: Update calculation for new structure)
        // setPerfectWeeks(calculatePerfectWeeks(data as any)) 

        // Initialize completed tactics ref (Using globalIndex based on week_number)
        const dbTactics = (data.tactics || []) as any[]
        const completedIndices = dbTactics
          .filter(t => t.status === 'completed')
          .map(t => (t.week_number || 1) - 1)
        
        completedTacticsRef.current = new Set(completedIndices)


        try {
          setPlanData(transformPlanToDashboardData(data))
        } catch (transformError) {
          console.error("Error transforming plan data:", transformError)
          // Don't redirect immediately, maybe show an error state or let the user know
          // But if data is corrupted, we might need to regenerate?
          // For now, let's log and maybe alert
          alert("Erro ao processar os dados do plano. Por favor, tente gerar um novo plano.")
          navigate("/onboarding")
        }
      } catch (error) {
        console.error("Error fetching plan:", error)
        navigate("/onboarding")
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [navigate])

  const [editingActionId, setEditingActionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editInstruction, setEditInstruction] = useState("")

  const handleStartEdit = (action: any) => {
    setEditingActionId(action.id)
    setEditTitle(action.title)
    setEditInstruction(action.instruction)
  }

  const handleCancelEdit = () => {
    setEditingActionId(null)
    setEditTitle("")
    setEditInstruction("")
  }

  const handleSaveEdit = async () => {
    if (!planData || !editingActionId) return

    // 1. Optimistic Update
    const newPlanData = { ...planData }
    
    // Update local state
    newPlanData.quarters.forEach((q: any) => {
      q.actions.forEach((a: any) => {
        if (a.id === editingActionId) {
          a.title = editTitle
          a.instruction = editInstruction
        }
      })
    })
    setPlanData(newPlanData)
    
    // Capture ID before clearing state
    const tacticId = editingActionId;
    setEditingActionId(null)

    // 2. Update Supabase
    try {
      const { error } = await supabase
        .from('tactics')
        .update({ 
          title: editTitle,
          description: editInstruction 
        })
        .eq('id', tacticId)

      if (error) throw error
    } catch (error) {
      console.error("Error updating task:", error)
      alert("Erro ao salvar edição.")
    }
  }

  const handleSaveTaskDetails = async (globalIndex: number, updates: any) => {
    if (!planData) return

    // Find the action ID based on globalIndex (week number)
    let tacticId: string | null = null;
    const newPlanData = { ...planData }
    
    const newQuarters = newPlanData.quarters.map((q: any) => ({
      ...q,
      actions: q.actions.map((a: any) => {
        if (a.globalIndex === globalIndex) {
          tacticId = a.id;
          return { ...a, ...updates }
        }
        return a
      })
    }))
    
    setPlanData({ ...newPlanData, quarters: newQuarters })

    if (!tacticId) return;

    try {
      // Map updates to DB columns
      // UI uses 'notes' but DB doesn't have it yet. 
      // UI uses 'checklist' but DB doesn't have it yet.
      // We will only update title/description for now or ignore unsupported fields to prevent errors.
      
      const dbUpdates: any = {};
      if (updates.title) dbUpdates.title = updates.title;
      if (updates.description) dbUpdates.description = updates.description;
      // if (updates.status) dbUpdates.status = updates.status === 'feito' ? 'completed' : 'pending';

      if (Object.keys(dbUpdates).length === 0) return;

      const { error } = await supabase
        .from('tactics')
        .update(dbUpdates)
        .eq('id', tacticId)

      if (error) throw error

    } catch (error) {
      console.error("Error saving task details:", error)
      alert("Erro ao salvar detalhes da tarefa.")
    }
  }

  const handleToggleAction = async (globalIndex: number) => {
    if (!planData) return;

    // Check current state from Ref
    const isCurrentlyCompleted = completedTacticsRef.current.has(globalIndex);
    
    // Toggle in Ref
    if (isCurrentlyCompleted) {
      completedTacticsRef.current.delete(globalIndex);
    } else {
      completedTacticsRef.current.add(globalIndex);
    }
    
    // Find ID
    let tacticId: string | null = null;
    const nextStatus = !isCurrentlyCompleted ? "feito" : "pendente";

    // 1. Optimistic Update
    const newPlanData = { ...planData };

    newPlanData.quarters.forEach((q: any) => {
      q.actions.forEach((a: any) => {
        if (a.globalIndex === globalIndex) {
          tacticId = a.id;
          a.status = nextStatus;
        }
      });
    });
    
    // Recalculate progress
    const totalActions = 52; 
    const completedCount = completedTacticsRef.current.size;
    newPlanData.progress = Math.round((completedCount / totalActions) * 100);

    setPlanData(newPlanData);

    if (!tacticId) {
       console.error("Tactic ID not found for index", globalIndex);
       return;
    }

    // 2. Update Supabase
    try {
      const { error } = await supabase
        .from('tactics')
        .update({ status: !isCurrentlyCompleted ? 'completed' : 'pending' })
        .eq('id', tacticId);

      if (error) throw error;

    } catch (error) {
      console.error("Error updating task status:", error);
      // Revert Ref
      if (isCurrentlyCompleted) completedTacticsRef.current.add(globalIndex);
      else completedTacticsRef.current.delete(globalIndex);
    }
  };

  const handleConfirmRecalculate = async (newGoal: string, contextUpdates: any) => {
    setRecalculating(true)
    try {
      if (!planData) return

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User not found")

      const currentPlan = planData;
      const completedIndices = Array.from(completedTacticsRef.current);
      
      const newPlan = await recalculatePlan(
        currentPlan as any, 
        completedIndices, 
        planData.context as any,
        newGoal,
        contextUpdates
      )

      // Update Supabase
      // 1. Update Strategic Plan
      const { error } = await supabase
        .from('strategic_plans')
        .update({
          goal: newPlan.goal,
          quarters_data: newPlan.quarters,
          monthly_focus: newPlan.monthlyFocus,
          // Note: weekly_tactics update requires a more complex logic (delete pending + insert new)
          // We are skipping it for now to prevent errors with the new schema
        })
        .eq('id', planData.id)

      if (error) throw error

      // Refresh local state
      window.location.reload()

    } catch (error) {
      console.error("Error recalculating:", error)
      alert("Erro ao recalcular rota. Tente novamente.")
    } finally {
      setRecalculating(false)
      setShowRecalculateModal(false)
    }
  }



  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  if (!planData) return null

  return (
    <DashboardLayout>
      <RecalculateDialog 
        isOpen={showRecalculateModal} 
        onClose={() => setShowRecalculateModal(false)}
        onConfirm={handleConfirmRecalculate}
        currentGoal={planData.title}
      />


      
      {/* --- Hero Section: The North Star --- */}
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900 to-black p-5 md:p-12">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/20 rounded-full blur-[100px] opacity-50 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium uppercase tracking-wider">
              <Target className="h-3 w-3" />
              Objetivo Principal
            </div>
            <h1 className="text-2xl md:text-4xl font-heading font-bold text-white tracking-tight">
              {planData.title}
            </h1>
            <p className="text-gray-400 text-base md:text-lg leading-relaxed">
              {planData.description}
            </p>
          </div>

          <div className="flex flex-col items-end gap-4 w-full lg:w-auto lg:min-w-[200px]">
            <StreakWidget streak={streak} perfectWeeks={perfectWeeks} />

            {!isPremium && (
              <div 
                className="w-full p-3 rounded-xl bg-gradient-to-r from-primary/10 to-orange-500/10 border border-primary/20 cursor-pointer hover:border-primary/40 transition-all flex items-center justify-between group"
                onClick={() => setShowUpgradeModal(true)}
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/20 text-primary">
                    <Lock className="w-3 h-3" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">Modo Gratuito</h4>
                    <p className="text-[10px] text-gray-400">Liberar IA Premium</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-colors" />
              </div>
            )}
            
            <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:justify-start w-full mt-2 gap-2">
              <span className="text-sm text-gray-500 lg:order-2">Concluído</span>
              <div className="text-3xl md:text-4xl font-bold text-white lg:order-1">{planData.progress}%</div>
            </div>
            
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-1000 ease-out" 
                style={{ width: `${planData.progress}%` }}
              />
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRecalculateClick}
              disabled={recalculating}
              className="w-full lg:w-auto border-white/10 hover:bg-white/5 text-gray-400 hover:text-white text-xs"
            >
              {recalculating ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Recalculando...
                </>
              ) : (
                <>
                  <MapIcon className="mr-2 h-3 w-3" /> Recalcular Rota
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* --- The Journey (Timeline) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Timeline */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MapIcon className="h-5 w-5 text-primary" />
              Seu Roteiro de Execução
            </h2>
            <span className="text-xs md:text-sm text-gray-500">Atualizado hoje</span>
          </div>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 md:before:ml-6 before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-primary before:via-gray-800 before:to-transparent before:h-full">
            
            {planData.quarters.map((quarter: any, index: number) => {
              const isLocked = quarter.status === "locked"
              const isCurrent = quarter.status === "current"

              return (
                <motion.div 
                  key={quarter.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative pl-12 md:pl-16 ${isLocked ? "opacity-50 grayscale" : ""}`}
                >
                  {/* Timeline Node */}
                  <div className={`absolute left-1 md:left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 bg-gray-950 transition-colors ${isCurrent ? "border-primary shadow-[0_0_15px_rgba(34,197,94,0.5)]" : "border-gray-800"}`}>
                    {isLocked ? (
                      <Lock className="h-3 w-3 text-gray-500" />
                    ) : (
                      <div className={`h-2.5 w-2.5 rounded-full ${isCurrent ? "bg-primary animate-pulse" : "bg-gray-600"}`} />
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`rounded-xl border transition-all duration-300 ${isCurrent ? "bg-white/5 border-primary/30 shadow-lg shadow-primary/5" : "bg-gray-900/20 border-white/5 hover:border-white/10"}`}>
                    <div 
                      className="p-4 md:p-5 cursor-pointer flex items-center justify-between"
                      onClick={() => !isLocked && setExpandedQuarter(expandedQuarter === quarter.id ? null : quarter.id)}
                    >
                      <div className="flex-1 pr-2">
                        <div className="flex items-center gap-3 mb-1 flex-wrap">
                          <span className={`text-xs font-bold uppercase tracking-wider ${isCurrent ? "text-primary" : "text-gray-500"}`}>
                            {quarter.quarter} • {quarter.period}
                          </span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-black">
                              EM ANDAMENTO
                            </span>
                          )}
                        </div>
                        <h3 className="text-base md:text-lg font-medium text-white leading-tight">{quarter.focus}</h3>
                      </div>
                      {!isLocked && (
                        <ChevronRight className={`h-5 w-5 text-gray-500 transition-transform ${expandedQuarter === quarter.id ? "rotate-90" : ""}`} />
                      )}
                    </div>

                    {/* Actions List (Expanded) */}
                    {expandedQuarter === quarter.id && !isLocked && (
                      <div className="px-3 md:px-5 pb-5 space-y-3 border-t border-white/5 pt-4">
                        {quarter.actions.map((action: any) => (
                          <div key={action.id} className="group flex gap-3 md:gap-4 p-2 md:p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                            <div className="mt-1">
                              <button 
                                onClick={() => handleToggleAction(action.globalIndex)}
                                className="focus:outline-none transition-transform active:scale-90 p-1 -m-1"
                                title={action.status === "feito" ? "Desmarcar" : "Marcar como feito"}
                              >
                                {action.status === "feito" ? (
                                  <CheckCircle2 className="h-5 w-5 text-primary" />
                                ) : (
                                  <Circle className="h-5 w-5 text-gray-600 group-hover:text-primary transition-colors" />
                                )}
                              </button>
                            </div>
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-mono text-gray-500">Semana {action.week}</span>
                                  <span className="text-[10px] uppercase tracking-wider text-primary/70 border border-primary/20 px-1.5 py-0.5 rounded">Sugestão</span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2">
                                  <button 
                                    onClick={() => setSelectedTask(action)}
                                    className="md:opacity-0 md:group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-opacity"
                                    title="Ver detalhes"
                                  >
                                    <Info className="h-3 w-3" />
                                  </button>
                                  {editingActionId !== action.id && (
                                    <button 
                                      onClick={() => handleStartEdit(action)}
                                      className="md:opacity-0 md:group-hover:opacity-100 p-1 text-gray-500 hover:text-white transition-opacity"
                                    >
                                      <Pencil className="h-3 w-3" />
                                    </button>
                                  )}
                                </div>
                              </div>

                              {editingActionId === action.id ? (
                                <div className="space-y-2 mt-2">
                                  <input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    className="w-full bg-black/50 border border-white/20 rounded px-2 py-1 text-base md:text-lg text-white focus:border-primary outline-none"
                                    placeholder="Título da tarefa"
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <Button size="sm" onClick={() => handleSaveEdit(action.globalIndex)} className="h-7 text-xs bg-primary text-black hover:bg-primary/90">
                                      <Save className="h-3 w-3 mr-1" /> Salvar
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={handleCancelEdit} className="h-7 text-xs text-gray-400 hover:text-white">
                                      <X className="h-3 w-3 mr-1" /> Cancelar
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <h4 className={`text-base md:text-lg font-medium break-words ${action.status === "feito" ? "text-gray-500 line-through" : "text-white"}`}>
                                    {action.title}
                                  </h4>
                                  <p className="text-sm md:text-lg text-gray-400 leading-relaxed break-words">
                                    {action.instruction}
                                  </p>
                                </>
                              )}


                              {editingActionId !== action.id && action.status === "pendente" && (
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={() => handleToggleAction(action.globalIndex)}
                                  className="mt-2 h-7 text-xs border-white/10 hover:bg-primary hover:text-black hover:border-primary transition-all"
                                >
                                  Marcar como Feito
                                </Button>
                              )}
                              {editingActionId !== action.id && action.status === "feito" && (
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleToggleAction(action.globalIndex)}
                                  className="mt-2 h-7 text-xs text-gray-500 hover:text-white transition-all"
                                >
                                  Desmarcar
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Right Column: Stats & Motivation */}
        <div className="space-y-6">
          
          {/* Next Action Card */}
          <div className="rounded-xl border border-white/10 bg-gradient-to-b from-gray-900 to-black p-6 sticky top-24">
            <div className="flex items-center gap-2 mb-4 text-primary">
              <PlayCircle className="h-5 w-5" />
              <span className="font-bold text-sm uppercase tracking-wide">Próximo Passo</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              {planData.quarters[0].actions[0]?.title || "Definir próximo passo"}
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              {planData.quarters[0].actions[0]?.instruction || "Comece sua jornada agora."}
            </p>
            <Button className="w-full bg-primary text-black hover:bg-primary/90 font-bold">
              Iniciar Tarefa <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 text-center">
              <div className="text-2xl font-bold text-white">52</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Semanas Restantes</div>
            </div>
            <div className="p-4 rounded-xl bg-gray-900/50 border border-white/5 text-center">
              <div className="text-2xl font-bold text-white">100%</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Foco no Q1</div>
            </div>
          </div>

        </div>
      </div>
      {/* Task Details Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTask(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0F0F11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono text-primary">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                        Semana {selectedTask.week}
                      </span>
                      <span className={selectedTask.status === "feito" ? "text-green-500" : "text-gray-500"}>
                        {selectedTask.status === "feito" ? "Concluído" : "Pendente"}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white leading-tight">
                      {selectedTask.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedTask(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Description */}
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Info className="h-4 w-4 text-primary" />
                      Detalhes da Execução
                    </h4>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {selectedTask.description || selectedTask.instruction || "Sem descrição detalhada disponível."}
                    </p>
                  </div>

                  {/* Checklist */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-primary" />
                      Checklist
                    </h4>
                    <div className="space-y-2">
                      {taskChecklist.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-3 group">
                          <button
                            onClick={() => {
                              const newChecklist = [...taskChecklist]
                              newChecklist[index].checked = !newChecklist[index].checked
                              setTaskChecklist(newChecklist)
                              handleSaveTaskDetails(selectedTask.globalIndex, { checklist: newChecklist })
                            }}
                            className={`h-5 w-5 rounded border flex items-center justify-center transition-colors ${item.checked ? "bg-primary border-primary text-black" : "border-gray-600 hover:border-primary"}`}
                          >
                            {item.checked && <CheckCircle2 className="h-3 w-3" />}
                          </button>
                          <span className={`flex-1 text-sm ${item.checked ? "text-gray-500 line-through" : "text-gray-300"}`}>
                            {item.text}
                          </span>
                          <button
                            onClick={() => {
                              const newChecklist = taskChecklist.filter((_, i) => i !== index)
                              setTaskChecklist(newChecklist)
                              handleSaveTaskDetails(selectedTask.globalIndex, { checklist: newChecklist })
                            }}
                            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Plus className="h-4 w-4 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Adicionar item..."
                          className="bg-transparent border-none text-sm text-white placeholder:text-gray-600 focus:ring-0 p-0 w-full"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              const val = (e.target as HTMLInputElement).value
                              if (val.trim()) {
                                const newChecklist = [...taskChecklist, { text: val, checked: false }]
                                setTaskChecklist(newChecklist)
                                handleSaveTaskDetails(selectedTask.globalIndex, { checklist: newChecklist })
                                ;(e.target as HTMLInputElement).value = ""
                              }
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Notas & Observações
                    </h4>
                    <textarea
                      value={taskNotes}
                      onChange={(e) => setTaskNotes(e.target.value)}
                      onBlur={() => handleSaveTaskDetails(selectedTask.globalIndex, { notes: taskNotes })}
                      placeholder="Registre aqui seus aprendizados, links importantes ou observações sobre esta tarefa..."
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-gray-300 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-white/5">
                    <Button 
                      className={`flex-1 ${selectedTask.status === "feito" ? "bg-white/10 text-white hover:bg-white/20" : "bg-primary text-black hover:bg-primary/90"}`}
                      onClick={() => {
                        handleToggleAction(selectedTask.globalIndex);
                        setSelectedTask((prev: any) => ({ ...prev, status: prev.status === "feito" ? "pendente" : "feito" }));
                      }}
                    >
                      {selectedTask.status === "feito" ? "Reabrir Tarefa" : "Concluir Tarefa"}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
