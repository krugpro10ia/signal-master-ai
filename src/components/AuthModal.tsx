"use client"

import { useState } from "react"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X, Mail, Lock, User, AlertCircle } from "lucide-react"

interface AuthModalProps {
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Verifica se Supabase está configurado
  if (!isSupabaseConfigured() || !supabase) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="bg-[#1a1a1a] border-gray-800 p-8 max-w-md w-full relative">
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/20 mb-4">
              <AlertCircle className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Configuração Necessária
            </h2>
            <p className="text-gray-400 text-sm">
              Para usar o sistema de autenticação, você precisa configurar o Supabase.
            </p>
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-left">
              <p className="text-sm text-yellow-500 mb-2">
                <strong>Como configurar:</strong>
              </p>
              <ol className="text-xs text-gray-400 space-y-1 list-decimal list-inside">
                <li>Clique no banner laranja no topo da página</li>
                <li>Ou vá em Configurações → Integrações → Supabase</li>
                <li>Conecte sua conta do Supabase</li>
              </ol>
            </div>
            <Button
              onClick={onClose}
              className="w-full bg-[#00C2FF] hover:bg-[#00C2FF]/90"
            >
              Entendi
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        if (data.user) {
          onSuccess()
        }
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        })

        if (error) throw error

        if (data.user) {
          setError("Conta criada! Verifique seu email para confirmar.")
          setTimeout(() => {
            setIsLogin(true)
            setError("")
          }, 3000)
        }
      }
    } catch (err: any) {
      setError(err.message || "Erro ao processar autenticação")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-[#1a1a1a] border-gray-800 p-8 max-w-md w-full relative">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#00FF88] to-[#00C2FF] mb-4">
            <User className="w-8 h-8 text-[#0E0E10]" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? "Entrar no SignalMaster" : "Criar Conta"}
          </h2>
          <p className="text-gray-400 text-sm">
            {isLogin
              ? "Acesse sua conta para continuar"
              : "Crie sua conta gratuitamente"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nome Completo
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00C2FF]"
                  placeholder="Seu nome"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00C2FF]"
                placeholder="seu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-[#00C2FF]"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>
          </div>

          {error && (
            <div
              className={`p-3 rounded-lg text-sm ${
                error.includes("criada")
                  ? "bg-green-500/10 border border-green-500/30 text-green-400"
                  : "bg-red-500/10 border border-red-500/30 text-red-400"
              }`}
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0E0E10] hover:opacity-90 font-semibold h-12"
          >
            {loading
              ? "Processando..."
              : isLogin
              ? "Entrar"
              : "Criar Conta"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
            }}
            className="text-sm text-[#00C2FF] hover:underline"
          >
            {isLogin
              ? "Não tem conta? Cadastre-se"
              : "Já tem conta? Faça login"}
          </button>
        </div>
      </Card>
    </div>
  )
}
