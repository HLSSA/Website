export interface Coach {
    id: number;
    name: string;
    role: string;
    phone: string;
    description: string;
    image?: string;
}
  
export interface CoachFormData {
    name: string;
    role: string;
    phone: string;
    description: string;
}