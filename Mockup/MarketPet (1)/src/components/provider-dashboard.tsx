import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { MobileHeader } from "./mobile-header"
import { MobileTabBar } from "./mobile-tab-bar"
import { Calendar, Users, DollarSign, Star, TrendingUp, Bell, Settings, Plus, Phone, MessageCircle, Clock } from "lucide-react"

interface ProviderUser {
  name: string
  email: string
  phone: string
  businessName: string
  services: string[]
  rating: number
  totalReviews: number
  planType: "Básico" | "Premium" | "Profesional"
}

interface ProviderDashboardProps {
  user: ProviderUser
  onLogout: () => void
}

export function ProviderDashboard({ user, onLogout }: ProviderDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data
  const stats = {
    todayAppointments: 3,
    weeklyEarnings: 145000,
    newClients: 8,
    rating: user.rating,
    totalClients: 47
  }

  const todayAppointments = [
    {
      id: "1",
      petName: "Max",
      ownerName: "Carlos Silva",
      service: "Consulta General",
      time: "10:00 AM",
      duration: "30 min",
      price: "$35.000",
      status: "confirmed" as const,
      phone: "+56912345678"
    },
    {
      id: "2",
      petName: "Luna",
      service: "Grooming",
      ownerName: "María González",
      time: "2:00 PM", 
      duration: "90 min",
      price: "$25.000",
      status: "pending" as const,
      phone: "+56987654321"
    },
    {
      id: "3",
      petName: "Rocky",
      service: "Paseo",
      ownerName: "Ana Rodríguez",
      time: "5:00 PM",
      duration: "60 min", 
      price: "$8.000",
      status: "confirmed" as const,
      phone: "+56955555555"
    }
  ]

  const recentReviews = [
    {
      id: "1",
      clientName: "Patricia M.",
      petName: "Simba",
      rating: 5,
      comment: "Excelente atención, muy profesional y cariñoso con mi gato.",
      date: "hace 2 días",
      service: "Consulta"
    },
    {
      id: "2", 
      clientName: "Roberto C.",
      petName: "Toby",
      rating: 5,
      comment: "Muy recomendado, el mejor veterinario de la zona.",
      date: "hace 1 semana",
      service: "Vacunación"
    }
  ]

  const getTabTitle = () => {
    switch (activeTab) {
      case "dashboard": return "Dashboard"
      case "appointments": return "Citas"
      case "clients": return "Clientes"
      case "earnings": return "Ganancias"
      case "profile": return "Mi Perfil"
      default: return "MarketPet Pro"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "completed": return "bg-blue-100 text-blue-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmada"
      case "pending": return "Pendiente"
      case "completed": return "Completada"
      case "cancelled": return "Cancelada"
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-20">
      {/* Mobile Header */}
      <MobileHeader title={getTabTitle()} />

      {/* Provider Header */}
      <div className="px-4 py-4">
        <Card className="shadow-sm border-0 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-lg">{user.businessName}</h2>
                <p className="text-muted-foreground text-sm">{user.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-medium">{user.rating}</span>
                    <span className="text-muted-foreground text-sm">({user.totalReviews} reseñas)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Bell className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {user.services.map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-3">
              <Card className="shadow-sm border-0">
                <CardContent className="p-4 text-center">
                  <Calendar className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{stats.todayAppointments}</div>
                  <p className="text-sm text-muted-foreground">Citas Hoy</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4 text-center">
                  <DollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">${stats.weeklyEarnings.toLocaleString()}</div>
                  <p className="text-sm text-muted-foreground">Esta Semana</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Card className="shadow-sm border-0">
                <CardContent className="p-4 text-center">
                  <Users className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{stats.newClients}</div>
                  <p className="text-sm text-muted-foreground">Nuevos Clientes</p>
                </CardContent>
              </Card>
              <Card className="shadow-sm border-0">
                <CardContent className="p-4 text-center">
                  <Star className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{stats.rating}</div>
                  <p className="text-sm text-muted-foreground">Calificación</p>
                </CardContent>
              </Card>
            </div>

            {/* Today's Appointments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Citas de Hoy</h3>
                <Button size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Nueva Cita
                </Button>
              </div>

              {todayAppointments.map((appointment) => (
                <Card key={appointment.id} className="shadow-sm border-0">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="font-medium text-primary text-sm">
                            {appointment.petName[0]}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold">{appointment.petName}</h4>
                          <p className="text-sm text-muted-foreground">{appointment.ownerName}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(appointment.status)}>
                        {getStatusText(appointment.status)}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Servicio:</span>
                        <span className="font-medium">{appointment.service}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Hora:</span>
                        <span className="font-medium">{appointment.time}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Duración:</span>
                        <span className="font-medium">{appointment.duration}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Precio:</span>
                        <span className="font-medium text-green-600">{appointment.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Phone className="w-4 h-4 mr-1" />
                        Llamar
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Mensaje
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Recent Reviews */}
            <div className="space-y-3">
              <h3 className="font-semibold">Reseñas Recientes</h3>
              {recentReviews.map((review) => (
                <Card key={review.id} className="shadow-sm border-0">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-sm">{review.clientName}</h4>
                        <p className="text-xs text-muted-foreground">{review.petName} • {review.service}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {/* Other tabs content can be added here */}
        {activeTab !== "dashboard" && (
          <Card className="shadow-sm border-0">
            <CardContent className="p-8 text-center">
              <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Próximamente</h3>
              <p className="text-muted-foreground">
                Esta sección estará disponible pronto
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Provider Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t safe-area-pb">
        <div className="flex">
          {[
            { id: "dashboard", label: "Inicio", icon: TrendingUp },
            { id: "appointments", label: "Citas", icon: Calendar },
            { id: "clients", label: "Clientes", icon: Users },
            { id: "earnings", label: "Ganancias", icon: DollarSign },
            { id: "profile", label: "Perfil", icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-2 px-1 flex flex-col items-center gap-1 transition-colors ${
                activeTab === id 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}