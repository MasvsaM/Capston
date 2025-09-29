import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent } from "./ui/card"
import { Separator } from "./ui/separator"
import { Heart, Mail, Lock, Eye, EyeOff, Phone } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void
  onRegister: (email: string, password: string, name: string, phone: string) => void
  onProviderRegister: (email: string, password: string, name: string, phone: string) => void
  onSocialLogin: (provider: 'google' | 'facebook') => void
}

export function LoginScreen({ onLogin, onRegister, onProviderRegister, onSocialLogin }: LoginScreenProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isProviderMode, setIsProviderMode] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    phone: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLogin) {
      onLogin(formData.email, formData.password)
    } else if (isProviderMode) {
      onProviderRegister(formData.email, formData.password, formData.name, formData.phone)
    } else {
      onRegister(formData.email, formData.password, formData.name, formData.phone)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="pt-safe-area-pt px-4 py-8 text-center">
        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-primary mb-2">MarketPet</h1>
        <p className="text-muted-foreground">
          {isLogin 
            ? "Bienvenido de vuelta" 
            : "Conecta con los mejores cuidados para tu mascota"
          }
        </p>
      </div>

      {/* Hero Image */}
      <div className="px-4 mb-8">
        <div className="w-full h-48 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMG93bmVyJTIwdmV0ZXJpbmFyaWFufGVufDF8fHx8MTc1OTEwOTUzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Happy pet owner"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Login Form */}
      <div className="px-4 space-y-4">
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h2 className="font-semibold text-xl mb-1">
                {isLogin 
                  ? "Iniciar Sesión" 
                  : isProviderMode 
                    ? "Registro de Proveedor" 
                    : "Crear Cuenta"
                }
              </h2>
              <p className="text-muted-foreground text-sm">
                {isLogin 
                  ? "Accede a tu cuenta para continuar" 
                  : isProviderMode
                    ? "Ofrece tus servicios en MarketPet"
                    : "Únete a la comunidad MarketPet"
                }
              </p>
            </div>

            {/* User Type Selector - only shown when not in login mode */}
            {!isLogin && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted rounded-lg">
                  <Button
                    type="button"
                    variant={!isProviderMode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIsProviderMode(false)}
                    className="h-8"
                  >
                    Cliente
                  </Button>
                  <Button
                    type="button"
                    variant={isProviderMode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIsProviderMode(true)}
                    className="h-8"
                  >
                    Proveedor
                  </Button>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nombre completo</label>
                  <Input
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="h-12"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="h-12 pl-10"
                    required
                  />
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Teléfono</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+56 9 1234 5678"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="h-12 pl-10"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium">Contraseña</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="h-12 pl-10 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {isLogin && (
                <div className="text-right">
                  <Button variant="link" size="sm" className="p-0 h-auto">
                    ¿Olvidaste tu contraseña?
                  </Button>
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-base">
                {isLogin 
                  ? "Iniciar Sesión" 
                  : isProviderMode 
                    ? "Continuar con Registro" 
                    : "Crear Cuenta"
                }
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <Separator className="my-4" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-card px-3 text-sm text-muted-foreground">o continúa con</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={() => onSocialLogin('google')}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="h-12"
                  onClick={() => onSocialLogin('facebook')}
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>

            <div className="text-center mt-6">
              <span className="text-muted-foreground text-sm">
                {isLogin ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
              </span>
              <Button
                variant="link"
                size="sm"
                className="p-0 ml-1 h-auto"
                onClick={() => {
                  setIsLogin(!isLogin)
                  setIsProviderMode(false)
                }}
              >
                {isLogin ? "Regístrate" : "Iniciar sesión"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Terms */}
        <p className="text-center text-xs text-muted-foreground px-4 pb-8">
          Al continuar, aceptas nuestros{" "}
          <Button variant="link" size="sm" className="p-0 h-auto text-xs">
            Términos de Servicio
          </Button>{" "}
          y{" "}
          <Button variant="link" size="sm" className="p-0 h-auto text-xs">
            Política de Privacidad
          </Button>
        </p>
      </div>
    </div>
  )
}