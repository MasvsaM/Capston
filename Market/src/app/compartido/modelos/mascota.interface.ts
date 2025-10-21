export interface Mascota {
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
