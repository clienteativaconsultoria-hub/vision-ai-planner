import { Button } from "@/components/ui/Button"
import { Check, Sparkles, Loader2, Lock } from "lucide-react"
import { motion } from "framer-motion"

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isLoading?: boolean
}

export function UpgradeModal({ isOpen, onClose, onConfirm, isLoading }: UpgradeModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-md bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header Visual */}
        <div className="h-32 bg-gradient-to-br from-primary/20 via-orange-500/10 to-purple-500/10 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.4)] z-10">
            <Lock className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Desbloqueie o Poder Total</h2>
            <p className="text-gray-400 text-sm">
              A função de Recalcular Rota e o acesso ilimitado à IA são exclusivos do plano Vision AI Pro.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="p-1 rounded-full bg-green-500/20">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-gray-200 text-sm font-medium">Recálculo Infinito de Rotas</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="p-1 rounded-full bg-green-500/20">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-gray-200 text-sm font-medium">Mentor IA disponível 24/7</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
              <div className="p-1 rounded-full bg-green-500/20">
                <Check className="w-4 h-4 text-green-500" />
              </div>
              <span className="text-gray-200 text-sm font-medium">Acesso ao Dashboard Completo</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={onConfirm} 
              disabled={isLoading}
              className="w-full h-12 text-base font-bold bg-primary hover:bg-orange-500 text-white shadow-lg shadow-orange-500/20"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  Assinar Vision Pro - R$ 49,90
                  <Sparkles className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
            <button 
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-500 text-sm hover:text-white transition-colors py-2"
            >
              Voltar ao plano gratuito
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
