import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { ScrollArea } from "./ui/scroll-area"
import { Bell, X, Calendar, Heart, Star, MapPin, Clock, Check } from "lucide-react"

interface NotificationCenterProps {
  notificationCount: number
  onMarkAllRead: () => void
}

interface Notification {
  id: string
  type: "appointment" | "reminder" | "review" | "promotion"
  title: string
  message: string
  time: string
  isRead: boolean
  actionUrl?: string
}

export function NotificationCenter({ notificationCount, onMarkAllRead }: NotificationCenterProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "appointment",
      title: "Cita confirmada",
      message: "Tu cita con Dr. María González para Max está confirmada mañana a las 10:00 AM",
      time: "hace 2 horas",
      isRead: false
    },
    {
      id: "2", 
      type: "reminder",
      title: "Recordatorio de vacuna",
      message: "Luna necesita su vacuna anual. Agenda una cita pronto.",
      time: "hace 1 día",
      isRead: false
    },
    {
      id: "3",
      type: "review",
      title: "Califica tu experiencia",
      message: "¿Cómo fue tu última visita con Ana Silva? Deja una reseña.",
      time: "hace 2 días",
      isRead: true
    },
    {
      id: "4",
      type: "promotion",
      title: "¡Oferta especial!",
      message: "20% de descuento en servicios de grooming este mes con tu plan Premium.",
      time: "hace 3 días",
      isRead: true
    }
  ])

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const handleRemoveNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="w-5 h-5 text-blue-500" />
      case "reminder":
        return <Bell className="w-5 h-5 text-orange-500" />
      case "review":
        return <Star className="w-5 h-5 text-yellow-500" />
      case "promotion":
        return <Heart className="w-5 h-5 text-primary" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "appointment":
        return "bg-blue-50 border-blue-200"
      case "reminder":
        return "bg-orange-50 border-orange-200"
      case "review":
        return "bg-yellow-50 border-yellow-200"
      case "promotion":
        return "bg-primary/5 border-primary/20"
      default:
        return "bg-muted/50 border-muted"
    }
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-xs text-white flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-lg mx-4 max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Notificaciones</DialogTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onMarkAllRead}
                className="text-xs"
              >
                Marcar todo como leído
              </Button>
            )}
          </div>
        </DialogHeader>

        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Card 
                  key={notification.id}
                  className={`shadow-sm border ${
                    notification.isRead 
                      ? 'bg-background border-border' 
                      : getNotificationColor(notification.type)
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-sm leading-tight">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-1 ml-2">
                            {!notification.isRead && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                <Check className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveNotification(notification.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                          {!notification.isRead && (
                            <Badge variant="secondary" className="text-xs px-2 py-0">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
        
        {notifications.length > 0 && (
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => setNotifications([])}
            >
              Limpiar todas las notificaciones
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}