import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  draft: boolean;
  content: string;
  readingTime: string;
}

const postsDirectory = path.join(process.cwd(), "content", "blog");

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    const fileContents = await fs.readFile(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const wordsPerMinute = 200;
    const numberOfWords = content.split(/\s+/).length;
    const readingTime = Math.ceil(numberOfWords / wordsPerMinute);

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
      tags: data.tags || [],
      draft: data.draft || false,
      content,
      readingTime: `${readingTime} min read`,
    };
  } catch (e) {
    return null;
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(postsDirectory);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const posts = await Promise.all(
      mdxFiles.map(async (file) => {
        const slug = file.replace(/\.mdx$/, "");
        const post = await getPostBySlug(slug);
        return post;
      })
    );

    return posts
      .filter((post): post is BlogPost => post !== null && !post.draft)
      .sort((a, b) => (new Date(a.date) > new Date(b.date) ? -1 : 1));
  } catch (e) {
    return [];
  }
}
