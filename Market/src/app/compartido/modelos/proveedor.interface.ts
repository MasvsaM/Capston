export interface Proveedor {
  id: string;
  userId: string;
  name: string;
  profession: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  location: string;
  availability: string;
  price: string;
  imageUrl?: string;
  services: string[];
  businessName: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}
