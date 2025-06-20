export interface Achievement {
    id: number;
    title: string;
    description: string;
    category: string;
    image?: string;
    video?: string;
}
  
export interface AchievementFormData {
    title: string;
    description: string;
    category: string;
}