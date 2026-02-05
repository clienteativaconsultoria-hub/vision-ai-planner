import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { BrainCircuit } from "lucide-react";

interface GenerationLoaderProps {
  isVisible: boolean;
}

const messages = [
  "Analisando sua meta...",
  "Consultando estratégias de mercado...",
  "Desenhando estrutura trimestral...",
  "Definindo tarefas táticas...",
  "Otimizando recursos...",
  "Finalizando seu plano..."
];

export function GenerationLoader({ isVisible }: GenerationLoaderProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setCurrentMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md"
        >
          <div className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-gray-900/90 shadow-2xl flex flex-col items-center text-center">
            
            <div className="relative w-20 h-20 mb-8">
              <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin" />
              <div className="absolute inset-2 rounded-full border-r-2 border-purple-500 animate-spin-slow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-white/80" />
              </div>
            </div>

            <motion.div
              key={currentMessageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="h-8 mb-2"
            >
              <h3 className="text-xl font-bold text-white">
                {messages[currentMessageIndex]}
              </h3>
            </motion.div>

            <p className="text-sm text-gray-400 mb-8">
              Isso pode levar alguns segundos. Nossa IA está trabalhando.
            </p>

            {/* Progress Bar Fake */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-purple-500"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
