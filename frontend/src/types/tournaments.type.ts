export interface Tournament {
  id: number;
  name: string;
  description: string;
  image?: string;
}

export interface TournamentFormData {
  name: string;
  description: string;
}