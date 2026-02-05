import { Button } from "@/components/ui/Button"
import { useState } from "react"
import { Lock, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { useNavigate } from "react-router-dom"
import { caktoService } from "@/lib/cakto"

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthDialog({ isOpen, onClose }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleAuth = async () => {
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: email.split("@")[0], // Simple default name
            },
          },
        });
        if (error) throw error;
      }
      
      // Success
      onClose();
      if (isLogin) {
        navigate("/dashboard");
      } else {
        // Fluxo de Pagamento Obrigatório
        try {
          // 1. Criar Checkout
          const checkoutData = await caktoService.createCheckout({
            customer: {
              name: email.split("@")[0],
              email: email,
            },
            items: [
              {
                title: "Vision AI Pro - Acesso Vitalício (Oferta Especial)",
                unit_price: 49.90, // Validar preço
                quantity: 1,
                tangible: false
              }
            ]
          });

          // 2. Redirecionar
          if (checkoutData && checkoutData.checkout_url) {
             window.location.href = checkoutData.checkout_url;
          } else if (checkoutData && checkoutData.link) {
             window.location.href = checkoutData.link;
          } else {
             console.warn("Sem URL de checkout, indo para onboarding");
             alert("Aviso: Não foi possível gerar o link de pagamento. Redirecionando para o onboarding gratuito.");
             navigate("/onboarding");
          }
        } catch (paymentError: any) {
          console.error("Erro fatal Cakto:", paymentError);
          alert(`Erro ao conectar com pagamento: ${paymentError.message || "Erro desconhecido"}. \n\nVerifique o console (F12) para detalhes. Redirecionando para acesso gratuito temporário.`);
          navigate("/onboarding");
        }
      }

    } catch (err: any) {
      setError(err.message || "Ocorreu um erro. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-gray-950 border border-white/10 rounded-2xl p-8 relative overflow-hidden">
        {/* Glow Effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-20 bg-primary/10 blur-3xl -z-10" />

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Bem-vindo de volta" : "Desbloqueie seu Plano 2026"}
          </h2>
          <p className="text-gray-400">
            {isLogin 
              ? "Acesse sua estratégia e continue executando." 
              : "Crie uma conta gratuita para gerar e salvar sua estratégia personalizada."}
          </p>
        </div>

        <div className="space-y-4">
          {error && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1 uppercase">Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="••••••••"
            />
          </div>

          <Button 
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 text-lg shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              isLogin ? "Entrar" : "Criar Conta Grátis"
            )}
          </Button>

          <div className="text-center mt-4">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-sm text-gray-500 hover:text-white transition-colors"
            >
              {isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
            </button>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
