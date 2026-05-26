import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowRight, FileText, Download } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardQuotesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const quotes = await prisma.quote.findMany({
    where: { project: { userId: session.user.id } },
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline-lg text-white mb-2">Мої Кошториси</h1>
        <p className="text-secondary-fixed-dim">Перегляд та завантаження кошторисів по ваших проєктах.</p>
      </div>

      {quotes.length === 0 ? (
        <div className="bg-surface-container rounded-2xl p-12 text-center border border-outline-variant/20">
          <FileText className="mx-auto text-secondary-fixed-dim mb-4" size={48} />
          <h2 className="text-xl font-bold text-white mb-4">У вас поки немає кошторисів</h2>
          <p className="text-secondary-fixed-dim max-w-md mx-auto">
            Ваші кошториси з'являться тут після того, як адміністратор сформує їх для вашого проєкту.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quotes.map((quote) => (
            <div 
              key={quote.id} 
              className="bg-surface-container rounded-2xl border border-outline-variant/20 p-6 hover:border-primary-fixed/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] uppercase font-bold text-secondary-fixed-dim bg-background px-2 py-1 rounded border border-outline-variant/30">
                    {quote.status}
                  </span>
                  <span className="text-xs text-secondary-fixed-dim">
                    {new Date(quote.createdAt).toLocaleDateString('uk-UA')}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-1">{quote.title}</h3>
                <p className="text-sm text-secondary-fixed-dim mb-6">Проєкт: {quote.project.title}</p>
                
                <div className="text-3xl font-black text-white mb-8">
                  {quote.totalAmount.toLocaleString()} ₴
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Link 
                  href={`/dashboard/quotes/${quote.id}`}
                  className="flex-1 bg-primary-fixed/10 text-primary-fixed py-3 rounded-lg font-bold text-sm text-center hover:bg-primary-fixed hover:text-black transition-colors"
                >
                  Переглянути
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
