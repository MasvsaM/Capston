import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Plus, Search, Calendar, MapPin, Bell, Heart } from "lucide-react"

interface QuickActionsProps {
  onAddPet?: () => void
  onSearchServices?: () => void
  onBookAppointment?: () => void
  onFindNearby?: () => void
}

export function QuickActions({
  onAddPet,
  onSearchServices,
  onBookAppointment,
  onFindNearby
}: QuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: "Agregar Mascota",
      onClick: onAddPet,
      color: "bg-green-500"
    },
    {
      icon: Search,
      label: "Buscar Servicios",
      onClick: onSearchServices,
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      label: "Agendar Cita",
      onClick: onBookAppointment,
      color: "bg-purple-500"
    },
    {
      icon: MapPin,
      label: "Cerca de Ti",
      onClick: onFindNearby,
      color: "bg-orange-500"
    }
  ]

  return (
    <Card className="shadow-sm border-0">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold">Acciones Rápidas</h3>
          <Bell className="w-5 h-5 text-muted-foreground" />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col gap-2 border-dashed hover:border-solid transition-all"
                onClick={action.onClick}
              >
                <div className={`w-8 h-8 ${action.color} rounded-lg flex items-center justify-center text-white`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}