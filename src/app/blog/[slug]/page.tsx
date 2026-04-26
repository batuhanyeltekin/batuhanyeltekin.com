import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import SubpageLayout from "@/components/layout/SubpageLayout";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Post Not Found" };
  
  return {
    title: `${post.title} | Batuhan Yeltekin`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  const mdxOptions = {
    mdxOptions: {
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            theme: "vitesse-dark",
            keepBackground: false,
          },
        ],
      ],
    },
  };

  return (
    <SubpageLayout currentPath={`blog/${post.slug}`}>
      <article className="animate-in fade-in duration-500">
        <header className="mb-10 pb-6 border-b border-white/10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm font-mono text-[var(--color-muted)]">
            <time className="text-[var(--color-accent)]">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs font-mono mt-4">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-[var(--color-muted)] bg-white/5 px-2 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </header>

        <div className="prose prose-invert prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 max-w-none text-gray-300">
          <MDXRemote source={post.content} options={mdxOptions as any} />
        </div>
      </article>
    </SubpageLayout>
  );
}
