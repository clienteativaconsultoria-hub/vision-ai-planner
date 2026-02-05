import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { supabase } from "@/lib/supabase"
// import { useNavigate } from "react-router-dom"
import { 
  Settings as SettingsIcon, 
  User, 
  CreditCard, 
  Loader2,
  Save,
  X,
  Copy
} from "lucide-react"
import { motion } from "framer-motion"

export default function Settings() {
  const navigate = useNavigate()
  const [showSupportModal, setShowSupportModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    getProfile()
  }, [])

  const getProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        navigate("/auth")
        return
      }

      setUser(user)
      setEmail(user.email || "")

      const { data, error } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      if (data) {
        setFullName(data.full_name || "")
      }
    } catch (error) {
      console.error("Error loading user data:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: fullName,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      alert("Perfil atualizado com sucesso!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Erro ao atualizar perfil.")
    } finally {
      setSaving(false)
    }
  }

  /*
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate("/auth")
  }
  */

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 pb-12">
        <header className="px-2 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
            <SettingsIcon className="h-6 w-6 md:h-8 md:w-8 text-primary" />
            Configurações
          </h1>
          <p className="text-gray-400 mt-2 text-sm md:text-base">
            Gerencie seus dados pessoais e preferências da conta.
          </p>
        </header>

        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-[240px_1fr]">
          {/* Sidebar Navigation (Visual only for now) */}
          <nav className="space-y-2 hidden md:block">
            <Button variant="ghost" className="w-full justify-start gap-2 bg-white/5 text-white">
              <User className="h-4 w-4" />
              Perfil
            </Button>
          </nav>

          {/* Content Area */}
          <div className="space-y-6">
            {/* Profile Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 md:p-6 space-y-6"
            >
              <div>
                <h2 className="text-lg md:text-xl font-bold text-white mb-1">Informações do Perfil</h2>
                <p className="text-sm text-gray-400">Atualize suas informações de identificação.</p>
              </div>

              <form onSubmit={updateProfile} className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-300">Email</label>
                  <Input 
                    value={email} 
                    disabled 
                    className="bg-black/20 border-white/5 text-gray-500 cursor-not-allowed" 
                  />
                  <p className="text-xs text-gray-500">O email não pode ser alterado.</p>
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium text-gray-300">Nome Completo</label>
                  <Input 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)}
                    className="bg-black/20 border-white/10 text-white focus:border-primary"
                    placeholder="Seu nome"
                  />
                </div>

                <div className="pt-4 flex justify-end">
                  <Button type="submit" disabled={saving} className="gap-2">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </motion.div>

            {/* Subscription Placeholder */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">Plano Atual</h2>
                  <p className="text-sm text-gray-400">Você está no <span className="text-primary font-bold">PRO Plan</span></p>
                </div>
                <span className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/20">
                  ATIVO
                </span>
              </div>
              <div className="h-px bg-white/5" />
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-sm text-gray-400">
                  <span>Membro desde: {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '...'}</span>
                  <button 
                    onClick={() => setShowSupportModal(true)}
                    className="text-primary hover:text-primary/80 font-medium text-sm transition-colors"
                  >
                    Gerenciar Assinatura
                  </button>
                </div>
                <p className="text-xs text-gray-500 italic mt-1">
                  * Todo gerenciamento de assinatura, upgrades ou cancelamentos deve ser tratado diretamente via suporte por email.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-950 border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
          >
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-primary/10 blur-3xl -z-10" />

            <button 
              onClick={() => setShowSupportModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            
            <div className="mb-6 flex justify-center">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <CreditCard className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h3 className="text-xl font-bold text-white text-center mb-2">Suporte à Assinatura</h3>
            <p className="text-gray-400 text-center text-sm mb-6 leading-relaxed">
              Para fazer upgrades, cancelar sua assinatura ou tirar dúvidas sobre pagamentos, entre em contato com nossa equipe.
            </p>
            
            <div className="bg-white/5 rounded-xl p-4 flex items-center justify-between border border-white/5 hover:border-primary/20 transition-colors group">
              <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">andrei@futuree.org</span>
              <Button 
                variant="ghost" 
                size="sm"
                className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                onClick={() => {
                  navigator.clipboard.writeText("andrei@futuree.org");
                  alert("Email copiado para a área de transferência!");
                }}
                title="Copiar email"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="mt-4 text-center">
                <a 
                    href="mailto:andrei@futuree.org?subject=Suporte%20Vision%20AI" 
                    className="text-xs text-primary hover:underline"
                >
                    Enviar email agora
                </a>
            </div>

          </motion.div>
        </div>
      )}
    </DashboardLayout>
  )
}