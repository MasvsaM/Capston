export interface Cita {
  id: string;
  petId: string;
  petName: string;
  providerId: string;
  providerName: string;
  userId: string;
  service: string;
  date: string;
  time: string;
  location: string;
  price: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  providerImage?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
