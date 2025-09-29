import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Heart, ArrowRight, Check, Star, Shield, Calendar } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface OnboardingScreenProps {
  userName: string
  onComplete: () => void
}

export function OnboardingScreen({ userName, onComplete }: OnboardingScreenProps) {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: `¡Bienvenido ${userName}! 🎉`,
      subtitle: "Te ayudamos a conectar con los mejores cuidados para tu mascota",
      image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMG93bmVyJTIwdmV0ZXJpbmFyaWFufGVufDF8fHx8MTc1OTEwOTUzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        { icon: Heart, title: "Perfiles Personalizados", description: "Crea perfiles detallados para cada mascota" },
        { icon: Star, title: "Proveedores Verificados", description: "Accede a profesionales calificados y confiables" },
        { icon: Calendar, title: "Citas Inteligentes", description: "Agenda y gestiona citas de forma sencilla" }
      ]
    },
    {
      title: "Encuentra Profesionales",
      subtitle: "Veterinarios, paseadores, estilistas y más cerca de ti",
      image: "https://images.unsplash.com/photo-1593275497414-473e94a9152a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHZldGVyaW5hcmlhbnxlbnwxfHx8fDE3NTkxMDk1MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        { icon: Shield, title: "Calidad Garantizada", description: "Todos nuestros proveedores están verificados" },
        { icon: Star, title: "Reseñas Reales", description: "Lee experiencias de otros dueños de mascotas" },
        { icon: Heart, title: "Cuidado Personalizado", description: "Servicios adaptados a las necesidades de tu mascota" }
      ]
    },
    {
      title: "Gestiona Todo en un Lugar",
      subtitle: "Historial médico, citas, recordatorios y más",
      image: "https://images.unsplash.com/photo-1625279138836-e7311d5c863a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBncm9vbWluZyUyMHNlcnZpY2V8ZW58MXx8fHwxNzU5MTIxNzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      features: [
        { icon: Calendar, title: "Recordatorios Automáticos", description: "Nunca olvides vacunas o revisiones importantes" },
        { icon: Heart, title: "Historial Completo", description: "Mantén un registro detallado de la salud de tu mascota" },
        { icon: Shield, title: "Datos Seguros", description: "Tu información y la de tu mascota están protegidas" }
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
            alt="Onboarding step"
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

        {/* Premium Badge (solo en el primer paso) */}
        {currentStep === 0 && (
          <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-primary-foreground/20 text-primary-foreground">
                      Prueba Gratis
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-1">Plan Premium - 7 días gratis</h3>
                  <p className="text-primary-foreground/80 text-sm">
                    Descuentos exclusivos y acceso prioritario
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-primary-foreground/80" />
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
              "Comenzar"
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