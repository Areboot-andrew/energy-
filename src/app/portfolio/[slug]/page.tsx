import { PrismaClient } from "@prisma/client";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";

const prisma = new PrismaClient();

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({
    where: { slug },
  });
  
  if (!project) {
    return { title: "Проєкт не знайдено" };
  }

  return {
    title: project.metaTitle || `${project.title} | Портфоліо Volt Premium`,
    description: project.metaDescription || project.shortDescription,
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = await prisma.portfolioProject.findUnique({
    where: { slug },
    include: { media: true }
  });

  const content = await prisma.pageContent.findUnique({
    where: { id: "singleton" }
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-on-background pb-16 pt-24 md:pb-24 md:pt-32">
      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop">
        <Link href="/portfolio" className="text-secondary-fixed-dim hover:text-white flex items-center gap-2 mb-6 md:mb-8 w-fit transition-colors">
          <ArrowLeft size={18} /> {content?.termToAllProjects || "До всіх проєктів"}
        </Link>
        
        {/* Header Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16">
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-outline-variant/30">
            {project.coverImage.endsWith(".mp4") || project.coverImage.endsWith(".webm") ? (
              <video src={project.coverImage} className="w-full h-full object-cover" autoPlay loop muted playsInline controls />
            ) : project.coverImage.includes("youtube.com") || project.coverImage.includes("youtu.be") ? (
              <iframe 
                src={project.coverImage.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                className="w-full h-full object-cover" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              />
            ) : (
              <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
            )}
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="flex gap-4 items-center mb-6">
              <span className="text-primary-fixed font-bold text-sm bg-primary-fixed/10 px-4 py-2 rounded-lg border border-primary-fixed/20 tracking-widest uppercase">
                {project.category}
              </span>
              {project.totalPrice && (
                <span className="text-white font-bold text-lg">{project.totalPrice}</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">{project.title}</h1>
            <p className="text-secondary-fixed-dim text-lg leading-relaxed mb-8">{project.shortDescription}</p>
          </div>
        </div>

        {/* Content Section (Rich Text) */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-20 bg-surface-container-low p-6 md:p-12 rounded-3xl border border-outline-variant/20 prose prose-invert prose-lg max-w-none prose-headings:text-white prose-a:text-primary-fixed break-words whitespace-pre-wrap overflow-hidden w-full">
          <div className="prose prose-invert prose-lg max-w-none prose-img:rounded-xl prose-a:text-primary-fixed prose-headings:text-white" dangerouslySetInnerHTML={{ __html: project.content }} />
        </div>

        {/* Internal Media Gallery */}
        {project.media && project.media.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-8 border-b border-outline-variant/10 pb-4">{content?.termProjectGallery || "Галерея проєкту"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {project.media.map((m) => {
                const isVideo = m.type === "VIDEO" || m.url.includes("youtube.com") || m.url.includes("youtu.be");
                return (
                  <div key={m.id} className="relative aspect-square rounded-2xl overflow-hidden border border-outline-variant/20 bg-surface-container group">
                    {isVideo ? (
                      m.url.includes("youtube.com") || m.url.includes("youtu.be") ? (
                        <iframe 
                          src={m.url.replace("watch?v=", "embed/").replace("youtu.be/", "youtube.com/embed/")} 
                          className="w-full h-full object-cover" 
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen
                        />
                      ) : (
                        <video src={m.url} className="w-full h-full object-cover" controls preload="metadata" />
                      )
                    ) : (
                      <img src={m.url} alt="Project detail" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}
