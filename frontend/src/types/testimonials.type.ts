export interface TestimonialFormData {
    name: string;
    role: string;
    feedback: string;
}

export interface Testimonial {
    id: number;
    name: string;
    role: string;
    feedback: string;
    image?: string;
    rating?: number;
    createdAt?: string;
    updatedAt?: string;
    isActive?: boolean;
}