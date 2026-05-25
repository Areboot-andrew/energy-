import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, PlayCircle } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline-lg text-white mb-2">Мої проєкти</h1>
        <p className="text-secondary-fixed-dim">Відслідковуйте статус виконання ваших замовлень.</p>
      </div>

      {projects.length === 0 ? (
        <div className="bg-surface-container rounded-2xl p-12 text-center border border-outline-variant/20">
          <h2 className="text-xl font-bold text-white mb-4">У вас поки немає активних проєктів</h2>
          <p className="text-secondary-fixed-dim max-w-md mx-auto">
            Ваші проєкти з'являться тут після того, як адміністратор опрацює вашу заявку та призначить проєкт.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Link 
              key={project.id} 
              href={`/dashboard/project/${project.id}`}
              className="bg-surface-container rounded-2xl border border-outline-variant/20 p-6 hover:border-primary-fixed/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/5 rounded-full blur-2xl group-hover:bg-primary-fixed/10 transition-all"></div>
              
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-white">{project.title}</h3>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                  project.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                  project.status === 'PAUSED' ? 'bg-error/10 text-error border-error/20' : 
                  'bg-primary-fixed/10 text-primary-fixed border-primary-fixed/20'
                }`}>
                  {project.status === 'COMPLETED' ? 'Завершено' : 
                   project.status === 'PAUSED' ? 'Пауза' : 'В роботі'}
                </span>
              </div>
              
              <p className="text-secondary-fixed-dim text-sm mb-6 line-clamp-2">
                {project.description || "Без опису"}
              </p>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-secondary-fixed-dim">
                  <Clock size={16} />
                  Створено: {new Date(project.createdAt).toLocaleDateString('uk-UA')}
                </div>
                
                <div className="flex items-center gap-2 text-primary-fixed font-bold group-hover:translate-x-1 transition-transform">
                  Відкрити <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
