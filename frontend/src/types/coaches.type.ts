// src/types/coaches.type.ts

export interface Person {
    id: number;
    name: string;
    role: string;
    category: 'Coach' | 'Player';
    age?: string; // Only for players: "under 12", "under 15", "under 18"
    image?: string;
    is_active: boolean;
    jersey_no?: string;
  }
  
  export interface PersonFormData {
    name: string;
    role: string;
    category: 'Coach' | 'Player';
    age: string; // Will be empty for coaches
    jersey_no: string;
  }
  
  // Legacy types for backward compatibility
  export interface Coach extends Person {
    category: 'Coach';
  }
  
  export interface Player extends Person {
    category: 'Player';
    age: string;
    jersey_no: string;
  }
  
  // Legacy form data type
  export interface CoachFormData {
    name: string;
    role: string;
    phone: string;
    description: string;
  }