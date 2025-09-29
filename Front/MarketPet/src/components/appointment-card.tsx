import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Calendar,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface AppointmentCardProps {
  petName: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  providerImage?: string;
  onCall?: () => void;
  onMessage?: () => void;
  onReschedule?: () => void;
}

export function AppointmentCard({
  petName,
  providerName,
  service,
  date,
  time,
  location,
  price,
  status,
  providerImage,
  onCall,
  onMessage,
  onReschedule,
}: AppointmentCardProps) {
  const statusColors = {
    confirmed: "bg-green-500",
    pending: "bg-yellow-500",
    completed: "bg-blue-500",
    cancelled: "bg-red-500",
  };

  const statusLabels = {
    confirmed: "Confirmada",
    pending: "Pendiente",
    completed: "Completada",
    cancelled: "Cancelada",
  };

  return (
    <Card className="shadow-sm border-0 bg-white">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Provider Image */}
          <div className="w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
            {providerImage ? (
              <ImageWithFallback
                src={providerImage}
                alt={providerName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <div className="w-6 h-6 bg-primary rounded-full" />
              </div>
            )}
          </div>

          {/* Appointment Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold leading-tight">
                  {service} - {petName}
                </h4>
                <p className="text-muted-foreground text-sm">
                  {providerName}
                </p>
              </div>
              <Badge
                className={`${statusColors[status]} text-white text-xs px-2 py-1`}
              >
                {statusLabels[status]}
              </Badge>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>
                  {date} - {time}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-primary">
                  {price}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={onCall}
              >
                <Phone className="w-3 h-3 mr-2" />
                Llamar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 h-8"
                onClick={onMessage}
              >
                <MessageCircle className="w-3 h-3 mr-2" />
                Mensaje
              </Button>
              {status === "confirmed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8"
                  onClick={onReschedule}
                >
                  <Clock className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}