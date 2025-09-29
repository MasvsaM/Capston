import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Heart, ArrowRight, Check, Star, Shield, Calendar, Users, TrendingUp, DollarSign } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface ProviderOnboardingProps {
  providerName: string
  businessName: string
  services: string[]
  onComplete: () => void
}

export function ProviderOnboarding({ providerName, businessName, services, onComplete }: ProviderOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: `¡Bienvenido ${providerName}! 🎉`,
      subtitle: "Tu perfil profesional está listo en MarketPet",
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBwZXQlMjBzZXJ2aWNlfGVufDF8fHx8MTc1OTEyMTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        { icon: Users, title: "Conecta con Clientes", description: "Miles de dueños de mascotas buscan tus servicios" },
        { icon: Calendar, title: "Gestiona tu Agenda", description: "Herramientas inteligentes para organizar tus citas" },
        { icon: Star, title: "Construye tu Reputación", description: "Sistema de reseñas para destacar tu calidad" }
      ]
    },
    {
      title: "Herramientas Profesionales",
      subtitle: "Todo lo que necesitas para hacer crecer tu negocio",
      image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRvb2xzJTIwcGV0fGVufDF8fHx8MTc1OTEyMTc0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        { icon: TrendingUp, title: "Analytics Detallados", description: "Métricas de rendimiento y crecimiento" },
        { icon: DollarSign, title: "Pagos Seguros", description: "Procesamiento automático de pagos" },
        { icon: Shield, title: "Verificación Premium", description: "Aumenta la confianza con nuestro sello de calidad" }
      ]
    },
    {
      title: "¡Listo para Comenzar!",
      subtitle: `${businessName} ya está visible para potenciales clientes`,
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzJTIwYnVzaW5lc3MlMjBwZXR8ZW58MXx8fHwxNzU5MTIxNzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        { icon: Check, title: "Perfil Completo", description: "Tu información profesional está lista" },
        { icon: Check, title: "Servicios Configurados", description: `${services.length} servicios disponibles` },
        { icon: Check, title: "Visible en Búsquedas", description: "Los clientes ya pueden encontrarte" }
      ]
    }
  ]

  const currentStepData = steps[currentStep]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="pt-safe-area-pt px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-primary-foreground" />
          </div>
          <Button variant="ghost" size="sm" onClick={handleSkip}>
            Omitir
          </Button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 space-y-6">
        {/* Hero Image */}
        <div className="w-full h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <ImageWithFallback
            src={currentStepData.image}
            alt="Provider onboarding step"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="font-bold text-2xl mb-2">{currentStepData.title}</h1>
          <p className="text-muted-foreground">{currentStepData.subtitle}</p>
        </div>

        {/* Features */}
        <div className="space-y-4">
          {currentStepData.features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="shadow-sm border-0">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Provider Badge (solo en el primer paso) */}
        {currentStep === 0 && (
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary-foreground/20 text-primary-foreground">
                      Proveedor Verificado
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1">Perfil Profesional Activo</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Tu negocio ya está visible en MarketPet
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary-foreground/80" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services Summary (solo en el último paso) */}
        {currentStep === steps.length - 1 && (
          <Card className="shadow-sm border-0">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Tus Servicios Activos</h3>
              <div className="flex flex-wrap gap-2">
                {services.map((service, index) => (
                  <Badge key={index} variant="secondary">
                    {service}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t safe-area-pb">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="flex-1 h-12"
            >
              Anterior
            </Button>
          )}
          <Button onClick={handleNext} className="flex-1 h-12">
            {currentStep === steps.length - 1 ? (
              "Ir al Dashboard"
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}