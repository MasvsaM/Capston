import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { NotificationCenter } from "./notification-center"
import { Heart, Bell, User, Settings, LogOut, Edit, Crown, MapPin } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { useState } from "react"

interface UserProfileHeaderProps {
  userName: string
  userEmail: string
  userPhone?: string
  userLocation?: string
  planType: "Básico" | "Premium" | "Familiar"
  notificationCount?: number
  onLogout: () => void
  onUpdateProfile: (data: { name: string; email: string; phone: string; location: string }) => void
}

export function UserProfileHeader({ 
  userName, 
  userEmail, 
  userPhone = "",
  userLocation = "",
  planType, 
  notificationCount = 0,
  onLogout,
  onUpdateProfile 
}: UserProfileHeaderProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const [profileData, setProfileData] = useState({
    name: userName,
    email: userEmail,
    phone: userPhone,
    location: userLocation
  })

  const handleSaveProfile = () => {
    onUpdateProfile(profileData)
    setShowProfileDialog(false)
  }

  const planColors = {
    "Básico": "bg-muted text-muted-foreground",
    "Premium": "bg-primary text-primary-foreground",
    "Familiar": "bg-gradient-to-r from-primary to-purple-600 text-white"
  }

  return (
    <>
      <div className="px-4 py-4">
        <Card className="shadow-sm border-0 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-primary/20 flex items-center justify-center flex-shrink-0">
                <ImageWithFallback
                  src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBhdmF0YXJ8ZW58MXx8fHwxNzU5MTIxNzQzfDA&ixlib=rb-4.1.0&q=80&w=200`}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h2 className="font-semibold text-lg leading-tight">{userName}</h2>
                    <p className="text-muted-foreground text-sm truncate">{userEmail}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={planColors[planType]}>
                      {planType === "Premium" && <Crown className="w-3 h-3 mr-1" />}
                      {planType === "Familiar" && <Crown className="w-3 h-3 mr-1" />}
                      {planType}
                    </Badge>
                  </div>
                </div>

                {userLocation && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{userLocation}</span>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="flex gap-4 text-sm">
                  <div>
                    <span className="font-medium text-primary">3</span>
                    <span className="text-muted-foreground ml-1">Mascotas</span>
                  </div>
                  <div>
                    <span className="font-medium text-green-600">12</span>
                    <span className="text-muted-foreground ml-1">Citas</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <NotificationCenter 
                  notificationCount={notificationCount}
                  onMarkAllRead={() => console.log("Mark all read")}
                />
                
                <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
              <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Configuración
              </Button>
              <Button variant="ghost" size="sm" className="flex-1 h-8 text-xs">
                <Heart className="w-3 h-3 mr-1" />
                Favoritos
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex-1 h-8 text-xs text-destructive hover:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="w-3 h-3 mr-1" />
                Salir
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Edit Dialog */}
      <Dialog open={showProfileDialog} onOpenChange={setShowProfileDialog}>
        <DialogContent className="max-w-lg mx-4">
          <DialogHeader>
            <DialogTitle>Editar Perfil</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Tu nombre"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+56 9 1234 5678"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Ubicación</Label>
              <Input
                id="location"
                value={profileData.location}
                onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                placeholder="Santiago, Chile"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowProfileDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveProfile} className="flex-1">
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}