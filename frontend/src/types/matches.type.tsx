export interface Match {
    id: string;
    opponent_name: string;
    opponent_image?: string;
    datetime: string;
    location: string;
    result?: string;
}
  
export interface MatchFormData {
    opponent_name: string;
    datetime: string;
    location: string;
    result: string;
}