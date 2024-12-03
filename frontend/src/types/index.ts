export interface User {
    id: number;
    login: string;
    fullName: string;
    email: string;
    avatar: string;
    rating: number;
    role: 'user' | 'admin';
    createdAt: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    status: 'active' | 'inactive';
    categories: Category[];
    author: User;
    rating: number;
    userVote?: 'LIKE' | 'DISLIKE' | null;
    likes?: Like[];
    commentsCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface Comment {
    id: number;
    content: string;
    author: User;
    post: Post;
    rating: number;
    userVote?: 'LIKE' | 'DISLIKE' | null;
    likes?: Like[];
    createdAt: string;
    updatedAt: string;
}

export interface Like {
    id: number;
    authorId: number;
    postId: number | null;
    commentId: number | null;
    type: 'LIKE' | 'DISLIKE' | null;
    createdAt: string;
}

export interface Category {
    id: number;
    title: string;
    description: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    success: boolean;
}

export interface PostFiltersType {
    title?: string;
    categories?: number[];
    sortBy?: 'rating' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
    status?: 'all' | 'active' | 'inactive';
    authorId?: number;
}
