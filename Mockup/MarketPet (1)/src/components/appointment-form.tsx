import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Calendar, Clock } from "lucide-react";

interface AppointmentFormProps {
  providerName: string;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export function AppointmentForm({
  providerName,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const [formData, setFormData] = useState({
    petName: "",
    service: "",
    date: "",
    time: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(formData);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Reservar Cita con {providerName}</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="petName">Seleccionar Mascota</Label>
            <Select
              value={formData.petName}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  petName: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Elige tu mascota" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="max">
                  Max (Golden Retriever)
                </SelectItem>
                <SelectItem value="luna">
                  Luna (Gato Persa)
                </SelectItem>
                <SelectItem value="rocky">
                  Rocky (Bulldog)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="service">Tipo de Servicio</Label>
            <Select
              value={formData.service}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  service: value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="consulta">
                  Consulta General
                </SelectItem>
                <SelectItem value="vacunacion">
                  Vacunación
                </SelectItem>
                <SelectItem value="cirugia">Cirugía</SelectItem>
                <SelectItem value="limpieza">
                  Limpieza Dental
                </SelectItem>
                <SelectItem value="grooming">
                  Grooming
                </SelectItem>
                <SelectItem value="paseo">Paseo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Fecha</Label>
              <div className="relative">
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="pl-8"
                />
                <Calendar className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div>
              <Label htmlFor="time">Hora</Label>
              <div className="relative">
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="pl-8"
                />
                <Clock className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              placeholder="Describe el motivo de la consulta o cualquier información relevante..."
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              Confirmar Cita
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}