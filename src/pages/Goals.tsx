import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { supabase } from "@/lib/supabase"
import { 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Circle,
  Loader2,
  Trophy,
  X
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Goal {
  id: string
  title: string
  description: string | null
  status: 'ativo' | 'concluido'
  created_at: string
}

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newGoalTitle, setNewGoalTitle] = useState("")
  const [newGoalDescription, setNewGoalDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchGoals()
  }, [])

  const fetchGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setGoals(data || [])
    } catch (error) {
      console.error("Error fetching goals:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGoalTitle.trim()) return

    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: newGoalTitle,
          description: newGoalDescription,
          status: 'ativo'
        } as any)
        .select()
        .single()

      if (error) throw error

      setGoals([data, ...goals])
      setNewGoalTitle("")
      setNewGoalDescription("")
      setIsAdding(false)
    } catch (error) {
      console.error("Error adding goal:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const toggleGoalStatus = async (goal: Goal) => {
    const newStatus = goal.status === 'ativo' ? 'concluido' : 'ativo'
    
    // Optimistic update
    setGoals(goals.map(g => g.id === goal.id ? { ...g, status: newStatus } : g))

    try {
      const { error } = await (supabase.from('goals') as any)
        .update({ status: newStatus })
        .eq('id', goal.id)

      if (error) throw error
    } catch (error) {
      console.error("Error updating goal:", error)
      // Revert on error
      setGoals(goals.map(g => g.id === goal.id ? { ...g, status: goal.status } : g))
    }
  }

  const deleteGoal = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta meta?")) return

    setGoals(goals.filter(g => g.id !== id))

    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (error) {
      console.error("Error deleting goal:", error)
      fetchGoals() // Revert by refetching
    }
  }

  const activeGoals = goals.filter(g => g.status === 'ativo')
  const completedGoals = goals.filter(g => g.status === 'concluido')

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8 pb-12">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Target className="h-8 w-8 text-primary" />
              Metas & KPIs
            </h1>
            <p className="text-gray-400 mt-2">
              Defina e acompanhe seus objetivos principais além do plano estratégico.
            </p>
          </div>
          <Button onClick={() => setIsAdding(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Nova Meta
          </Button>
        </header>

        {/* Add Goal Modal */}
        <AnimatePresence>
          {isAdding && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Nova Meta</h2>
                  <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white">
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                <form onSubmit={handleAddGoal} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Título da Meta</label>
                    <Input
                      value={newGoalTitle}
                      onChange={(e) => setNewGoalTitle(e.target.value)}
                      placeholder="Ex: Atingir R$ 100k de faturamento mensal"
                      autoFocus
                      className="bg-white/5 border-white/10 text-white focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Descrição (Opcional)</label>
                    <textarea
                      value={newGoalDescription}
                      onChange={(e) => setNewGoalDescription(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors resize-none h-24"
                      placeholder="Detalhes sobre como atingir esta meta..."
                    />
                  </div>
                  <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={submitting || !newGoalTitle.trim()}>
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar Meta"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Active Goals */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Em Progresso ({activeGoals.length})
              </h2>
              
              {activeGoals.length === 0 && (
                <div className="text-center py-12 bg-white/5 rounded-xl border border-white/5 border-dashed">
                  <p className="text-gray-400">Nenhuma meta ativa no momento.</p>
                  <Button variant="link" onClick={() => setIsAdding(true)} className="text-primary mt-2">
                    Criar primeira meta
                  </Button>
                </div>
              )}

              <div className="grid gap-4">
                {activeGoals.map((goal) => (
                  <motion.div
                    key={goal.id}
                    layoutId={goal.id}
                    className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4 group hover:border-primary/50 transition-colors"
                  >
                    <button
                      onClick={() => toggleGoalStatus(goal)}
                      className="mt-1 text-gray-500 hover:text-primary transition-colors"
                    >
                      <Circle className="h-6 w-6" />
                    </button>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-white">{goal.title}</h3>
                      {goal.description && (
                        <p className="text-gray-400 text-sm mt-1">{goal.description}</p>
                      )}
                    </div>
                    <button
                      onClick={() => deleteGoal(goal.id)}
                      className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Completed Goals */}
            {completedGoals.length > 0 && (
              <div className="space-y-4 pt-8 border-t border-white/10">
                <h2 className="text-lg font-semibold text-gray-400 flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Concluídas ({completedGoals.length})
                </h2>
                
                <div className="grid gap-4 opacity-60">
                  {completedGoals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      layoutId={goal.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4"
                    >
                      <button
                        onClick={() => toggleGoalStatus(goal)}
                        className="mt-1 text-primary hover:text-primary/80 transition-colors"
                      >
                        <CheckCircle2 className="h-6 w-6" />
                      </button>
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-white line-through decoration-gray-500">{goal.title}</h3>
                        {goal.description && (
                          <p className="text-gray-500 text-sm mt-1">{goal.description}</p>
                        )}
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-gray-600 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
