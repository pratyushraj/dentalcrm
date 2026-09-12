import { BLOGS_PART1 } from './blogs-part1';
import { BLOGS_PART2 } from './blogs-part2';
import { BLOGS_PART3 } from './blogs-part3';

export type { BlogArticle } from './blog-types';

export const BLOGS = [
  ...BLOGS_PART1,
  ...BLOGS_PART2,
  ...BLOGS_PART3,
];
