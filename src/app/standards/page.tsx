import { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";

const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "Стандарти якості | VOLT PREMIUM",
  description: "Наші стандарти роботи та якості для преміальної нерухомості.",
};

export default async function StandardsPage() {
  const standards = await prisma.standardItem.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main className="min-h-screen bg-background text-on-background pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-margin-desktop overflow-hidden border-b border-outline-variant/20">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-surface-container to-background opacity-50" />
        <div className="relative z-10 max-w-container-max mx-auto text-center">
          <div className="inline-flex items-center gap-3 bg-surface-container/80 backdrop-blur px-4 py-2 rounded-full border border-outline-variant/30 mb-8 mx-auto">
            <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
              workspace_premium
            </span>
            <span className="text-on-surface-variant font-label-lg uppercase tracking-wider">Premium Quality</span>
          </div>
          <h1 className="font-headline-xl text-display-lg-mobile md:text-display-lg mb-6 bg-gradient-to-br from-on-background to-on-surface-variant bg-clip-text text-transparent max-w-4xl mx-auto">
            Наші стандарти
          </h1>
          <p className="text-secondary-fixed-dim text-xl leading-relaxed max-w-2xl mx-auto">
            Ми дотримуємося найвищих стандартів інженерної практики, щоб забезпечити бездоганну якість та надійність кожної деталі.
          </p>
        </div>
      </section>

      {/* Standards List */}
      <section className="py-24 px-margin-desktop max-w-container-max mx-auto relative">
        <div className="absolute left-1/2 top-24 bottom-24 w-px bg-outline-variant/20 hidden lg:block" />
        
        <div className="space-y-12 lg:space-y-24">
          {standards.map((std, idx) => (
            <div key={std.id} className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-16 ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}>
              <div className="flex-1 w-full relative">
                <div className={`hidden lg:flex absolute top-1/2 -translate-y-1/2 w-8 h-px bg-primary-fixed/50 ${idx % 2 === 0 ? '-right-16' : '-left-16'}`} />
                <div className="bg-surface-container rounded-3xl p-8 border border-outline-variant/30 hover:border-primary-fixed/50 transition-colors shadow-lg hover:shadow-primary-fixed/10 group">
                  <div className="w-16 h-16 rounded-2xl bg-background border border-outline-variant/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-3xl text-primary-fixed">{std.icon || "star"}</span>
                  </div>
                  <h3 className="font-headline-lg text-on-background mb-4 group-hover:text-primary-fixed transition-colors">{std.title}</h3>
                  <p className="text-on-surface-variant text-lg leading-relaxed">{std.description}</p>
                </div>
              </div>
              <div className="hidden lg:flex w-16 h-16 shrink-0 rounded-full bg-surface-container border-4 border-background items-center justify-center z-10 text-primary-fixed font-headline-md shadow-xl">
                {idx + 1}
              </div>
              <div className="flex-1 hidden lg:block" />
            </div>
          ))}

          {standards.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant">
              Стандарти ще не додані.
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-margin-desktop max-w-container-max mx-auto">
        <div className="relative overflow-hidden bg-surface-container rounded-3xl p-8 md:p-16 border border-outline-variant/20 text-center max-w-4xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-fixed to-transparent opacity-50" />
          <h2 className="font-headline-lg text-on-background mb-6">Переконайтеся у нашій якості</h2>
          <p className="text-on-surface-variant mb-10 text-xl max-w-2xl mx-auto">Довірте свій об'єкт професіоналам, які не йдуть на компроміси в питаннях безпеки та надійності.</p>
          <Link href="/#contact" className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed font-label-lg px-8 py-4 rounded-xl hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-fixed/20">
            <span>Обговорити проект</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
