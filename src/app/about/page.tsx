import { Metadata } from "next";
import Link from "next/link";
import * as LucideIcons from "lucide-react";
import PortfolioCarousel from "@/components/sections/PortfolioCarousel";
import Contacts from "@/components/sections/Contacts";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function generateMetadata(): Promise<Metadata> {
  const content = await prisma.pageContent.findUnique({
    where: { id: "singleton" },
  });

  return {
    title: content?.aboutSeoTitle || "Про Компанію | VOLT PREMIUM",
    description: content?.aboutSeoDescription || "Дізнайтеся більше про нашу місію, підхід до електромонтажу преміум-класу та команду експертів.",
  };
}

export default async function AboutPage() {
  const content = await prisma.pageContent.findUnique({
    where: { id: "singleton" },
  });

  let values: { icon: string, title: string, description: string }[] = [];
  try {
    values = JSON.parse(content?.aboutValuesBlock || "[]");
  } catch(e) {}

  let steps: { title: string, desc: string }[] = [];
  try {
    steps = JSON.parse(content?.aboutStepsBlock || "[]");
  } catch(e) {}

  let stats: { number: string, label: string }[] = [];
  try {
    stats = JSON.parse(content?.aboutStatsBlock || "[{\"number\":\"10+\",\"label\":\"РОКІВ ДОСВІДУ\"},{\"number\":\"250+\",\"label\":\"УСПІШНИХ ПРОЄКТІВ\"},{\"number\":\"5\",\"label\":\"РОКІВ ГАРАНТІЇ\"}]");
  } catch(e) {}

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": content?.companyName || "VOLT PREMIUM",
    "url": "https://voltpremium.ua",
    "logo": content?.logoImageUrl || "",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": content?.contactPhone,
      "contactType": "customer service"
    }
  };

  return (
    <main className="min-h-screen pt-32 pb-24 bg-background text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Hero Section */}
      <section className="px-margin-desktop max-w-container-max mx-auto mb-24">
        <Link href="/" className="inline-block mb-8 text-primary-fixed hover:text-primary-fixed-dim transition-colors">
          &larr; Повернутися на головну
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h1 className="font-headline-xl text-4xl md:text-5xl lg:text-6xl text-white">
              {content?.aboutHeroTitle1 || "VOLT"} <span className="text-primary-fixed">{content?.aboutHeroTitle2 || "PREMIUM"}</span>
            </h1>
            <h2 className="text-2xl md:text-3xl text-secondary-fixed-dim font-bold">
              {content?.aboutPageSubtitle || "Ми створюємо нервову систему вашого будинку."}
            </h2>
            {content?.aboutPageText ? (
              <div 
                className="prose prose-invert prose-p:text-secondary-fixed-dim prose-lg text-secondary-fixed-dim leading-relaxed" 
                dangerouslySetInnerHTML={{ __html: content.aboutPageText }} 
              />
            ) : (
              <div className="prose prose-invert prose-p:text-secondary-fixed-dim prose-lg text-secondary-fixed-dim leading-relaxed">
                <p>
                  Більше 10 років ми спеціалізуємося на електромонтажі преміум-класу, інтеграції систем "Розумний дім" та альтернативній енергетиці у Львові та області.
                </p>
                <p>
                  Наш підхід базується на скандинавських принципах якості: мінімалізм у виконанні, максимальна функціональність та бескомпромісна безпека. Ми віримо, що ідеальний електромонтаж – це той, який ви не помічаєте, але який безвідмовно працює десятиліттями.
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-4 pt-4">
              {stats.map((s, i) => (
                <div key={i} className="bg-surface-container border border-outline-variant/30 px-6 py-4 rounded-xl">
                  <div className="text-3xl font-bold text-primary-fixed mb-1">{s.number}</div>
                  <div className="text-sm text-secondary-fixed-dim font-label-md uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:aspect-square">
            <img 
              src={content?.aboutPageCoverImage || "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"} 
              alt={`Команда ${content?.companyName || 'VOLT PREMIUM'}`} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Values Section */}
      {values.length > 0 && (
        <section className="py-24 bg-surface-dim border-y border-outline-variant/10">
          <div className="px-margin-desktop max-w-container-max mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-headline-xl mb-4 text-white">{content?.aboutValuesTitle || "Наші цінності"}</h2>
              <p className="text-secondary-fixed-dim text-lg max-w-2xl mx-auto">
                {content?.aboutValuesSubtitle || "Ми не йдемо на компроміси, коли справа стосується якості та безпеки."}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((val, idx) => {
                const IconComp = (LucideIcons as any)[val.icon] || LucideIcons.CheckCircle2;
                return (
                  <div key={idx} className="bg-surface-container p-8 rounded-2xl border border-outline-variant/20 hover:border-primary-fixed/40 transition-colors">
                    <div className="mb-6"><IconComp className="text-primary-fixed" size={32} /></div>
                    <h3 className="text-xl font-bold text-white mb-3">{val.title}</h3>
                    <p className="text-secondary-fixed-dim">{val.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* How we work steps */}
      {steps.length > 0 && (
        <section className="py-24 px-margin-desktop max-w-container-max mx-auto">
          <h2 className="font-headline-xl text-center mb-16 text-white">{content?.aboutStepsTitle || "Етапи співпраці"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-outline-variant/20 -translate-y-1/2 -z-10"></div>
            {steps.map((step, idx) => (
              <div key={idx} className="bg-surface-container border border-outline-variant/30 p-8 rounded-2xl relative z-10">
                <div className="w-12 h-12 bg-primary-fixed text-on-primary-fixed font-bold text-xl flex items-center justify-center rounded-full mb-6 shadow-[0_0_15px_rgba(213,240,0,0.3)]">
                  {idx + 1}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-secondary-fixed-dim">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Portfolio & Contacts */}
      <PortfolioCarousel />
      <Contacts />
    </main>
  );
}
