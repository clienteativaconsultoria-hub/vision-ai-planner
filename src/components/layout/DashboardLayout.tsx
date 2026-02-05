import { useState, useEffect } from "react"
import { 
  LayoutDashboard, 
  Map, 
  Target, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronRight,
  ChevronLeft
} from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"
import { useNavigate, useLocation } from "react-router-dom"
import { AIChat } from "@/components/ai/AIChat"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [userEmail, setUserEmail] = useState("Carregando...")
  const [userInitials, setUserInitials] = useState("...")
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email) {
        setUserEmail(user.email)
        setUserInitials(user.email.substring(0, 2).toUpperCase())
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const navItems = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
    { icon: Map, label: "Roteiro 2026", href: "/roadmap" },
    { icon: Target, label: "Metas & KPIs", href: "/goals" },
    { icon: Settings, label: "Configurações", href: "/settings" },
  ]

  return (
    <div className="min-h-screen bg-background text-white font-sans flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 h-full bg-[#0F0F11] border-r border-white/5 transition-all duration-300 ease-in-out md:relative flex flex-col",
          isSidebarOpen ? "w-64 translate-x-0" : "-translate-x-full w-64 md:w-20 md:translate-x-0"
        )}
      >
        <div className={cn("h-16 flex items-center border-b border-white/5 overflow-hidden whitespace-nowrap shrink-0", isSidebarOpen ? "px-6" : "px-0 justify-center")}>
          <span className={cn("text-lg font-bold tracking-tight transition-opacity duration-300", !isSidebarOpen && "opacity-0 md:opacity-100 md:hidden")}>
            Vision<span className="text-primary">.ai</span>
          </span>
          {!isSidebarOpen && (
             <span className="hidden md:block text-lg font-bold tracking-tight text-primary">V.</span>
          )}
        </div>

        <div className="p-4 space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-lg font-medium transition-colors whitespace-nowrap overflow-hidden",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary" 
                  : "text-gray-400 hover:text-white hover:bg-white/5",
                !isSidebarOpen && "justify-center px-2"
              )}
              title={!isSidebarOpen ? item.label : undefined}
            >
              <item.icon className="h-4 w-4 min-w-[16px]" />
              <span className={cn("transition-opacity duration-300", !isSidebarOpen && "opacity-0 w-0 hidden")}>
                {item.label}
              </span>
            </a>
          ))}
        </div>

        <div className={cn("p-4 shrink-0 transition-all duration-300", !isSidebarOpen && "px-2")}>
          <div className={cn("rounded-xl bg-gradient-to-br from-gray-900 to-black border border-white/5 overflow-hidden transition-all duration-300", isSidebarOpen ? "p-4" : "p-2 bg-transparent border-0 flex justify-center")}>
            <div className={cn("flex items-center gap-3", isSidebarOpen ? "mb-3" : "mb-0")}>
              <div className="h-8 w-8 min-w-[32px] rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {userInitials}
              </div>
              {isSidebarOpen && (
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{userEmail}</p>
                  <p className="text-xs text-gray-500 truncate">PRO Plan</p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="w-full justify-start text-gray-400 hover:text-red-400 pl-0"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            )}
          </div>
        </div>

        {/* Toggle Button (Desktop) */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={cn(
            "hidden md:flex absolute -right-3 top-20 h-6 w-6 bg-gray-900 border border-white/10 rounded-full items-center justify-center text-gray-400 hover:text-white hover:border-primary transition-colors z-50",
            !isSidebarOpen && "top-24" // Adjust position slightly when collapsed if needed, or keep consistent
          )}
        >
          {isSidebarOpen ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        </button>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-16 border-b border-white/5 bg-[#0A0A0B]/50 backdrop-blur-xl flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Breadcrumbs / Page Title */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500">
              <span>Dashboard</span>
              <ChevronRight className="h-4 w-4" />
              <span className="text-white font-medium">Visão Geral</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notification Bell Removed */}
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-6xl mx-auto space-y-8">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <AIChat />
    </div>
  )
}
