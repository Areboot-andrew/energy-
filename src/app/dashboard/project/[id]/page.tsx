import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import ClientChat from "@/components/ui/ClientChat";

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const project = await prisma.project.findFirst({
    where: { 
      id: params.id,
      userId: session.user.id 
    },
    include: {
      quotes: true
    }
  });

  if (!project) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-secondary-fixed-dim hover:text-white transition-colors mb-6 text-sm font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Назад до проєктів
        </Link>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-3xl font-headline-lg text-white">{project.title}</h1>
          <span className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border self-start ${
            project.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
            project.status === 'PAUSED' ? 'bg-error/10 text-error border-error/20' : 
            'bg-primary-fixed/10 text-primary-fixed border-primary-fixed/20'
          }`}>
            {project.status === 'COMPLETED' ? 'Завершено' : 
             project.status === 'PAUSED' ? 'Пауза' : 'В роботі'}
          </span>
        </div>
        <p className="text-secondary-fixed-dim mt-4 max-w-3xl">
          {project.description || "Опис проєкту відсутній."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <ClientChat projectId={project.id} />
        </div>
        
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-surface-container border border-outline-variant/20 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              <FileText className="text-primary-fixed" size={20} />
              Кошториси та Документи
            </h3>
            
            {project.quotes.length === 0 ? (
              <p className="text-secondary-fixed-dim text-sm">Поки немає прикріплених кошторисів.</p>
            ) : (
              <div className="space-y-3">
                {project.quotes.map(quote => (
                  <Link 
                    key={quote.id} 
                    href={`/dashboard/quotes/${quote.id}`}
                    className="block p-4 rounded-xl border border-outline-variant/30 hover:border-primary-fixed/50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-white text-sm group-hover:text-primary-fixed transition-colors">{quote.title}</span>
                      <span className="text-[10px] uppercase font-bold text-secondary-fixed-dim bg-surface-container-high px-2 py-1 rounded">
                        {quote.status}
                      </span>
                    </div>
                    <div className="font-headline-sm text-white">
                      {quote.totalAmount.toLocaleString()} ₴
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-primary-fixed/5 border border-primary-fixed/20 rounded-2xl p-6">
             <h4 className="font-bold text-white mb-2 flex items-center gap-2">
               <CheckCircle2 className="text-primary-fixed" size={20} /> Важлива інформація
             </h4>
             <p className="text-secondary-fixed-dim text-sm">
               Всі питання щодо проєкту ви можете задавати в чаті. Адміністратор відповідає в робочий час з 9:00 до 18:00.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
