import { PrismaClient } from "@prisma/client";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Facebook, Twitter, Link as LinkIcon } from "lucide-react";
import { notFound } from "next/navigation";
import ContactButton from "@/components/ui/ContactButton";

const prisma = new PrismaClient();

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });
  
  if (!post) {
    return { title: "Статтю не знайдено" };
  }

  return {
    title: post.metaTitle || `${post.title} | Блог Volt Premium`,
    description: post.metaDescription || post.title,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen pb-24">
      {/* Hero Header */}
      <div className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {post.image ? (
          <Image src={post.image} alt={post.title} fill className="object-cover grayscale opacity-40" priority />
        ) : (
          <div className="absolute inset-0 bg-surface-container" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-4xl mx-auto w-full px-margin-mobile md:px-margin-desktop pb-16">
            <Link href="/blog" className="inline-flex items-center gap-2 text-primary-fixed hover:text-white transition-colors mb-8 font-bold uppercase tracking-widest text-xs">
              <ArrowLeft size={16} /> Назад до блогу
            </Link>
            <div className="flex items-center gap-4 text-primary-fixed font-label-sm uppercase tracking-widest mb-4">
               <Clock size={16} />
               {new Date(post.createdAt).toLocaleDateString('uk-UA')}
            </div>
            <h1 className="text-4xl md:text-6xl font-display-lg text-white leading-tight tracking-tight">
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop mt-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar / Social */}
        <aside className="lg:col-span-1 hidden lg:block sticky top-32 h-fit">
          <div className="flex flex-col gap-4 text-secondary-fixed-dim">
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all">
              <Facebook size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all">
              <Twitter size={18} />
            </button>
            <button className="w-10 h-10 rounded-full border border-outline-variant/30 flex items-center justify-center hover:bg-primary-fixed hover:text-black transition-all">
              <LinkIcon size={18} />
            </button>
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-11 prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-primary-fixed overflow-hidden">
          <div 
            className="text-secondary-fixed-dim leading-relaxed font-body-md text-xl break-words whitespace-pre-wrap overflow-hidden w-full"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          <div className="mt-20 p-10 bg-surface-container rounded-2xl border border-outline-variant/20">
            <h3 className="text-2xl font-bold text-white mb-4">Маєте питання щодо вашого проєкту?</h3>
            <p className="text-secondary-fixed-dim mb-8">Замовте безкоштовну консультацію нашого інженера вже сьогодні.</p>
            <ContactButton className="inline-block bg-primary-fixed text-on-primary-fixed px-10 py-5 rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_30px_rgba(213,240,0,0.4)] transition-all">
              Зв'язатися з нами
            </ContactButton>
          </div>
        </div>
      </div>
    </main>
  );
}
