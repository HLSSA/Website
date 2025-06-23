    // src/types/news.type.ts

export interface NewsArticle {
    id: string;
    title: string;
    excerpt: string;
    date: string;
    author: string;
    category: string;
    article_url?: string;
    image?: string;
    featured: boolean;
    fullStory?: string;
    isactive: boolean;
    created_at?: string;
}

export interface NewsFormData {
    title: string;
    excerpt: string;
    author: string;
    category: string;
    fullStory: string;
    article_url: string;
    featured: boolean;
    isactive: boolean;
}