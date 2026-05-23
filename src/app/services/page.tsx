import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Всі Послуги | VOLT PREMIUM",
  description: "Повний перелік послуг з електромонтажу, альтернативної енергії та розумного дому від VOLT PREMIUM.",
};

export const revalidate = 60;

export default async function ServicesPage() {
  const allServices = await prisma.servicePage.findMany({
    orderBy: { createdAt: "asc" }
  });

  // Group by category
  const grouped = allServices.reduce((acc, service) => {
    const cat = service.category || "Основні послуги";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(service);
    return acc;
  }, {} as Record<string, typeof allServices>);

  // Render icon helper
  const renderIcon = (iconName: string) => {
    if (!iconName) return <span className="material-symbols-outlined text-primary-fixed text-4xl mb-4">settings_input_component</span>;
    return <span className="material-symbols-outlined text-primary-fixed text-4xl mb-4">{iconName}</span>;
  };

  return (
    <main className="min-h-screen bg-background selection:bg-primary-fixed/30 text-on-background font-sans overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 px-margin-desktop max-w-container-max mx-auto text-center">
        <h1 className="font-headline-xl text-display-md-mobile md:text-display-lg text-white mb-6">
          Всі Послуги
        </h1>
        <p className="text-secondary-fixed-dim text-lg md:text-xl max-w-3xl mx-auto">
          Комплексні інженерні рішення для преміальної нерухомості. Оберіть категорію, щоб дізнатися більше.
        </p>
      </section>

      {/* Services List */}
      <section className="py-16 px-margin-desktop max-w-container-max mx-auto space-y-24">
        {Object.entries(grouped).map(([category, services]) => (
          <div key={category}>
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-bold text-white">{category}</h2>
              <div className="h-px bg-outline-variant/30 flex-grow"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link 
                  key={service.id} 
                  href={`/services/${service.slug}`} 
                  className="bg-surface-container rounded-xl p-8 border border-outline-variant/20 group hover:border-primary-fixed/40 transition-all flex flex-col overflow-hidden relative block"
                >
                  <div className="relative z-10 flex-grow">
                    {renderIcon(service.icon)}
                    <h3 className="font-headline-lg text-white mb-3 text-2xl">{service.title}</h3>
                    <p className="text-secondary-fixed-dim line-clamp-3">{service.description}</p>
                  </div>
                  
                  <div className="mt-8 relative z-10 flex items-center text-primary-fixed font-bold text-sm">
                    Детальніше <span className="material-symbols-outlined ml-1 text-base group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  </div>

                  {service.image && (
                    <img 
                      className="absolute -right-10 -bottom-10 w-2/3 h-2/3 object-cover opacity-10 grayscale group-hover:scale-105 transition-transform rounded-full blur-sm" 
                      src={service.image} 
                      alt={service.title}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      <Footer />
    </main>
  );
}
