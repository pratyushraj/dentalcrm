import { BLOGS_PART1 } from './blogs-part1';
import { BLOGS_PART2 } from './blogs-part2';
import { BLOGS_PART3 } from './blogs-part3';
import { BLOGS_PART4 } from './blogs-part4';

import type { BlogArticle } from './blog-types';
export type { BlogArticle } from './blog-types';

export const BLOGS: BlogArticle[] = [
  ...BLOGS_PART1,
  ...BLOGS_PART2,
  ...BLOGS_PART3,
  ...BLOGS_PART4,
].filter((b): b is BlogArticle => Boolean(b && b.slug));

