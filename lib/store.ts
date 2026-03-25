import fs from "fs";
import path from "path";
import type { Article, Category } from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
const ARTICLES_FILE = path.join(DATA_DIR, "articles.json");
const CATEGORIES_FILE = path.join(DATA_DIR, "categories.json");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ─── Articles ────────────────────────────────────────────────

export function readArticles(): Article[] {
  ensureDataDir();
  if (!fs.existsSync(ARTICLES_FILE)) {
    fs.writeFileSync(ARTICLES_FILE, "[]", "utf-8");
    return [];
  }
  const raw = fs.readFileSync(ARTICLES_FILE, "utf-8");
  return JSON.parse(raw) as Article[];
}

export function writeArticles(articles: Article[]): void {
  ensureDataDir();
  fs.writeFileSync(ARTICLES_FILE, JSON.stringify(articles, null, 2), "utf-8");
}

export function readCategories(): Category[] {
  ensureDataDir();
  if (!fs.existsSync(CATEGORIES_FILE)) {
    fs.writeFileSync(CATEGORIES_FILE, "[]", "utf-8");
    return [];
  }
  const raw = fs.readFileSync(CATEGORIES_FILE, "utf-8");
  return JSON.parse(raw) as Category[];
}

export function writeCategories(categories: Category[]): void {
  ensureDataDir();
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), "utf-8");
}