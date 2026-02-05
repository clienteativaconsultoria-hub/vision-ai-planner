import { Flame, Trophy } from "lucide-react"
import { motion } from "framer-motion"

interface StreakWidgetProps {
  streak: number
  perfectWeeks: number
}

export function StreakWidget({ streak, perfectWeeks }: StreakWidgetProps) {
  return (
    <div className="flex gap-4">
      {/* Daily Streak */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2"
      >
        <div className="h-8 w-8 rounded-full bg-orange-500/20 flex items-center justify-center">
          <Flame className={`h-5 w-5 text-orange-500 ${streak > 0 ? 'animate-pulse' : ''}`} />
        </div>
        <div>
          <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">Dias de Foco</p>
          <p className="text-lg font-bold text-white leading-none">{streak}</p>
        </div>
      </motion.div>

      {/* Perfect Weeks */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-4 py-2"
      >
        <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
          <Trophy className="h-5 w-5 text-yellow-500" />
        </div>
        <div>
          <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Semanas Perfeitas</p>
          <p className="text-lg font-bold text-white leading-none">{perfectWeeks}</p>
        </div>
      </motion.div>
    </div>
  )
}
