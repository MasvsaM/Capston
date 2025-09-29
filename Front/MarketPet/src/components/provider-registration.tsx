import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Badge } from "./ui/badge"
import { Checkbox } from "./ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Separator } from "./ui/separator"
import { ArrowLeft, ArrowRight, Heart, Stethoscope, Scissors, Home, Car, ShoppingBag, CheckCircle } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface ProviderData {
  name: string
  email: string
  phone: string
  businessName: string
  description: string
  location: string
  address: string
  services: string[]
  specialties: string[]
  experience: string
  pricing: { [key: string]: string }
  availability: {
    days: string[]
    hours: string
  }
  certifications: string[]
}

interface ProviderRegistrationProps {
  initialData: {
    name: string
    email: string
    phone: string
  }
  onComplete: (providerData: ProviderData) => void
  onBack: () => void
}

const SERVICES = [
  {
    id: "veterinary",
    name: "Veterinaria",
    icon: Stethoscope,
    description: "Consultas, cirugías y cuidados médicos",
    specialties: ["Medicina General", "Cirugía", "Cardiología", "Dermatología", "Oftalmología", "Odontología", "Neurología", "Oncología"],
    color: "bg-blue-50 border-blue-200 text-blue-700"
  },
  {
    id: "grooming",
    name: "Grooming",
    icon: Scissors,
    description: "Peluquería y estética canina/felina",
    specialties: ["Corte y Peinado", "Baño y Secado", "Corte de Uñas", "Limpieza de Oídos", "Limpieza Dental", "Tinte de Pelo"],
    color: "bg-pink-50 border-pink-200 text-pink-700"
  },
  {
    id: "walking",
    name: "Paseos",
    icon: Car,
    description: "Paseos y ejercicio para mascotas",
    specialties: ["Paseos Individuales", "Paseos Grupales", "Ejercicio Intensivo", "Socialización", "Entrenamiento Básico"],
    color: "bg-green-50 border-green-200 text-green-700"
  },
  {
    id: "boarding",
    name: "Hospedaje",
    icon: Home,
    description: "Cuidado temporal en hogar o guardería",
    specialties: ["Hospedaje Domiciliario", "Guardería Diurna", "Cuidado Nocturno", "Cuidado de Cachorros", "Cuidado de Mascotas Mayores"],
    color: "bg-purple-50 border-purple-200 text-purple-700"
  },
  {
    id: "training",
    name: "Entrenamiento",
    icon: Heart,
    description: "Educación y modificación de conducta",
    specialties: ["Entrenamiento Básico", "Modificación de Conducta", "Socialización", "Entrenamiento Avanzado", "Terapia Conductual"],
    color: "bg-orange-50 border-orange-200 text-orange-700"
  },
  {
    id: "products",
    name: "Productos",
    icon: ShoppingBag,
    description: "Venta de alimentos y accesorios",
    specialties: ["Alimentos Premium", "Juguetes", "Accesorios", "Productos de Higiene", "Medicamentos", "Suplementos"],
    color: "bg-indigo-50 border-indigo-200 text-indigo-700"
  }
]

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

export function ProviderRegistration({ initialData, onComplete, onBack }: ProviderRegistrationProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [providerData, setProviderData] = useState<ProviderData>({
    name: initialData.name,
    email: initialData.email,
    phone: initialData.phone,
    businessName: "",
    description: "",
    location: "",
    address: "",
    services: [],
    specialties: [],
    experience: "",
    pricing: {},
    availability: {
      days: [],
      hours: ""
    },
    certifications: []
  })

  const totalSteps = 4

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete(providerData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      onBack()
    }
  }

  const updateProviderData = (field: keyof ProviderData, value: any) => {
    setProviderData(prev => ({ ...prev, [field]: value }))
  }

  const toggleService = (serviceId: string) => {
    const updatedServices = providerData.services.includes(serviceId)
      ? providerData.services.filter(s => s !== serviceId)
      : [...providerData.services, serviceId]
    
    updateProviderData("services", updatedServices)
    
    // Reset specialties if service is removed
    if (!updatedServices.includes(serviceId)) {
      const serviceSpecialties = SERVICES.find(s => s.id === serviceId)?.specialties || []
      const updatedSpecialties = providerData.specialties.filter(
        specialty => !serviceSpecialties.includes(specialty)
      )
      updateProviderData("specialties", updatedSpecialties)
    }
  }

  const toggleSpecialty = (specialty: string) => {
    const updatedSpecialties = providerData.specialties.includes(specialty)
      ? providerData.specialties.filter(s => s !== specialty)
      : [...providerData.specialties, specialty]
    
    updateProviderData("specialties", updatedSpecialties)
  }

  const toggleDay = (day: string) => {
    const updatedDays = providerData.availability.days.includes(day)
      ? providerData.availability.days.filter(d => d !== day)
      : [...providerData.availability.days, day]
    
    updateProviderData("availability", { ...providerData.availability, days: updatedDays })
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: return providerData.businessName && providerData.description && providerData.location
      case 1: return providerData.services.length > 0
      case 2: return providerData.specialties.length > 0
      case 3: return providerData.availability.days.length > 0 && providerData.availability.hours
      default: return false
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 0: return "Información del Negocio"
      case 1: return "Selecciona tus Servicios"
      case 2: return "Especialidades"
      case 3: return "Disponibilidad y Precios"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <div className="pt-safe-area-pt px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
          <div className="text-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mx-auto mb-2">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Paso {currentStep + 1} de {totalSteps}</p>
          </div>
          <div className="w-16" /> {/* Spacer */}
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`h-2 flex-1 rounded-full transition-colors ${
                index <= currentStep ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        <h1 className="font-bold text-2xl mb-2">{getStepTitle()}</h1>
      </div>

      {/* Content */}
      <div className="px-4 space-y-4">
        {/* Step 0: Business Information */}
        {currentStep === 0 && (
          <Card className="shadow-sm border-0">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Nombre del negocio o servicio *</Label>
                <Input
                  placeholder="Ej: Veterinaria San Bernardo"
                  value={providerData.businessName}
                  onChange={(e) => updateProviderData("businessName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Descripción de tu servicio *</Label>
                <Textarea
                  placeholder="Describe tu experiencia y qué hace único tu servicio..."
                  value={providerData.description}
                  onChange={(e) => updateProviderData("description", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Ciudad *</Label>
                <Select value={providerData.location} onValueChange={(value) => updateProviderData("location", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="santiago">Santiago</SelectItem>
                    <SelectItem value="valparaiso">Valparaíso</SelectItem>
                    <SelectItem value="concepcion">Concepción</SelectItem>
                    <SelectItem value="la-serena">La Serena</SelectItem>
                    <SelectItem value="antofagasta">Antofagasta</SelectItem>
                    <SelectItem value="temuco">Temuco</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Dirección completa</Label>
                <Input
                  placeholder="Calle, número, comuna"
                  value={providerData.address}
                  onChange={(e) => updateProviderData("address", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Años de experiencia</Label>
                <Select value={providerData.experience} onValueChange={(value) => updateProviderData("experience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu experiencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="menos-1">Menos de 1 año</SelectItem>
                    <SelectItem value="1-3">1-3 años</SelectItem>
                    <SelectItem value="3-5">3-5 años</SelectItem>
                    <SelectItem value="5-10">5-10 años</SelectItem>
                    <SelectItem value="mas-10">Más de 10 años</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Selecciona todos los servicios que ofreces. Puedes elegir varios.
            </p>
            
            {SERVICES.map((service) => {
              const Icon = service.icon
              const isSelected = providerData.services.includes(service.id)
              
              return (
                <Card 
                  key={service.id}
                  className={`shadow-sm border cursor-pointer transition-all ${
                    isSelected 
                      ? service.color + " border-2" 
                      : "border hover:border-primary/50"
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isSelected ? 'bg-white/50' : 'bg-muted'
                      }`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{service.name}</h3>
                        <p className="text-sm text-muted-foreground">{service.description}</p>
                      </div>
                      {isSelected && (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Step 2: Specialties */}
        {currentStep === 2 && (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Selecciona tus especialidades dentro de los servicios elegidos.
            </p>

            {SERVICES
              .filter(service => providerData.services.includes(service.id))
              .map((service) => {
                const Icon = service.icon
                return (
                  <Card key={service.id} className="shadow-sm border-0">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${service.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="font-semibold">{service.name}</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {service.specialties.map((specialty) => (
                          <div 
                            key={specialty}
                            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => toggleSpecialty(specialty)}
                          >
                            <Checkbox
                              checked={providerData.specialties.includes(specialty)}
                              onChange={() => toggleSpecialty(specialty)}
                            />
                            <span className="text-sm">{specialty}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
          </div>
        )}

        {/* Step 3: Availability and Pricing */}
        {currentStep === 3 && (
          <div className="space-y-4">
            <Card className="shadow-sm border-0">
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold mb-3">Días disponibles *</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {DAYS.map((day) => (
                      <Button
                        key={day}
                        variant={providerData.availability.days.includes(day) ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleDay(day)}
                        className="justify-start"
                      >
                        {day}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Horario de atención *</Label>
                  <Select 
                    value={providerData.availability.hours} 
                    onValueChange={(value) => updateProviderData("availability", { ...providerData.availability, hours: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu horario" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="9-17">9:00 AM - 5:00 PM</SelectItem>
                      <SelectItem value="8-18">8:00 AM - 6:00 PM</SelectItem>
                      <SelectItem value="10-19">10:00 AM - 7:00 PM</SelectItem>
                      <SelectItem value="7-19">7:00 AM - 7:00 PM</SelectItem>
                      <SelectItem value="24h">24 horas</SelectItem>
                      <SelectItem value="flexible">Horario flexible</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0">
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold">Precios base (opcional)</h3>
                <p className="text-sm text-muted-foreground">
                  Estos precios son referenciales. Podrás ajustarlos para cada servicio específico.
                </p>
                
                {providerData.services.map((serviceId) => {
                  const service = SERVICES.find(s => s.id === serviceId)
                  if (!service) return null
                  
                  return (
                    <div key={serviceId} className="space-y-2">
                      <Label>{service.name}</Label>
                      <Input
                        placeholder="Ej: $25.000"
                        value={providerData.pricing[serviceId] || ""}
                        onChange={(e) => updateProviderData("pricing", { 
                          ...providerData.pricing, 
                          [serviceId]: e.target.value 
                        })}
                      />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t safe-area-pb">
        <Button 
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full h-12"
        >
          {currentStep === totalSteps - 1 ? (
            "Completar Registro"
          ) : (
            <>
              Continuar
              <ArrowRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}