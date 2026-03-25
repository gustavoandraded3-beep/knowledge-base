export type ArticleStatus = "draft" | "published";

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;        // HTML string
  excerpt: string;
  category: string;       // category slug
  tags: string[];
  status: ArticleStatus;
  sourceFile?: string;    // relative path under /uploads
  originalFileName?: string;
  viewCount: number;
  createdAt: string;      // ISO string
  updatedAt: string;      // ISO string
  author: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;           // lucide icon name
  color: string;          // tailwind color class
  articleCount?: number;
}

export interface ParseResult {
  title: string;
  content: string;        // HTML
  excerpt: string;
  headings: Heading[];
  wordCount: number;
  fileType: "pdf" | "docx" | "doc" | "txt";
}

export interface Heading {
  id: string;
  text: string;
  level: number;
}

export interface SearchResult {
  article: Article;
  score: number;
  matchedIn: ("title" | "content" | "tags")[];
  highlights: {
    title?: string;
    excerpt?: string;
  };
}

export interface UploadedFile {
  name: string;
  path: string;
  size: number;
  type: string;
  uploadedAt: string;
}