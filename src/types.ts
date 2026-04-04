export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  rating: number;
  reviewsCount: number;
  price: number;
  oldPrice?: number;
  instructor: {
    name: string;
    role: string;
    avatar: string;
  };
  thumbnail: string;
  duration: string;
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface Creator {
  id: string;
  name: string;
  role: string;
  avatar: string;
  isVerified?: boolean;
}

export interface Review {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
}
