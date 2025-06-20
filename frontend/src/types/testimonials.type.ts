export interface Testimonial {
    id: number;
    name: string;
    role: string;
    feedback: string;
    image?: string;
}
  
export interface TestimonialFormData {
    name: string;
    role: string;
    feedback: string;
}