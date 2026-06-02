"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import HighlightedTitle from "@/components/ui/HighlightedTitle";

interface Post {
  id: string;
  title: string;
  slug: string;
  image: string;
  content: string;
  createdAt: string;
}

const BlogListingPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
      
    fetch("/api/content")
      .then(res => res.json())
      .then(data => setContent(data))
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen pt-20 pb-24 px-margin-mobile md:px-margin-desktop">
      <div className="max-w-container-max mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-secondary-fixed-dim hover:text-primary-fixed transition-colors mb-12 font-bold uppercase tracking-widest text-xs">
          <ArrowLeft size={16} /> Повернутися назад
        </Link>
        
        <div className="mb-16">
          <span className="text-primary-fixed font-label-md tracking-widest uppercase mb-4 block">{content?.blogBadge || "База знань"}</span>
          <HighlightedTitle 
            text={content?.blogTitle || "*Блог* та корисні поради"} 
            className="font-display-lg text-4xl md:text-5xl lg:text-6xl text-white mb-6" 
            as="h1" 
          />
          <p className="text-secondary-fixed-dim text-body-lg max-w-2xl">
            Ділимося експертним досвідом у сфері електромонтажу, енергоефективності та автоматизації сучасних об'єктів.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse space-y-4">
                <div className="aspect-video bg-surface-container rounded-xl"></div>
                <div className="h-4 bg-surface-container w-1/4 rounded"></div>
                <div className="h-8 bg-surface-container w-full rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="aspect-video relative rounded-xl overflow-hidden border border-outline-variant/20 mb-6 bg-surface-container">
                    <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-primary-fixed font-label-sm uppercase tracking-widest">
                      <Clock size={14} />
                      {new Date(post.createdAt).toLocaleDateString('uk-UA')}
                    </div>
                    <h2 className="text-2xl font-bold text-white group-hover:text-primary-fixed transition-colors leading-tight">
                      {post.title}
                    </h2>
                    <p className="text-secondary-fixed-dim line-clamp-2 text-sm">
                      {post.content ? post.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : ""}
                    </p>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default BlogListingPage;
