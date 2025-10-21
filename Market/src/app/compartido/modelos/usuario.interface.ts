export interface Usuario {
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
