export interface Partner {
  id: number;
  name: string;
  description: string;
  website_link: string;
  image?: string;
}

export interface PartnerFormData {
  name: string;
  description: string;
  website: string;
}