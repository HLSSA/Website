export interface Achievement {
    id: number;
    title: string;
    category: 'Tournament Win' | 'Player Accolade' | 'Collaboration';
    image: string;
    date: string;
    description: string;
    year: number;
  }
  
  export const achievements: Achievement[] = [
    {
      id: 1,
      title: "Super Cup 2024 Champions",
      category: "Tournament Win",
      image: "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg",
      date: "March 15, 2024",
      description: "Our U-16 team dominated the Super Cup tournament, showcasing exceptional teamwork and skill. After a thrilling final match that went into extra time, we emerged victorious with a 3-2 win against the defending champions. This victory marks our third consecutive Super Cup championship.",
      year: 2024
    },
    {
      id: 2,
      title: "Best Young Player Award - Arjun Sharma",
      category: "Player Accolade",
      image: "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg",
      date: "December 10, 2023",
      description: "Arjun Sharma, our star midfielder, was recognized as the Best Young Player in the regional league. His exceptional ball control, vision, and leadership qualities on the field have made him a standout performer. At just 15 years old, he has already scored 28 goals this season.",
      year: 2023
    },
    {
      id: 3,
      title: "City League Champions 2023",
      category: "Tournament Win",
      image: "https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg",
      date: "November 22, 2023",
      description: "A historic victory in the City League Championship! Our senior team went undefeated throughout the season, winning 18 matches and drawing only 2. The championship game was a nail-biting affair that showcased the dedication and training our players have put in throughout the year.",
      year: 2023
    },
    {
      id: 4,
      title: "Golden Boot - Priya Patel",
      category: "Player Accolade",
      image: "https://images.pexels.com/photos/1884576/pexels-photo-1884576.jpeg",
      date: "October 5, 2023",
      description: "Priya Patel earned the Golden Boot award for being the top scorer in the women's division with 32 goals in 20 matches. Her incredible finishing ability and work ethic have inspired the entire academy. She has become a role model for young female players in our community.",
      year: 2023
    },
    {
      id: 5,
      title: "Partnership with Manchester United Academy",
      category: "Collaboration",
      image: "https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg",
      date: "August 18, 2023",
      description: "We're proud to announce our official partnership with Manchester United Academy. This collaboration will provide our players with world-class training methodologies, coaching certifications, and exchange programs. Selected players will have opportunities to train in Manchester.",
      year: 2023
    },
    {
      id: 6,
      title: "Regional Cup Winners 2022",
      category: "Tournament Win",
      image: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg",
      date: "December 12, 2022",
      description: "Our U-14 team made history by becoming the youngest squad to win the Regional Cup. Despite facing teams with older players, our young stars showed incredible determination and skill. The final match was a testament to the quality of training and mentorship at HLSSA.",
      year: 2022
    }
  ];
  
  export const categories = ['All', 'Tournament Win', 'Player Accolade', 'Collaboration'] as const;
  export type CategoryFilter = typeof categories[number];