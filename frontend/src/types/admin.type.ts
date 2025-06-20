export interface Admin {
    id: string;
    username: string;
    password?: string;
}
  
export interface AdminFormData {
    username: string;
    password: string;
}