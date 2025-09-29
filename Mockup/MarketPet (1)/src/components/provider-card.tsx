import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Star, MapPin, Clock, Phone } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface ProviderCardProps {
  name: string
  profession: string
  specialties: string[]
  rating: number
  reviewCount: number
  location: string
  availability: string
  imageUrl?: string
  price?: string
  onBookAppointment?: () => void
}

export function ProviderCard({
  name,
  profession,
  specialties,
  rating,
  reviewCount,
  location,
  availability,
  imageUrl,
  price,
  onBookAppointment
}: ProviderCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {imageUrl ? (
              <ImageWithFallback
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="mb-1">{name}</CardTitle>
            <p className="text-muted-foreground mb-2">{profession}</p>
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">{rating}</span>
                <span className="text-sm text-muted-foreground">({reviewCount})</span>
              </div>
              {price && (
                <span className="text-sm font-medium text-primary">{price}</span>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Especialidades</p>
          <div className="flex flex-wrap gap-1">
            {specialties.map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            {availability}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Phone className="w-4 h-4 mr-2" />
            Contactar
          </Button>
          <Button size="sm" className="flex-1" onClick={onBookAppointment}>
            Reservar Cita
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}