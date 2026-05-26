"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Download, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function QuoteDetailsPage({ params }: { params: { id: string } }) {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`/api/quotes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setQuote(data);
        setLoading(false);
      });
  }, [params.id]);

  const handleDownloadPDF = async () => {
    const html2pdf = (await import('html2pdf.js')).default;
    const element = pdfRef.current;
    
    const opt = {
      margin:       10,
      filename:     `Кошторис_${quote.title.replace(/\s+/g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  if (loading) return <div className="text-white p-10">Завантаження кошторису...</div>;
  if (!quote || quote.error) return <div className="text-error p-10">Помилка завантаження.</div>;

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Link href={`/dashboard/project/${quote.projectId}`} className="inline-flex items-center gap-2 text-secondary-fixed-dim hover:text-white transition-colors mb-4 text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} /> Назад до проєкту
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">{quote.title}</h1>
          <p className="text-secondary-fixed-dim">Проєкт: {quote.project.title}</p>
        </div>

        <button 
          onClick={handleDownloadPDF}
          className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(213,240,0,0.3)] transition-all flex items-center gap-2"
        >
          <Download size={18} /> Завантажити PDF
        </button>
      </div>

      {/* This is the container that will be converted to PDF */}
      <div ref={pdfRef} className="bg-white text-black p-8 md:p-12 rounded-2xl shadow-2xl mx-auto max-w-5xl">
        <div className="flex justify-between items-start mb-12 border-b-2 border-black pb-8">
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">VOLT PREMIUM</h2>
            <p className="text-gray-500 font-bold mt-1">Офіційний Кошторис</p>
          </div>
          <div className="text-right">
            <p className="font-bold">Клієнт: {quote.project.user.name}</p>
            <p className="text-sm text-gray-600">{quote.project.user.phone}</p>
            <p className="text-sm text-gray-600 mt-2">Дата: {new Date(quote.createdAt).toLocaleDateString('uk-UA')}</p>
            <p className="text-sm text-gray-600 font-bold mt-2 uppercase">Статус: {quote.status}</p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-bold mb-2">{quote.title}</h3>
          <p className="text-gray-600">Об'єкт: {quote.project.title}</p>
        </div>

        <div className="space-y-8">
          {quote.groups.map((group: any) => {
            const groupTotal = group.items.reduce((sum: number, item: any) => sum + item.total, 0);

            return (
              <div key={group.id} className="mb-8">
                <div className="bg-gray-100 p-3 flex justify-between items-center font-bold text-lg border-l-4 border-black">
                  <span>{group.title}</span>
                  <span>{groupTotal.toLocaleString()} ₴</span>
                </div>
                <table className="w-full mt-4 text-sm text-left">
                  <thead>
                    <tr className="border-b-2 border-gray-300 text-gray-600 uppercase tracking-widest text-xs">
                      <th className="py-2 w-[5%]">№</th>
                      <th className="py-2 w-[40%]">Найменування</th>
                      <th className="py-2 w-[15%]">Кіл-ть</th>
                      <th className="py-2 w-[20%] text-right">Ціна (₴)</th>
                      <th className="py-2 w-[20%] text-right">Сума (₴)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {group.items.map((item: any, idx: number) => (
                      <tr key={item.id} className="break-inside-avoid">
                        <td className="py-3 font-bold text-gray-400">{idx + 1}</td>
                        <td className="py-3">
                          <div className="font-bold">{item.name}</div>
                          {item.description && <div className="text-xs text-gray-500 italic mt-1">{item.description}</div>}
                          {item.photoUrl && (
                            <div className="mt-2 w-16 h-16 border border-gray-200 rounded overflow-hidden">
                              <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </td>
                        <td className="py-3">{item.quantity} {item.unit}</td>
                        <td className="py-3 text-right">{item.price.toLocaleString()}</td>
                        <td className="py-3 text-right font-bold">{item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

        <div className="mt-16 pt-8 border-t-2 border-black flex justify-between items-end break-inside-avoid">
          <div>
            <p className="font-bold text-gray-500 uppercase tracking-widest text-sm mb-2">Підписи сторін:</p>
            <div className="flex gap-16 mt-6">
              <div className="text-center">
                <div className="w-48 border-b border-black mb-2"></div>
                <span className="text-xs text-gray-500">Виконавець (VOLT PREMIUM)</span>
              </div>
              <div className="text-center">
                <div className="w-48 border-b border-black mb-2"></div>
                <span className="text-xs text-gray-500">Замовник ({quote.project.user.name})</span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-1">ЗАГАЛЬНА ВАРТІСТЬ:</p>
            <p className="text-5xl font-black">{quote.totalAmount.toLocaleString()} <span className="text-2xl">₴</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
