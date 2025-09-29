import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Calendar, Heart, MapPin, Edit3, Phone } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface MobilePetProfileCardProps {
  name: string
  species: string
  breed: string
  age: string
  weight: string
  vaccinations: string[]
  location: string
  imageUrl?: string
  onEdit?: () => void
  onBookAppointment?: () => void
}

export function MobilePetProfileCard({
  name,
  species,
  breed,
  age,
  weight,
  vaccinations,
  location,
  imageUrl,
  onEdit,
  onBookAppointment
}: MobilePetProfileCardProps) {
  return (
    <Card className="w-full shadow-sm border-0 bg-white">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Pet Image */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-muted flex-shrink-0">
            {imageUrl ? (
              <ImageWithFallback
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary" />
              </div>
            )}
          </div>

          {/* Pet Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg leading-tight">{name}</h3>
                <p className="text-muted-foreground text-sm">{breed} • {species}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onEdit} className="h-8 w-8 p-0">
                <Edit3 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-4 text-sm mb-3">
              <div>
                <span className="text-muted-foreground">Edad: </span>
                <span>{age}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Peso: </span>
                <span>{weight}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <MapPin className="w-4 h-4" />
              {location}
            </div>

            {/* Vaccinations */}
            <div className="mb-4">
              <p className="text-muted-foreground text-sm mb-1">Vacunas al día</p>
              <div className="flex flex-wrap gap-1">
                {vaccinations.slice(0, 2).map((vaccine, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {vaccine}
                  </Badge>
                ))}
                {vaccinations.length > 2 && (
                  <Badge variant="outline" className="text-xs">
                    +{vaccinations.length - 2}
                  </Badge>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 h-9"
                onClick={onBookAppointment}
              >
                <Calendar className="w-4 h-4 mr-2" />
                Cita
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-3">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}