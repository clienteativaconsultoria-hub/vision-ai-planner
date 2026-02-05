import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import type { User } from "@supabase/supabase-js"

interface AppLayoutProps {
  children: React.ReactNode
  className?: string
  onAuthClick?: () => void
}

export function AppLayout({ children, className, onAuthClick }: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthAction = (e: React.MouseEvent) => {
    if (user) {
      navigate("/dashboard")
      return
    }
    
    if (onAuthClick) {
      e.preventDefault()
      onAuthClick()
    }
  }

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/20 selection:text-primary relative">
      
      {/* Header Clean & Minimal */}
      <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 group cursor-pointer">
            <span className="text-lg font-bold tracking-tight text-white">
              Vision<span className="text-primary">.ai</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Links removed as requested */}
          </nav>

          {/* CTA & Mobile Menu */}
          <div className="flex items-center gap-4">
            {!user && (
              <button onClick={handleAuthAction} className="hidden md:block text-sm font-medium text-white hover:text-primary transition-colors">
                Entrar
              </button>
            )}
            <Button size="sm" onClick={handleAuthAction} className="hidden md:flex bg-primary text-white hover:bg-primary/90 font-semibold">
              {user ? "Ir para Dashboard" : "Começar Agora"}
            </Button>
            
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-background/95 backdrop-blur-xl p-4 space-y-4 animate-accordion-down">
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              {!user && (
                <Button variant="ghost" onClick={handleAuthAction} className="w-full justify-start">Entrar</Button>
              )}
              <Button onClick={handleAuthAction} className="w-full bg-primary text-white hover:bg-primary/90">
                {user ? "Ir para Dashboard" : "Começar Agora"}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className={cn("relative", className)}>
        {children}
      </main>

      {/* Footer Minimal */}
      <footer className="border-t border-white/5 bg-black py-12">
        <div className="container mx-auto px-4 flex justify-center items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-400">Vision 2026 ©</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
