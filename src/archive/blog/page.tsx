import Link from "next/link";
import SubpageLayout from "@/components/layout/SubpageLayout";
import { getAllPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog | Batuhan Yeltekin",
};

export default async function BlogIndex() {
  const posts = await getAllPosts();

  return (
    <SubpageLayout currentPath="blog">
      <div className="animate-in fade-in duration-500">
        <h1 className="text-3xl font-bold mb-10 text-white border-b border-white/10 pb-4">Blog</h1>
        
        {posts.length === 0 ? (
          <p className="text-gray-400 italic">No posts found. Check back later!</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                    <h2 className="text-xl font-bold text-white group-hover:text-[var(--color-accent)] transition-colors">
                      {post.title}
                    </h2>
                    <time className="font-mono text-sm text-[var(--color-accent)] sm:ml-auto shrink-0">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 text-xs font-mono">
                    {post.tags.map((tag, idx) => (
                      <span key={idx} className="text-gray-400 bg-white/5 px-2 py-1 rounded group-hover:bg-white/10 transition-colors">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </SubpageLayout>
  );
}
