"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import HighlightedTitle from "@/components/ui/HighlightedTitle";

interface Post {
  id: string;
  title: string;
  slug: string;
  image: string;
  createdAt: string;
}

const BlogSection = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState({ 
    blogTitle: "Корисні матеріали",
    blogBadge: "Блог та поради",
    blogLinkText: "Всі статті →"
  });

  useEffect(() => {
    fetch("/api/blog").then((res) => res.json()).then((data) => setPosts(data.slice(0, 3)));
    fetch("/api/content").then(res => res.json()).then(data => {
      if (data) setContent(prev => ({ ...prev, ...data }));
    });
  }, []);

  if (posts.length === 0) return null;

  return (
    <section className="py-24 px-margin-desktop max-w-container-max mx-auto" id="blog">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
        <div className="max-w-xl">
          <span className="text-primary-fixed font-label-md tracking-widest uppercase mb-4 block">{content.blogBadge}</span>
          <HighlightedTitle text={content.blogTitle} className="font-headline-xl text-3xl md:text-4xl lg:text-headline-xl text-white" as="h2" />
        </div>
        <div className="h-px bg-outline-variant/30 flex-grow mx-8 mb-4 hidden md:block"></div>
        <Link href="/blog" className="text-primary-fixed font-bold hover:underline mb-4">{content.blogLinkText}</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group cursor-pointer"
          >
            <div className="aspect-video relative rounded-xl overflow-hidden border border-outline-variant/20 mb-6 bg-surface-container">
              <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="space-y-3">
              <p className="text-primary-fixed font-label-sm uppercase tracking-widest">
                {new Date(post.createdAt).toLocaleDateString('uk-UA')}
              </p>
              <h3 className="text-xl font-bold text-white group-hover:text-primary-fixed transition-colors leading-tight">
                {post.title}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BlogSection;
