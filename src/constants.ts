import { Course, Creator, Review } from './types';

export const COURSES: Course[] = [
  {
    id: '1',
    title: 'Advanced Generative AI for Engineers',
    description: 'Master LLMs, Stable Diffusion, and prompt engineering from scratch.',
    category: 'AI & ML',
    rating: 4.9,
    reviewsCount: 1200,
    price: 45000,
    oldPrice: 85000,
    instructor: {
      name: 'Dr. Kolawole A.',
      role: 'AI Researcher',
      avatar: 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&q=80&w=400&h=400',
    },
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPQ9EK1XQGbKatnJalNpA4UdD-LJmlfJ4tIka4EayAxRUYNVMaOFtj6aic4-pTgiW8mktG7cSSLDPLMKhBRhLQ29QJca8XzO_PvftHI2jZoejkcclTc_VALMmkNfsRloiIV1-hNtwgxkVcll2BGqA071QFqRf9mz2Go9jf4MXtmHPwU2WmwVtzExkTIz-byxv5-M5MSNVZPGAA5YtTj2ArjvCRfdUigWm8G_kTKbbKkuqKmZ_oIKnpHsPBOAEImauCTfSoP1nL-8jx',
    duration: '12 hrs content',
    isBestseller: true,
  },
  {
    id: '2',
    title: 'Mastering Python for Data Analytics',
    description: 'A complete guide to Pandas, NumPy and visualization for African markets.',
    category: 'DATA SCIENCE',
    rating: 4.8,
    reviewsCount: 840,
    price: 32500,
    instructor: {
      name: 'Chioma Oladipo',
      role: 'Data Analyst',
      avatar: 'https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?auto=format&fit=crop&q=80&w=400&h=400',
    },
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnhCVaYbZMPtO0lqnPuuKDNCHQjJsuZm1d8R8Pl-ESo3l4v9bnLFreQ3RF_TRrKvivgK4M2IhAGWt64_-KTy9nClugWgoUOmrnXLM5oxCGFDYptnj88TPYYSjkAxMBJ7Lm6DbzLhvbFv2K3hjuCoJBfTJ9bqKiPi0xr1t70u4VZfCSuum4oOOQiDXoLfdfh3OgDSUIsIB3uu20Y9VHh1sORViEKmCinxlM5ctOsGYxPVKFyrLszK6r_HfqnaLWxj5VVhlhUfkJVn-c',
    duration: '24 hrs content',
  },
  {
    id: '3',
    title: 'Full-Stack Web3 & AI Integration',
    description: 'Build decentralized applications powered by intelligent AI models.',
    category: 'WEB DEV',
    rating: 4.7,
    reviewsCount: 125,
    price: 55000,
    instructor: {
      name: 'Tunde Maxwell',
      role: 'Full Stack Developer',
      avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=400&h=400',
    },
    thumbnail: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBdKLdbTV5KI9Q-IZ7lqJu6LbWN_heTuQe40tuG4sUBGMVxYIHDWbh-eOqE1zV4B-AM1l4j5H3l4H-Zr6owNfz8BMxmyFmpM3MPgHuZyFU_o9meSSeaPNfLQ38MR3qyBq0w9DcDAemTf7fuD12t5U24W9k4ij6a5BCIOqnjtLRIwuCjD-7gIFEcSWagBpaeTaXFikicX_OOoPQcTWCd2T59Ay27_fa0UgKiJW95Po7Kn-OB0wqxjnwYCHMDfydTxTS_dlEKBfgkIZgK',
    duration: '45 hrs content',
    isNew: true,
  },
];

export const CREATORS: Creator[] = [
  {
    id: '1',
    name: 'Sade Williams',
    role: 'AI Ethicist',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&q=80&w=400&h=400',
    isVerified: true,
  },
  {
    id: '2',
    name: 'Emeka Daniel',
    role: 'ML Architect',
    avatar: 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80&w=400&h=400',
    isVerified: true,
  },
  {
    id: '3',
    name: 'Fatima Yusuf',
    role: 'Data Scientist',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400&h=400',
    isVerified: true,
  },
  {
    id: '4',
    name: 'Obinna Nwachukwu',
    role: 'NLP Engineer',
    avatar: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=400&h=400',
    isVerified: true,
  },
];

export const REVIEWS: Review[] = [
  {
    id: '1',
    userName: 'Chidi Enu',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7uhlrqJIxIaVbuI7rCETpCqadgkjhQ9OrAhgyGpQJAkEussNhBawXTn0YQrTH4gp88uPW7FmekABM1gsmVEdLUcukXwnmLO_ma6ip-jMQ3dUwXVWdoKzkfELuC6qEH0QYfTQMwYLGotIvrFvin39Hl0hid5-gAslXgcxcQB2kOQSvj2LKmEzYy9pAPId20car0IN_BhM6vkgYFnvI2MI4qU5UyCyHlQGHxx1ed3avTCWdrIqOffabv0bnog4Qmi98MFSOaVjPsX2x',
    rating: 5,
    comment: 'The best course for understanding the Nigerian fintech landscape through the lens of AI. Highly recommended for data analysts.',
  },
  {
    id: '2',
    userName: 'Fatima Bello',
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBIhpwCADl6BEn2xhSrxLgEnqwCLC9VvLhmtIwjnjDKviq8J2jidsMkk0TjNeXPsXTxRQuNH6kO9eybBPLgxUlIrMlowH9nPP3jzjZ4hySQkLJBtgxsnF7r6bbIEMhTNBKZeoZQjCrhtvhO3GjEwDAk7FjFm_KNvfii_jCBKs9d1J86s9rXu34P70vIPddq0X7r03Qq9b1wjeMFCk5IJKi3cUU1pnP6jLyIkpVkI0Ld91GDbMR_qhJkQfqVnjvVmF7ZWcBthk3uj3dW',
    rating: 4,
    comment: 'Practical and focused. The module on fraud detection was eye-opening. Worth every kobo.',
  },
];
