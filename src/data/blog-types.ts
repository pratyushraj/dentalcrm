import type { ReactNode } from 'react';

export interface BlogArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishDate: string;
  author: string;
  summary: string;
  featuredImage: string;
  metaDescription: string;
  content: ReactNode;
  faqs: Array<{ question: string; answer: string }>;
}
