import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, Minimize2, Bot, Maximize2, X, Sparkles, User } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { sendChatMessage } from "@/lib/ai-service"
import type { ChatMessage } from "@/lib/ai-service"
import { motion, AnimatePresence } from "framer-motion"

// Simple bold text renderer
const renderMessage = (content: string) => {
  const parts = content.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-bold text-white">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Olá! Sou seu estrategista Vision. Estou pronto para analisar seus dados e definir os próximos passos para 2026. O que vamos conquistar hoje?' }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen, isExpanded])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const responseContent = await sendChatMessage(userMessage.content, messages)
      const assistantMessage: ChatMessage = { role: 'assistant', content: responseContent }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Failed to send message", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-black shadow-lg hover:bg-primary/90 transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
          >
            <MessageSquare className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Backdrop for Expanded Mode - REMOVED */}
      {/* <AnimatePresence>
        {isOpen && isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence> */}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              width: isExpanded ? "450px" : "380px",
              height: isExpanded ? "min(800px, 90vh)" : "600px",
              right: "1.5rem",
              bottom: "1.5rem",
              borderRadius: "1rem"
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-50 bg-[#0F0F11] border border-white/10 shadow-2xl flex flex-col overflow-hidden",
              isExpanded ? "max-h-[90vh]" : "max-h-[80vh]"
            )}
          >
            {/* Header */}
            <div className="h-16 bg-white/5 border-b border-white/5 flex items-center justify-between px-6 shrink-0">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center border border-primary/20">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    Vision AI
                    {isExpanded && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">Pro</span>}
                  </h3>
                  <p className="text-xs text-green-400 flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMessages([])}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                  title="Limpar conversa"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                  title={isExpanded ? "Minimizar" : "Expandir"}
                >
                  {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                  )}
                >
                  {/* Avatar */}
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                    msg.role === 'user' ? "bg-white/10" : "bg-primary/20"
                  )}>
                    {msg.role === 'user' ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-primary" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={cn(
                    "rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm",
                    msg.role === 'user' 
                      ? "bg-primary text-black font-medium rounded-tr-none" 
                      : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-none"
                  )}>
                    {renderMessage(msg.content)}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4 max-w-[85%]"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                    <Bot className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-5 py-4 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white/5 border-t border-white/5">
              <div className="relative flex items-center gap-2 bg-black/20 border border-white/10 rounded-xl p-2 focus-within:border-primary/50 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-transparent border-none text-white placeholder:text-gray-500 focus:ring-0 px-3 py-2 text-sm"
                  autoFocus
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "h-9 w-9 rounded-lg transition-all",
                    input.trim() ? "bg-primary text-black hover:bg-primary/90" : "bg-white/5 text-gray-500 hover:bg-white/10"
                  )}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center mt-2">
                <p className="text-[10px] text-gray-600 flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Vision AI Intelligence
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
