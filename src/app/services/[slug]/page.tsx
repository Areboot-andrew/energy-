import { notFound } from "next/navigation";
import Link from "next/link";
import { Metadata } from "next";
import { PrismaClient } from "@prisma/client";
import ContactButton from "@/components/ui/ContactButton";

const prisma = new PrismaClient();

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await prisma.servicePage.findUnique({
    where: { slug },
  });
  
  if (!service) {
    return {
      title: "Послуга не знайдена",
    };
  }

  return {
    title: service.metaTitle || `${service.title} | Комплексні рішення`,
    description: service.metaDescription || service.description,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = await prisma.servicePage.findUnique({
    where: { slug },
  });

  if (!service) {
    notFound();
  }

  const advantages = service.advantages ? JSON.parse(service.advantages) as any[] : [];
  const components = service.components ? JSON.parse(service.components) as any[] : [];
  const included = service.included ? JSON.parse(service.included) as any[] : [];

  return (
    <main className="min-h-screen bg-background text-on-background pb-16 md:pb-24">
      {/* Hero Section */}
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 px-4 md:px-margin-desktop overflow-hidden border-b border-outline-variant/20">
        <div className="absolute inset-0 z-0">
          {service.image ? (
            <img src={service.image} alt={service.title} className="w-full h-full object-cover opacity-20" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-surface-container to-background opacity-50" />
          )}
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
        </div>
        
        <div className="relative z-10 max-w-container-max mx-auto">
          <div className="flex flex-col lg:flex-row items-start gap-8 md:gap-12">
            <div className="flex-1">
              <div className="inline-flex items-center gap-3 bg-surface-container/80 backdrop-blur px-4 py-2 rounded-full border border-outline-variant/30 mb-6 md:mb-8">
                <span className="material-symbols-outlined text-primary-fixed" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {service.icon || 'bolt'}
                </span>
                <span className="text-on-surface-variant font-label-lg uppercase tracking-wider">Преміум Послуга</span>
              </div>
              <h1 className="font-headline-xl text-4xl sm:text-5xl md:text-display-lg mb-4 md:mb-6 bg-gradient-to-br from-on-background to-on-surface-variant bg-clip-text text-transparent">
                {service.title}
              </h1>
              <p className="text-secondary-fixed-dim text-xl leading-relaxed max-w-3xl">
                {service.description}
              </p>
            </div>
            
            {service.estimatedPrice && (
              <div className="w-full md:w-80 shrink-0">
                <div className="sticky top-32 bg-surface-container p-8 rounded-3xl border border-outline-variant/30 shadow-2xl backdrop-blur-md">
                  <p className="text-on-surface-variant font-label-md mb-2 uppercase tracking-wide">Орієнтовна Вартість</p>
                  <p className="text-4xl font-headline-lg text-primary-fixed mb-6">{service.estimatedPrice}</p>
                  <ContactButton className="block text-center bg-primary-fixed text-on-primary-fixed font-label-lg px-6 py-4 rounded-xl hover:opacity-90 transition-all hover:shadow-lg hover:shadow-primary-fixed/20">
                    Залишити Заявку
                  </ContactButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-container-max mx-auto px-4 md:px-margin-desktop py-12 md:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12">
        <div className="lg:col-span-8 space-y-12 md:space-y-16">
          {/* Content Section */}
          {service.content && (
            <section className="prose prose-invert prose-lg max-w-none prose-headings:font-headline-lg prose-p:text-on-surface-variant prose-a:text-primary-fixed break-words whitespace-pre-wrap overflow-hidden w-full">
              <div className="prose prose-invert prose-lg max-w-none prose-img:rounded-xl prose-a:text-primary-fixed prose-headings:text-white" dangerouslySetInnerHTML={{ __html: service.content }} />
            </section>
          )}

          {/* Grid for Components and Included */}
          {(components.length > 0 || included.length > 0) && (
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {components.length > 0 && (
                <div className="bg-surface-container/50 p-8 rounded-3xl border border-outline-variant/20 hover:border-primary-fixed/30 transition-colors">
                  <h3 className="font-headline-md mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-fixed">extension</span>
                    Компоненти Системи
                  </h3>
                  <ul className="space-y-4">
                    {components.map((comp, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary-fixed mt-1 text-sm">subdirectory_arrow_right</span>
                        <span className="text-on-surface-variant">
                          {typeof comp === 'string' ? comp : (
                            <><strong className="text-white">{comp.name}</strong>: {comp.desc}</>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {included.length > 0 && (
                <div className="bg-surface-container/50 p-8 rounded-3xl border border-outline-variant/20 hover:border-primary-fixed/30 transition-colors">
                  <h3 className="font-headline-md mb-6 flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary-fixed">check_circle</span>
                    Що Включено у Вартість
                  </h3>
                  <ul className="space-y-4">
                    {included.map((inc, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="material-symbols-outlined text-secondary-fixed mt-1 text-sm">done</span>
                        <span className="text-on-surface-variant">
                          {typeof inc === 'string' ? inc : (
                            <><strong className="text-white">{inc.name}</strong>: {inc.desc}</>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          )}

          {/* Advantages Section */}
          {advantages.length > 0 && (
            <section>
              <h2 className="font-headline-lg mb-8">Чому Обирають Нас</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {advantages.map((adv, idx) => (
                  <div key={idx} className="group bg-surface-container hover:bg-surface-container-high transition-colors rounded-2xl p-6 border border-outline-variant/20 flex items-start gap-4">
                    <div className="p-3 bg-background rounded-xl border border-outline-variant/10 group-hover:border-primary-fixed/30 transition-colors">
                      <span className="material-symbols-outlined text-primary-fixed">verified</span>
                    </div>
                    <p className="text-on-surface-variant mt-2">{adv}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Sidebar Alignment */}
        <div className="lg:col-span-4 hidden lg:block">
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-12 md:py-16 px-4 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="relative overflow-hidden bg-surface-container rounded-3xl p-6 md:p-16 border border-outline-variant/20 text-center max-w-4xl mx-auto">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary-fixed to-transparent opacity-50" />
          <h2 className="font-headline-lg text-on-background mb-6">Готові розпочати проект?</h2>
          <p className="text-on-surface-variant mb-10 text-xl max-w-2xl mx-auto">Залиште заявку на безкоштовну консультацію, і ми підберемо найкраще рішення для вашого об'єкту.</p>
          <ContactButton className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed font-label-lg px-8 py-4 rounded-xl hover:opacity-90 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-fixed/20">
            <span>Зв'язатися з нами</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </ContactButton>
        </div>
      </section>
    </main>
  );
}
