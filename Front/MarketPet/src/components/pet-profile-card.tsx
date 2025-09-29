import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Calendar, Heart, MapPin, Edit3 } from "lucide-react"
import { ImageWithFallback } from "./figma/ImageWithFallback"

interface PetProfileCardProps {
  name: string
  species: string
  breed: string
  age: string
  weight: string
  vaccinations: string[]
  location: string
  imageUrl?: string
  onEdit?: () => void
}

export function PetProfileCard({
  name,
  species,
  breed,
  age,
  weight,
  vaccinations,
  location,
  imageUrl,
  onEdit
}: PetProfileCardProps) {
  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-shadow">
      <CardHeader className="text-center pb-2">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full overflow-hidden bg-muted">
          {imageUrl ? (
            <ImageWithFallback
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
              <Heart className="w-8 h-8 text-primary" />
            </div>
          )}
        </div>
        <CardTitle className="flex items-center justify-center gap-2">
          {name}
          <Button variant="ghost" size="sm" onClick={onEdit} className="h-6 w-6 p-0">
            <Edit3 className="w-3 h-3" />
          </Button>
        </CardTitle>
        <p className="text-muted-foreground">{breed} • {species}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Edad</p>
            <p>{age}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Peso</p>
            <p>{weight}</p>
          </div>
        </div>

        <div>
          <p className="text-muted-foreground text-sm mb-2">Vacunas al día</p>
          <div className="flex flex-wrap gap-1">
            {vaccinations.map((vaccine, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {vaccine}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="w-4 h-4" />
          {location}
        </div>

        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Calendar className="w-4 h-4 mr-2" />
            Agendar Cita
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}