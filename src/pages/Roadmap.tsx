import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { supabase } from "@/lib/supabase"
import { motion } from "framer-motion"
import { 
  Calendar, 
  Flag, 
  Target, 
  ArrowRight, 
  CheckCircle2,
  Map as MapIcon,
  Loader2
} from "lucide-react"
import { useNavigate } from "react-router-dom"

const MONTHS = [
  "Janeiro", "Fevereiro", "Março",
  "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro",
  "Outubro", "Novembro", "Dezembro"
];

const QUARTERS = [
  { id: 'q1', label: 'Q1', title: 'Primeiro Trimestre', months: [0, 1, 2] },
  { id: 'q2', label: 'Q2', title: 'Segundo Trimestre', months: [3, 4, 5] },
  { id: 'q3', label: 'Q3', title: 'Terceiro Trimestre', months: [6, 7, 8] },
  { id: 'q4', label: 'Q4', title: 'Quarto Trimestre', months: [9, 10, 11] },
];

export default function Roadmap() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [plan, setPlan] = useState<any>(null)

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          navigate("/")
          return
        }

        const { data, error } = await supabase
          .from('strategic_plans')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) throw error
        
        if (!data) {
          navigate("/onboarding")
          return
        }

        // Map DB structure to UI structure
        const uiPlan = {
          ...data,
          quarters: data.quarters_data || { q1: [], q2: [], q3: [], q4: [] },
          monthlyFocus: data.monthly_focus || Array(12).fill("")
        }

        setPlan(uiPlan)
      } catch (error) {
        console.error("Error fetching plan:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPlan()
  }, [navigate])

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  if (!plan) return null

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        <header>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <MapIcon className="h-8 w-8 text-primary" />
            Roadmap 2026
          </h1>
          <p className="text-gray-400 mt-2">
            Visão macro do seu ano. Marcos trimestrais e focos mensais para atingir seu objetivo.
          </p>
        </header>

        <div className="relative space-y-12">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 bg-white/10" />

          {QUARTERS.map((quarter, qIndex) => {
            const quarterGoals = plan.quarters?.[quarter.id] || [];
            const isLeft = qIndex % 2 === 0;

            return (
              <motion.div
                key={quarter.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: qIndex * 0.1 }}
                className={`relative flex flex-col md:flex-row gap-8 ${isLeft ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Center Point */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-black z-10 top-8" />
                
                {/* Content Side */}
                <div className="flex-1 ml-12 md:ml-0 md:w-1/2">
                   <div className={`bg-gray-900/50 border border-white/5 rounded-2xl p-6 backdrop-blur-sm hover:border-primary/20 transition-all group ${!isLeft ? 'md:text-right' : ''}`}>
                      <div className={`flex items-center gap-3 mb-4 ${!isLeft ? 'md:flex-row-reverse' : ''}`}>
                        <span className="text-3xl font-bold text-white/10 group-hover:text-primary/20 transition-colors">
                          {quarter.label}
                        </span>
                        <h3 className="text-xl font-bold text-white">{quarter.title}</h3>
                      </div>

                      <div className="space-y-4">
                         <div className={`flex flex-col gap-2 ${!isLeft ? 'md:items-end' : ''}`}>
                            <span className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1">
                              <Flag className="h-3 w-3" /> Principais Marcos
                            </span>
                            <ul className={`space-y-2 ${!isLeft ? 'md:text-right' : ''}`}>
                              {quarterGoals.map((goal: string, i: number) => (
                                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                                  <CheckCircle2 className="h-4 w-4 text-primary release-shrink-0 mt-0.5" />
                                  <span>{goal}</span>
                                </li>
                              ))}
                            </ul>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Empty Side for Layout Balance */}
                <div className="flex-1 hidden md:block" />

                {/* Monthly Focus Row inside Quarter */}
                {/* Ideally we put monthly focus relative to the quarter, maybe under the card or integrated?
                    Let's integrating monthly focus INSIDE the card for better mobile view and cleaner UI.
                */}
              </motion.div>
            )
          })}
        </div>
        
        {/* Monthly Breakdown Grid */}
        <div className="mt-16 pt-16 border-t border-white/5">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Foco Mensal
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MONTHS.map((month, index) => (
              <div key={month} className="bg-gray-900/30 border border-white/5 rounded-xl p-4 hover:bg-gray-900/50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                   <span className="text-sm font-bold text-gray-400">{month}</span>
                   <span className="text-xs text-primary/50 font-mono">
                      Q{Math.floor(index / 3) + 1}
                   </span>
                </div>
                <p className="text-white text-sm leading-relaxed">
                  {plan.monthlyFocus[index] || "Foco não definido."}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

