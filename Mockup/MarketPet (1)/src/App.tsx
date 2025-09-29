import { useState } from "react"
import { SplashScreen } from "./components/splash-screen"
import { Button } from "./components/ui/button"
import { Badge } from "./components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./components/ui/dialog"
import { Input } from "./components/ui/input"
import { Card, CardContent } from "./components/ui/card"
import { LoginScreen } from "./components/login-screen"
import { OnboardingScreen } from "./components/onboarding-screen"
import { ProviderRegistration } from "./components/provider-registration"
import { ProviderOnboarding } from "./components/provider-onboarding"
import { ProviderDashboard } from "./components/provider-dashboard"
import { UserProfileHeader } from "./components/user-profile-header"
import { MobileHeader } from "./components/mobile-header"
import { MobileTabBar } from "./components/mobile-tab-bar"
import { MobilePetProfileCard } from "./components/mobile-pet-profile-card"
import { ProviderCard } from "./components/provider-card"
import { SubscriptionCard } from "./components/subscription-card"
import { AppointmentForm } from "./components/appointment-form"
import { AppointmentCard } from "./components/appointment-card"
import { QuickActions } from "./components/quick-actions"
import { Heart, Plus, Search, Filter, Sparkles } from "lucide-react"

export default function App() {
  // App initialization
  const [showSplash, setShowSplash] = useState(true)
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showProviderRegistration, setShowProviderRegistration] = useState(false)
  const [showProviderOnboarding, setShowProviderOnboarding] = useState(false)
  const [tempProviderData, setTempProviderData] = useState<{
    name: string
    email: string
    phone: string
  } | null>(null)
  const [user, setUser] = useState<{
    name: string
    email: string
    phone: string
    location: string
    planType: "Básico" | "Premium" | "Familiar"
    userType?: "client" | "provider"
    businessName?: string
    services?: string[]
    rating?: number
    totalReviews?: number
  } | null>(null)

  // App state
  const [activeTab, setActiveTab] = useState("pets")
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)

  // Mock data
  const pets = [
    {
      name: "Max",
      species: "Perro",
      breed: "Golden Retriever",
      age: "3 años",
      weight: "28 kg",
      vaccinations: ["Rabia", "Parvovirus", "Distemper"],
      location: "Santiago Centro"
    },
    {
      name: "Luna",
      species: "Gato",
      breed: "Persa",
      age: "2 años",
      weight: "4 kg",
      vaccinations: ["Triple Felina", "Rabia"],
      location: "Santiago Centro"
    },
    {
      name: "Rocky",
      species: "Perro",
      breed: "Bulldog Francés",
      age: "5 años",
      weight: "12 kg",
      vaccinations: ["Rabia", "Parvovirus"],
      location: "Santiago Centro"
    }
  ]

  const providers = [
    {
      name: "Dr. María González",
      profession: "Veterinaria",
      specialties: ["Cirugía", "Medicina Interna", "Cardiología"],
      rating: 4.9,
      reviewCount: 127,
      location: "Las Condes, Santiago",
      availability: "Lun-Vie 9:00-18:00",
      price: "$35.000",
      imageUrl: "https://images.unsplash.com/photo-1593275497414-473e94a9152a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHZldGVyaW5hcmlhbnxlbnwxfHx8fDE3NTkxMDk1MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Carlos Mendoza",
      profession: "Paseador Profesional",
      specialties: ["Perros Grandes", "Entrenamiento Básico", "Ejercicio"],
      rating: 4.8,
      reviewCount: 89,
      location: "Parque Forestal, Santiago",
      availability: "Todos los días 7:00-19:00",
      price: "$8.000/paseo",
      imageUrl: "https://images.unsplash.com/photo-1596787693095-1731f91546f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2clMjB3YWxrZXIlMjBwYXJrfGVufDF8fHx8MTc1OTAyNzY2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      name: "Ana Silva",
      profession: "Estilista Canina",
      specialties: ["Grooming", "Corte de Uñas", "Limpieza de Oídos"],
      rating: 4.7,
      reviewCount: 156,
      location: "Providencia, Santiago",
      availability: "Mar-Sáb 10:00-17:00",
      price: "$25.000",
      imageUrl: "https://images.unsplash.com/photo-1625279138836-e7311d5c863a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBncm9vbWluZyUyMHNlcnZpY2V8ZW58MXx8fHwxNzU5MTIxNzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ]

  const subscriptionPlans = [
    {
      name: "Básico",
      price: "Gratis",
      period: "mes",
      features: [
        "Crear hasta 2 perfiles de mascotas",
        "Búsqueda básica de proveedores",
        "Reservas estándar",
        "Recordatorios básicos"
      ],
      isCurrentPlan: true
    },
    {
      name: "Premium",
      price: "$9.990",
      period: "mes",
      features: [
        "Perfiles ilimitados de mascotas",
        "Reservas prioritarias",
        "Descuentos del 15% en servicios",
        "Recordatorios inteligentes de salud",
        "Historial médico detallado",
        "Soporte 24/7"
      ],
      isPopular: true
    },
    {
      name: "Familiar",
      price: "$15.990",
      period: "mes",
      features: [
        "Todo lo del plan Premium",
        "Hasta 10 perfiles de mascotas",
        "Descuentos del 25% en servicios",
        "Plan de salud personalizado",
        "Consultoría veterinaria mensual",
        "Aplicación para toda la familia"
      ]
    }
  ]

  const appointments = [
    {
      petName: "Max",
      providerName: "Dr. María González",
      service: "Consulta General",
      date: "Mañana, 15 de Marzo",
      time: "10:00 AM",
      location: "Las Condes, Santiago",
      price: "$35.000",
      status: "confirmed" as const,
      providerImage: "https://images.unsplash.com/photo-1593275497414-473e94a9152a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHZldGVyaW5hcmlhbnxlbnwxfHx8fDE3NTkxMDk1MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      petName: "Luna",
      providerName: "Ana Silva",
      service: "Grooming",
      date: "20 de Marzo",
      time: "2:00 PM",
      location: "Providencia, Santiago",
      price: "$25.000",
      status: "pending" as const,
      providerImage: "https://images.unsplash.com/photo-1625279138836-e7311d5c863a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBncm9vbWluZyUyMHNlcnZpY2V8ZW58MXx8fHwxNzU5MTIxNzQzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ]

  // Authentication handlers
  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app, this would call an API
    const userData = {
      name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      email,
      phone: "+56 9 1234 5678",
      location: "Santiago, Chile",
      planType: "Básico" as const
    }
    setUser(userData)
    setIsAuthenticated(true)
    setShowOnboarding(true)
  }

  const handleRegister = (email: string, password: string, name: string, phone: string) => {
    // Mock register - in real app, this would call an API
    const userData = {
      name,
      email,
      phone,
      location: "Santiago, Chile",
      planType: "Básico" as const,
      userType: "client" as const
    }
    setUser(userData)
    setIsAuthenticated(true)
    setShowOnboarding(true)
  }

  const handleProviderRegister = (email: string, password: string, name: string, phone: string) => {
    // Store temp data and show provider registration flow
    setTempProviderData({ name, email, phone })
    setShowProviderRegistration(true)
  }

  const handleSocialLogin = (provider: 'google' | 'facebook') => {
    // Mock social login
    const userData = {
      name: "Usuario Ejemplo",
      email: "usuario@ejemplo.com",
      phone: "+56 9 1234 5678", 
      location: "Santiago, Chile",
      planType: "Básico" as const,
      userType: "client" as const
    }
    setUser(userData)
    setIsAuthenticated(true)
    setShowOnboarding(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setShowOnboarding(false)
    setShowProviderRegistration(false)
    setShowProviderOnboarding(false)
    setTempProviderData(null)
    setActiveTab("pets")
  }

  const handleOnboardingComplete = () => {
    setShowOnboarding(false)
  }

  const handleProviderRegistrationComplete = (providerData: any) => {
    // Map service IDs to display names
    const serviceMap: { [key: string]: string } = {
      veterinary: "Veterinaria",
      grooming: "Grooming", 
      walking: "Paseos",
      boarding: "Hospedaje",
      training: "Entrenamiento",
      products: "Productos"
    }
    
    const mappedServices = providerData.services.map((serviceId: string) => serviceMap[serviceId] || serviceId)
    
    // Create provider user with complete data
    const userData = {
      name: providerData.name,
      email: providerData.email,
      phone: providerData.phone,
      location: providerData.location,
      planType: "Básico" as const,
      userType: "provider" as const,
      businessName: providerData.businessName,
      services: mappedServices,
      rating: 4.8,
      totalReviews: 0
    }
    setUser(userData)
    setIsAuthenticated(true)
    setShowProviderRegistration(false)
    setShowProviderOnboarding(true)
    setTempProviderData(null)
  }

  const handleProviderOnboardingComplete = () => {
    setShowProviderOnboarding(false)
  }

  const handleBackToLogin = () => {
    setShowProviderRegistration(false)
    setTempProviderData(null)
  }

  const handleUpdateProfile = (data: { name: string; email: string; phone: string; location: string }) => {
    if (user) {
      setUser({ ...user, ...data })
    }
  }

  const handleBookAppointment = (providerName: string) => {
    setSelectedProvider(providerName)
    setShowAppointmentForm(true)
  }

  const getTabTitle = () => {
    switch (activeTab) {
      case "pets": return "Mis Mascotas"
      case "providers": return "Servicios"
      case "appointments": return "Mis Citas"
      case "subscription": return "Planes"
      default: return "MarketPet"
    }
  }

  // Show splash screen on app start
  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />
  }

  // Show provider registration flow
  if (showProviderRegistration && tempProviderData) {
    return (
      <ProviderRegistration
        initialData={tempProviderData}
        onComplete={handleProviderRegistrationComplete}
        onBack={handleBackToLogin}
      />
    )
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        onRegister={handleRegister}
        onProviderRegister={handleProviderRegister}
        onSocialLogin={handleSocialLogin}
      />
    )
  }

  // Show provider onboarding
  if (showProviderOnboarding && user && user.userType === "provider") {
    return (
      <ProviderOnboarding
        providerName={user.name}
        businessName={user.businessName || ""}
        services={user.services || []}
        onComplete={handleProviderOnboardingComplete}
      />
    )
  }

  // Show onboarding for new client users
  if (showOnboarding && user && user.userType === "client") {
    return (
      <OnboardingScreen 
        userName={user.name}
        onComplete={handleOnboardingComplete}
      />
    )
  }

  // Show provider dashboard for providers
  if (user && user.userType === "provider") {
    return (
      <ProviderDashboard
        user={{
          name: user.name,
          email: user.email,
          phone: user.phone,
          businessName: user.businessName || "",
          services: user.services || [],
          rating: user.rating || 0,
          totalReviews: user.totalReviews || 0,
          planType: user.planType
        }}
        onLogout={handleLogout}
      />
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Mobile Header */}
      <MobileHeader title={getTabTitle()} />

      {/* User Profile Header - only on pets tab */}
      {activeTab === "pets" && user && (
        <UserProfileHeader
          userName={user.name}
          userEmail={user.email}
          userPhone={user.phone}
          userLocation={user.location}
          planType={user.planType}
          notificationCount={2}
          onLogout={handleLogout}
          onUpdateProfile={handleUpdateProfile}
        />
      )}

      {/* Content */}
      <div className="px-4 py-4 space-y-4">

        {/* Pets Tab */}
        {activeTab === "pets" && (
          <>
            {/* Welcome Card */}
            <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-bold text-xl mb-1">¡Hola {user?.name}! 👋</h2>
                    <p className="text-primary-foreground/80">
                      Cuida a tus mascotas con los mejores servicios
                    </p>
                  </div>
                  <Sparkles className="w-8 h-8 text-primary-foreground/80" />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <QuickActions
              onAddPet={() => console.log("Add pet")}
              onSearchServices={() => setActiveTab("providers")}
              onBookAppointment={() => setActiveTab("appointments")}
              onFindNearby={() => console.log("Find nearby")}
            />

            {/* Pets List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Mis Mascotas</h3>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Agregar
                </Button>
              </div>
              
              {pets.map((pet, index) => (
                <MobilePetProfileCard
                  key={index}
                  {...pet}
                  onEdit={() => console.log(`Edit ${pet.name}`)}
                  onBookAppointment={() => setActiveTab("providers")}
                />
              ))}
            </div>
          </>
        )}

        {/* Providers Tab */}
        {activeTab === "providers" && (
          <>
            {/* Search Bar */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input 
                  placeholder="Buscar servicios..." 
                  className="pl-9 bg-white border-0 shadow-sm" 
                />
              </div>
              <Button variant="outline" size="icon" className="bg-white shadow-sm border-0">
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* Service Categories */}
            <Card className="shadow-sm border-0">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Categorías</h3>
                <div className="grid grid-cols-2 gap-2">
                  {["Veterinarios", "Paseadores", "Grooming", "Guardería"].map((category) => (
                    <Button key={category} variant="outline" size="sm" className="justify-start">
                      {category}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Providers List */}
            <div className="space-y-3">
              <h3 className="font-semibold">Proveedores Recomendados</h3>
              {providers.map((provider, index) => (
                <ProviderCard
                  key={index}
                  {...provider}
                  onBookAppointment={() => handleBookAppointment(provider.name)}
                />
              ))}
            </div>
          </>
        )}

        {/* Appointments Tab */}
        {activeTab === "appointments" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="shadow-sm border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">2</div>
                  <p className="text-sm text-muted-foreground">Próximas Citas</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">8</div>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Book */}
            <Card className="shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Agendar Nueva Cita</h3>
                    <p className="text-sm text-muted-foreground">Encuentra el mejor cuidado para tu mascota</p>
                  </div>
                  <Button size="sm" onClick={() => setActiveTab("providers")}>
                    <Plus className="w-4 h-4 mr-2" />
                    Agendar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Appointments List */}
            <div className="space-y-3">
              <h3 className="font-semibold">Próximas Citas</h3>
              {appointments.map((appointment, index) => (
                <AppointmentCard
                  key={index}
                  {...appointment}
                  onCall={() => console.log("Call provider")}
                  onMessage={() => console.log("Message provider")}
                  onReschedule={() => console.log("Reschedule")}
                />
              ))}
            </div>
          </>
        )}

        {/* Subscription Tab */}
        {activeTab === "subscription" && (
          <>
            {/* Current Plan */}
            <Card className="shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Plan Actual</h3>
                  <Badge variant="secondary">Básico</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Tienes acceso a funciones básicas. Mejora tu plan para obtener más beneficios.
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Ver Beneficios Premium
                </Button>
              </CardContent>
            </Card>

            {/* Subscription Plans */}
            <div className="space-y-4">
              <h3 className="font-semibold">Planes Disponibles</h3>
              {subscriptionPlans.map((plan, index) => (
                <SubscriptionCard
                  key={index}
                  {...plan}
                  onSubscribe={() => console.log(`Subscribe to ${plan.name}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Mobile Tab Bar */}
      <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Appointment Dialog */}
      <Dialog open={showAppointmentForm} onOpenChange={setShowAppointmentForm}>
        <DialogContent className="max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle>Nueva Cita</DialogTitle>
          </DialogHeader>
          {selectedProvider && (
            <AppointmentForm
              providerName={selectedProvider}
              onSubmit={(data) => {
                console.log('Appointment data:', data)
                setShowAppointmentForm(false)
              }}
              onCancel={() => setShowAppointmentForm(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}