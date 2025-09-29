export interface User {
  uid: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  planType: 'Básico' | 'Premium' | 'Familiar';
  userType: 'client' | 'provider';
  businessName?: string;
  services?: string[];
  rating?: number;
  totalReviews?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  userId: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  weight: string;
  vaccinations: string[];
  location: string;
  medicalHistory?: string[];
  preferences?: string[];
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Provider {
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

export interface Appointment {
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

export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  subcategories?: string[];
}