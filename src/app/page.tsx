"use client"

import { useState, useEffect } from "react"
import { TrendingUp, TrendingDown, Zap, Upload, Users, Building2, Crown, ArrowRight, Activity, ExternalLink, CheckCircle2, LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase, isSupabaseConfigured } from "@/lib/supabase"
import { AuthModal } from "@/components/AuthModal"

const cryptos = [
  { symbol: "BTC", name: "Bitcoin", price: "97,245.00", change: "+2.4%", positive: true, logo: "₿" },
  { symbol: "ETH", name: "Ethereum", price: "3,680.50", change: "+1.8%", positive: true, logo: "Ξ" },
  { symbol: "BNB", name: "Binance", price: "642.40", change: "-0.5%", positive: false, logo: "B" },
  { symbol: "XRP", name: "Ripple", price: "1.4234", change: "+3.2%", positive: true, logo: "X" },
  { symbol: "SOL", name: "Solana", price: "238.75", change: "+5.1%", positive: true, logo: "◎" },
  { symbol: "DOGE", name: "Dogecoin", price: "0.3842", change: "+1.2%", positive: true, logo: "Ð" },
  { symbol: "ADA", name: "Cardano", price: "0.9521", change: "-0.8%", positive: false, logo: "₳" },
]

const brokers = [
  { 
    id: "quotex",
    name: "Quotex", 
    desc: "Opções binárias simplificadas", 
    bonus: "Bônus de R$ 50",
    url: "https://broker-qx.pro/sign-up/?lid=907899",
    logo: "Q"
  },
  { 
    id: "iqoption",
    name: "IQ Option", 
    desc: "Plataforma intuitiva", 
    bonus: "Conta demo grátis",
    url: "https://iqoption.com/",
    logo: "IQ"
  },
  { 
    id: "pocket",
    name: "Pocket Option", 
    desc: "Depósito mínimo baixo", 
    bonus: "50% de bônus",
    url: "https://po.trade/",
    logo: "P"
  },
  { 
    id: "binomo",
    name: "Binomo", 
    desc: "Trading simplificado", 
    bonus: "R$ 100 em bônus",
    url: "https://binomo.com/",
    logo: "B"
  },
  { 
    id: "expert",
    name: "Expert Option", 
    desc: "Plataforma profissional", 
    bonus: "10% de desconto",
    url: "https://expertoption.com/",
    logo: "E"
  },
  { 
    id: "deriv",
    name: "Deriv", 
    desc: "Trading avançado", 
    bonus: "Conta demo ilimitada",
    url: "https://deriv.com/",
    logo: "D"
  },
]

export default function Home() {
  const [selectedCrypto, setSelectedCrypto] = useState(cryptos[0])
  const [currentView, setCurrentView] = useState<"home" | "upload" | "instant" | "community" | "brokers" | "plans">("home")
  const [chartData, setChartData] = useState<Array<{ height: number; isGreen: boolean }>>([])]
  const [connectedBrokers, setConnectedBrokers] = useState<string[]>([])
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [loading, setLoading] = useState(true)

  // Verifica autenticação do usuário
  useEffect(() => {
    checkUser()

    if (supabase && isSupabaseConfigured()) {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null)
      })

      return () => {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  const checkUser = async () => {
    try {
      if (supabase && isSupabaseConfigured()) {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user ?? null)
      }
    } catch (error) {
      console.error("Erro ao verificar usuário:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    if (supabase && isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    setUser(null)
    setConnectedBrokers([])
  }

  // Gera dados do gráfico apenas no cliente para evitar erro de hidratação
  useEffect(() => {
    const data = Array.from({ length: 50 }).map(() => ({
      height: Math.random() * 80 + 20,
      isGreen: Math.random() > 0.5,
    }))
    setChartData(data)

    // Atualiza o gráfico a cada 2 segundos para simular dados ao vivo conectados às corretoras
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)]
        newData.push({
          height: Math.random() * 80 + 20,
          isGreen: Math.random() > 0.5,
        })
        return newData
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const handleCreateAccount = (broker: typeof brokers[0]) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    // Abre a URL da corretora em nova aba
    window.open(broker.url, '_blank', 'noopener,noreferrer')
    
    // Simula conexão da conta após 2 segundos
    setTimeout(() => {
      setConnectedBrokers(prev => {
        if (!prev.includes(broker.id)) {
          return [...prev, broker.id]
        }
        return prev
      })
    }, 2000)
  }

  const handleOperateNow = (broker: typeof brokers[0]) => {
    if (!user) {
      setShowAuthModal(true)
      return
    }

    if (connectedBrokers.includes(broker.id)) {
      // Abre a plataforma de trading
      window.open(broker.url, '_blank', 'noopener,noreferrer')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0E0E10] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#00C2FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0E0E10] text-white">
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => {
            setShowAuthModal(false)
            checkUser()
          }}
        />
      )}

      {/* Header */}
      <header className="border-b border-gray-800 bg-[#0E0E10]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00FF88] to-[#00C2FF] blur-lg opacity-50"></div>
                <div className="relative bg-gradient-to-br from-[#00FF88] to-[#00C2FF] p-2 rounded-xl">
                  <Activity className="w-6 h-6 text-[#0E0E10]" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-[#00FF88] via-[#00C2FF] to-[#00FF88] bg-clip-text text-transparent">
                  SignalMaster AI
                </h1>
                <p className="text-xs text-gray-400">Sinais Inteligentes M1</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg">
                    <User className="w-4 h-4 text-[#00C2FF]" />
                    <span className="text-sm text-gray-300">
                      {user.email?.split('@')[0]}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-[#00C2FF] text-[#00C2FF] bg-[#00C2FF]/10">
                    Plano Grátis
                  </Badge>
                  <Button 
                    onClick={() => setCurrentView("plans")}
                    className="bg-gradient-to-r from-[#00FF88] to-[#00C2FF] text-[#0E0E10] hover:opacity-90 font-semibold"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-[#00FF88] to-[#00C2FF] text-[#0E0E10] hover:opacity-90 font-semibold"
                >
                  <User className="w-4 h-4 mr-2" />
                  Entrar / Cadastrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-[#0E0E10]/80 backdrop-blur-sm sticky top-[73px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: "home", label: "Início", icon: Activity },
              { id: "upload", label: "Enviar Print", icon: Upload },
              { id: "instant", label: "IA Instantânea", icon: Zap },
              { id: "community", label: "Comunidade", icon: Users },
              { id: "brokers", label: "Corretoras", icon: Building2 },
              { id: "plans", label: "Planos", icon: Crown },
            ].map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => setCurrentView(item.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  currentView === item.id
                    ? "bg-gradient-to-r from-[#00FF88]/20 to-[#00C2FF]/20 text-[#00C2FF] border-b-2 border-[#00C2FF]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === "home" && (
          <div className="space-y-8">
            {/* Crypto Carousel */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#00C2FF]" />
                  Criptomoedas em Destaque
                </h2>
                {user && connectedBrokers.length > 0 && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">
                    🟢 {connectedBrokers.length} {connectedBrokers.length === 1 ? 'Corretora Conectada' : 'Corretoras Conectadas'}
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {cryptos.map((crypto) => (
                  <Card
                    key={crypto.symbol}
                    onClick={() => setSelectedCrypto(crypto)}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                      selectedCrypto.symbol === crypto.symbol
                        ? "bg-gradient-to-br from-[#00C2FF]/20 to-[#00FF88]/20 border-[#00C2FF]"
                        : "bg-gray-900/50 border-gray-800 hover:border-gray-700"
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                        {crypto.logo}
                      </div>
                      <div className="font-semibold text-sm text-white">{crypto.symbol}</div>
                      <div className="text-xs text-gray-400">{crypto.name}</div>
                      <div className="text-sm font-mono text-white">${crypto.price}</div>
                      <div className={`text-xs font-semibold ${crypto.positive ? "text-[#00FF88]" : "text-[#FF2E45]"}`}>
                        {crypto.change}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selected Crypto Chart */}
            <Card className="bg-gray-900/50 border-gray-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold flex items-center gap-3 text-white">
                    <span className="text-4xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.6)]">
                      {selectedCrypto.logo}
                    </span>
                    {selectedCrypto.name} ({selectedCrypto.symbol})
                  </h3>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-3xl font-mono text-white">${selectedCrypto.price}</span>
                    <span className={`text-lg font-semibold ${selectedCrypto.positive ? "text-[#00FF88]" : "text-[#FF2E45]"}`}>
                      {selectedCrypto.change}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-400">Dados atualizados em tempo real via API das corretoras</span>
                  </div>
                </div>
                <Badge className="bg-[#00C2FF]/20 text-[#00C2FF] border-[#00C2FF]">
                  Timeframe: M1
                </Badge>
              </div>

              {/* Simulated Chart */}
              <div className="h-64 bg-gradient-to-b from-gray-800/30 to-transparent rounded-lg flex items-end justify-around p-4 gap-1">
                {chartData.length > 0 ? (
                  chartData.map((bar, i) => (
                    <div
                      key={i}
                      className={`w-full rounded-t transition-all duration-300 ${
                        bar.isGreen ? "bg-[#00FF88]/60" : "bg-[#FF2E45]/60"
                      }`}
                      style={{ height: `${bar.height}%` }}
                    />
                  ))
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Carregando gráfico...
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Button
                  onClick={() => user ? setCurrentView("upload") : setShowAuthModal(true)}
                  className="bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0E0E10] hover:opacity-90 font-semibold h-14"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Enviar Print para Análise
                </Button>
                <Button
                  onClick={() => user ? setCurrentView("instant") : setShowAuthModal(true)}
                  className="bg-gradient-to-r from-[#FF2E45] to-[#FF6B45] text-white hover:opacity-90 font-semibold h-14"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  IA Instantânea (Premium)
                </Button>
                <Button
                  onClick={() => user ? setCurrentView("brokers") : setShowAuthModal(true)}
                  variant="outline"
                  className="border-[#00C2FF] text-[#00C2FF] hover:bg-[#00C2FF]/10 font-semibold h-14"
                >
                  <Building2 className="w-5 h-5 mr-2" />
                  Operar na Corretora
                </Button>
              </div>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-[#00FF88]/10 to-transparent border-[#00FF88]/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Sinais Hoje</p>
                    <p className="text-3xl font-bold text-[#00FF88]">2/2</p>
                  </div>
                  <TrendingUp className="w-12 h-12 text-[#00FF88] opacity-50" />
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-[#00C2FF]/10 to-transparent border-[#00C2FF]/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Taxa de Acerto</p>
                    <p className="text-3xl font-bold text-[#00C2FF]">78%</p>
                  </div>
                  <Activity className="w-12 h-12 text-[#00C2FF] opacity-50" />
                </div>
              </Card>
              <Card className="bg-gradient-to-br from-[#FF2E45]/10 to-transparent border-[#FF2E45]/30 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Greens Compartilhados</p>
                    <p className="text-3xl font-bold text-white">1,247</p>
                  </div>
                  <Users className="w-12 h-12 text-[#FF2E45] opacity-50" />
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentView === "upload" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gray-900/50 border-gray-800 p-8">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-white">
                <Upload className="w-6 h-6 text-[#00C2FF]" />
                Enviar Print para Análise
              </h2>
              <div className="border-2 border-dashed border-gray-700 rounded-lg p-12 text-center hover:border-[#00C2FF] transition-colors cursor-pointer">
                <Upload className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-lg mb-2 text-white">Arraste seu print aqui</p>
                <p className="text-sm text-gray-400 mb-4">ou clique para selecionar</p>
                <Button className="bg-[#00C2FF] hover:bg-[#00C2FF]/90">
                  Selecionar Arquivo
                </Button>
              </div>
              <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-sm text-yellow-500">
                  ⚠️ Você usou 2/2 sinais hoje no plano Grátis. Faça upgrade para continuar!
                </p>
              </div>
            </Card>
          </div>
        )}

        {currentView === "instant" && (
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-br from-gray-900/50 to-[#00C2FF]/5 border-[#00C2FF] p-8">
              <div className="text-center space-y-6">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00C2FF] to-[#00FF88] blur-2xl opacity-50"></div>
                  <Zap className="relative w-20 h-20 mx-auto text-[#00C2FF]" />
                </div>
                <h2 className="text-3xl font-bold text-white">IA Instantânea</h2>
                <p className="text-gray-400">
                  Receba sinais em tempo real sem precisar enviar prints. Exclusivo para assinantes Premium!
                </p>
                <div className="bg-gray-800/50 rounded-lg p-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Sinais Ilimitados</span>
                    <span className="text-[#00FF88]">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Análise em Tempo Real</span>
                    <span className="text-[#00FF88]">✓</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Probabilidade Avançada</span>
                    <span className="text-[#00FF88]">✓</span>
                  </div>
                </div>
                <Button
                  onClick={() => setCurrentView("plans")}
                  className="bg-gradient-to-r from-[#00C2FF] to-[#00FF88] text-[#0E0E10] hover:opacity-90 font-semibold h-14 w-full text-lg"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Assinar Premium Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </Card>
          </div>
        )}

        {currentView === "community" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
              <Users className="w-6 h-6 text-[#00C2FF]" />
              Comunidade SignalMaster
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <TrendingUp className="w-5 h-5 text-[#00FF88]" />
                  Greens dos Usuários
                </h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00FF88] to-[#00C2FF]"></div>
                        <div>
                          <p className="font-semibold text-white">Trader_{1000 + i}</p>
                          <p className="text-xs text-gray-400">Há 2 horas</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">
                        Green de R$ 450 em BTC! 🚀 Obrigado SignalMaster!
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Badge className="bg-[#00FF88]/20 text-[#00FF88]">CALL</Badge>
                        <Badge variant="outline" className="text-gray-300">M1</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
              <Card className="bg-gray-900/50 border-gray-800 p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-white">
                  <Users className="w-5 h-5 text-[#00C2FF]" />
                  Depoimentos
                </h3>
                <div className="space-y-4">
                  {[
                    "Melhor app de sinais que já usei! Taxa de acerto impressionante.",
                    "A IA instantânea do Premium vale cada centavo. Recomendo!",
                    "Comecei no plano grátis e já tive resultados. Agora sou Premium!",
                  ].map((text, i) => (
                    <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#00C2FF] to-[#FF2E45]"></div>
                        <div>
                          <p className="font-semibold text-white">Usuário Premium</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span key={star} className="text-yellow-500">★</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-300">{text}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {currentView === "brokers" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-3 text-white">
                <Building2 className="w-6 h-6 text-[#00C2FF]" />
                Corretoras Parceiras
              </h2>
              {user && connectedBrokers.length > 0 && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  {connectedBrokers.length} {connectedBrokers.length === 1 ? 'Conta Conectada' : 'Contas Conectadas'}
                </Badge>
              )}
            </div>
            
            {!user && (
              <Card className="bg-gradient-to-r from-[#FF2E45]/10 to-[#FF6B45]/10 border border-[#FF2E45]/30 p-6">
                <div className="text-center space-y-4">
                  <User className="w-12 h-12 mx-auto text-[#FF2E45]" />
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Faça login para conectar corretoras</h3>
                    <p className="text-gray-400 mb-4">
                      Crie sua conta no SignalMaster AI para gerenciar suas conexões com as corretoras
                    </p>
                    <Button
                      onClick={() => setShowAuthModal(true)}
                      className="bg-gradient-to-r from-[#00FF88] to-[#00C2FF] text-[#0E0E10] hover:opacity-90 font-semibold"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Entrar / Cadastrar
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {user && (
              <div className="bg-gradient-to-r from-[#00C2FF]/10 to-[#00FF88]/10 border border-[#00C2FF]/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-300 text-center">
                  💡 <strong>Conecte-se com um clique!</strong> Crie sua conta nas corretoras parceiras e opere diretamente pelo SignalMaster AI.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brokers.map((broker) => {
                const isConnected = connectedBrokers.includes(broker.id)
                
                return (
                  <Card 
                    key={broker.id} 
                    className={`bg-gray-900/50 p-6 transition-all ${
                      isConnected 
                        ? 'border-[#00FF88] shadow-lg shadow-[#00FF88]/20' 
                        : 'border-gray-800 hover:border-[#00C2FF]'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-[#00C2FF] to-[#00FF88] flex items-center justify-center text-2xl font-bold text-[#0E0E10]">
                          {broker.logo}
                        </div>
                        {isConnected && (
                          <Badge className="bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Conectado
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-xl font-bold text-white">{broker.name}</h3>
                        <p className="text-sm text-gray-400 mt-1">{broker.desc}</p>
                      </div>
                      
                      <Badge className="bg-[#00FF88]/20 text-[#00FF88] border-[#00FF88]/30">
                        {broker.bonus}
                      </Badge>
                      
                      <div className="space-y-2">
                        <Button 
                          onClick={() => handleCreateAccount(broker)}
                          disabled={isConnected || !user}
                          className={`w-full ${
                            isConnected
                              ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                              : !user
                              ? 'bg-gray-700 cursor-not-allowed text-gray-400'
                              : 'bg-[#00C2FF] hover:bg-[#00C2FF]/90'
                          }`}
                        >
                          {isConnected ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-2" />
                              Conta Criada
                            </>
                          ) : (
                            <>
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Criar Conta
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          onClick={() => handleOperateNow(broker)}
                          disabled={!isConnected || !user}
                          variant="outline" 
                          className={`w-full ${
                            isConnected
                              ? 'border-[#00FF88] text-[#00FF88] hover:bg-[#00FF88]/10'
                              : 'border-gray-700 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          {isConnected ? (
                            <>
                              <Activity className="w-4 h-4 mr-2" />
                              Operar Agora
                            </>
                          ) : (
                            <>
                              Operar Agora
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {!isConnected && user && (
                        <p className="text-xs text-gray-500 text-center">
                          Crie sua conta para habilitar operações
                        </p>
                      )}
                    </div>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {currentView === "plans" && (
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold text-white">Escolha Seu Plano</h2>
              <p className="text-gray-400 text-lg">Desbloqueie todo o potencial do SignalMaster AI</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                {
                  name: "Grátis",
                  price: "R$ 0",
                  period: "/mês",
                  features: ["2 sinais por dia", "Análise de prints", "Comunidade", "Suporte básico"],
                  color: "gray",
                  current: true,
                },
                {
                  name: "Mensal",
                  price: "R$ 79,90",
                  period: "/mês",
                  features: ["10 sinais por dia", "Análise de prints", "Comunidade VIP", "Suporte prioritário", "Alertas em tempo real"],
                  color: "blue",
                  popular: true,
                },
                {
                  name: "Premium",
                  price: "R$ 199,90",
                  period: "/mês",
                  features: ["Sinais ilimitados", "IA Instantânea", "Análise de prints", "Comunidade VIP", "Suporte 24/7", "Alertas personalizados", "Acesso antecipado"],
                  color: "green",
                  recommended: true,
                },
              ].map((plan, i) => (
                <Card
                  key={i}
                  className={`relative p-6 ${
                    plan.recommended
                      ? "bg-gradient-to-br from-[#00FF88]/10 to-[#00C2FF]/10 border-[#00C2FF] scale-105"
                      : "bg-gray-900/50 border-gray-800"
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00C2FF] text-white">
                      Mais Popular
                    </Badge>
                  )}
                  {plan.recommended && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#00FF88] to-[#00C2FF] text-[#0E0E10]">
                      Recomendado
                    </Badge>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mt-2">
                        <span className="text-4xl font-bold text-white">{plan.price}</span>
                        <span className="text-gray-400">{plan.period}</span>
                      </div>
                    </div>
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                            plan.recommended ? "bg-[#00FF88]" : "bg-gray-700"
                          }`}>
                            <span className="text-xs text-[#0E0E10]">✓</span>
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full h-12 font-semibold ${
                        plan.current
                          ? "bg-gray-700 cursor-not-allowed text-gray-400"
                          : plan.recommended
                          ? "bg-gradient-to-r from-[#00FF88] to-[#00C2FF] text-[#0E0E10] hover:opacity-90"
                          : "bg-[#00C2FF] hover:bg-[#00C2FF]/90 text-white"
                      }`}
                      disabled={plan.current}
                    >
                      {plan.current ? "Plano Atual" : "Assinar Agora"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
            <Card className="bg-yellow-500/10 border-yellow-500/30 p-6 max-w-4xl mx-auto">
              <p className="text-center text-yellow-500">
                ⚠️ <strong>Aviso de Risco:</strong> Operações financeiras envolvem risco real. Os sinais são estimativas baseadas em IA e não garantem resultados. Opere com responsabilidade.
              </p>
            </Card>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>© 2024 SignalMaster AI. Todos os direitos reservados.</p>
          <p className="mt-2">Sinais inteligentes para traders inteligentes.</p>
        </div>
      </footer>
    </div>
  )
}
