"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Download, FileText, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuoteDetailsPage({ params }: { params: { id: string } }) {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/quotes/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setQuote(data);
        setLoading(false);
      });
  }, [params.id]);

  const handleDownloadPDF = async () => {
    if (generatingPDF) return;
    setGeneratingPDF(true);
    
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = pdfRef.current;
      
      const opt = {
        margin:       10,
        filename:     `Кошторис_${quote.title.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true, allowTaint: true, logging: false },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error("PDF generation error:", error);
      alert("Виникла помилка при генерації PDF. Можливо, деякі зображення не вдалося завантажити.");
    } finally {
      setGeneratingPDF(false);
      // Remove any leftover html2canvas iframes that block interactions
      const iframes = document.querySelectorAll('iframe.html2canvas-container');
      iframes.forEach(iframe => iframe.remove());
    }
  };

  const handleStatusChange = async (status: string, details: string) => {
    setUpdating(true);
    await fetch(`/api/quotes/${quote.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, actionDetails: details })
    });
    
    // Refresh
    const res = await fetch(`/api/quotes/${quote.id}`);
    const data = await res.json();
    setQuote(data);
    setUpdating(false);
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

        <div className="flex gap-2">
          {quote.status !== "APPROVED" && quote.status !== "REJECTED" && (
            <>
              <button 
                onClick={() => handleStatusChange("APPROVED", "Клієнт погодив кошторис")}
                disabled={updating}
                className="bg-green-600/20 text-green-500 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-green-600 hover:text-white transition-all flex items-center gap-2"
              >
                <CheckCircle2 size={18} /> Погодити
              </button>
              <button 
                onClick={() => handleStatusChange("REJECTED", "Клієнт відхилив кошторис")}
                disabled={updating}
                className="bg-red-600/20 text-red-500 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-red-600 hover:text-white transition-all flex items-center gap-2"
              >
                <XCircle size={18} /> Відхилити
              </button>
            </>
          )}
          <button 
            onClick={handleDownloadPDF}
            disabled={generatingPDF}
            className={`${generatingPDF ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-fixed hover:shadow-[0_0_20px_rgba(213,240,0,0.3)]'} text-on-primary-fixed px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2`}
          >
            <Download size={18} /> {generatingPDF ? "Генерація..." : "Завантажити PDF"}
          </button>
        </div>
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
                <table className="w-full mt-4 text-sm text-left border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 border-b-2 border-gray-400 text-gray-700 uppercase tracking-widest text-xs">
                      <th className="py-3 px-3 w-[5%] border border-gray-300">№</th>
                      <th className="py-3 px-3 w-[40%] border border-gray-300">Найменування</th>
                      <th className="py-3 px-3 w-[15%] border border-gray-300 bg-gray-100/50">Кіл-ть</th>
                      <th className="py-3 px-3 w-[20%] text-right border border-gray-300 bg-gray-100/50">Ціна (₴)</th>
                      <th className="py-3 px-3 w-[20%] text-right border border-gray-300 bg-blue-50/50">Сума (₴)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {group.items.map((item: any, idx: number) => (
                      <tr key={item.id} className="break-inside-avoid even:bg-gray-50 odd:bg-white hover:bg-yellow-50 transition-colors">
                        <td className="py-3 px-3 border border-gray-300 text-gray-500 font-bold text-center">{idx + 1}</td>
                        <td className="py-3 px-3 border border-gray-300">
                          <div className="font-bold text-gray-800">{item.name}</div>
                          {item.description && <div className="text-xs text-gray-500 italic mt-1">{item.description}</div>}
                          {item.photoUrl && (
                            <div className="mt-2 w-16 h-16 border border-gray-300 rounded overflow-hidden">
                              <img src={item.photoUrl} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3 border border-gray-300 bg-gray-50 text-gray-700">{item.quantity} <span className="text-xs text-gray-400">{item.unit}</span></td>
                        <td className="py-3 px-3 text-right border border-gray-300 bg-gray-50 text-gray-700">{item.price.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right font-black border border-gray-300 bg-blue-50/30 text-gray-900">{item.total.toLocaleString()}</td>
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
          
          <div className="text-right bg-blue-50 p-6 border-2 border-blue-200 rounded-xl">
            <p className="text-blue-600 font-black uppercase tracking-widest text-sm mb-1">ЗАГАЛЬНА ВАРТІСТЬ:</p>
            <p className="text-5xl font-black text-blue-900">{quote.totalAmount.toLocaleString()} <span className="text-2xl">₴</span></p>
          </div>
        </div>

        {/* History Log */}
        {quote.history && quote.history.length > 0 && (
          <div className="mt-16 pt-8 border-t border-gray-300 break-inside-avoid">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText size={18} /> Історія змін кошторису
            </h3>
            <div className="space-y-3">
              {quote.history.map((h: any) => (
                <div key={h.id} className="flex gap-4 text-sm bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <div className="text-gray-400 font-mono whitespace-nowrap">
                    {new Date(h.createdAt).toLocaleString('uk-UA', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 mr-2">
                      {h.action === 'CREATED' ? 'Створено' : 
                       h.action === 'EDITED' ? 'Відредаговано' : 
                       h.action === 'STATUS_CHANGED' ? 'Зміна статусу' : h.action}
                    </span>
                    <span className="text-gray-600">{h.details}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
