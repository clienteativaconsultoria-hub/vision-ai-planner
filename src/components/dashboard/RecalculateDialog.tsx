import { Button } from "@/components/ui/Button"
import { useState } from "react"
import { Map, Loader2, X, AlertTriangle } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface RecalculateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newGoal: string, contextUpdates: string) => Promise<void>;
  currentGoal: string;
}

export function RecalculateDialog({ isOpen, onClose, onConfirm, currentGoal }: RecalculateDialogProps) {
  const [newGoal, setNewGoal] = useState(currentGoal);
  const [contextUpdates, setContextUpdates] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(newGoal, contextUpdates);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-lg bg-[#0F0F11] border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <Map className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Recalcular Rota</h3>
                <p className="text-sm text-gray-400">Ajuste o GPS para sua nova realidade.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg flex gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              <p className="text-sm text-yellow-200/80">
                Isso irá manter seu histórico de tarefas concluídas, mas irá regenerar todas as sugestões futuras baseadas no novo contexto.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Meta Principal (Opcional)</label>
              <input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                placeholder="Sua meta para 2026..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">O que mudou? (Novo Contexto)</label>
              <textarea
                value={contextUpdates}
                onChange={(e) => setContextUpdates(e.target.value)}
                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors min-h-[100px] resize-none"
                placeholder="Ex: O mercado mudou, consegui um investimento, perdi um funcionário chave, decidi focar em outro nicho..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="ghost" 
                onClick={onClose}
                className="flex-1 text-gray-400 hover:text-white"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-primary text-black hover:bg-primary/90 font-bold"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Recalculando...
                  </>
                ) : (
                  "Confirmar Nova Rota"
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
