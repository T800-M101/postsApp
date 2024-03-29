export interface Post {
    id: string;
    title: string;
    content: string;
    imagePath: File | string;
    creator: string | undefined;
} 