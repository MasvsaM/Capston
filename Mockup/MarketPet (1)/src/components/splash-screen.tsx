import { useEffect, useState } from "react"
import { Heart } from "lucide-react"

interface SplashScreenProps {
  onComplete: () => void
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(onComplete, 300) // Small delay for fade out animation
    }, 2000)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-b from-primary to-primary/80 flex items-center justify-center transition-opacity duration-300 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
      <div className="text-center">
        {/* Logo Animation */}
        <div className="relative mb-8">
          <div className={`w-24 h-24 bg-white rounded-3xl flex items-center justify-center transition-transform duration-1000 ${isLoading ? 'scale-100' : 'scale-110'}`}>
            <Heart className="w-12 h-12 text-primary animate-pulse" />
          </div>
          
          {/* Ripple Effect */}
          <div className="absolute inset-0 w-24 h-24 rounded-3xl border-4 border-white/30 animate-ping" />
          <div className="absolute inset-0 w-24 h-24 rounded-3xl border-2 border-white/20 animate-ping animation-delay-200" />
        </div>

        {/* Brand */}
        <h1 className="text-3xl font-bold text-white mb-2">MarketPet</h1>
        <p className="text-white/80 text-lg">Conectando mascotas con cuidados</p>

        {/* Loading Indicator */}
        <div className="mt-12">
          <div className="w-16 h-1 bg-white/20 rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-white rounded-full animate-pulse" style={{
              animation: 'loading 2s ease-out forwards'
            }} />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
      `}</style>
    </div>
  )
}