"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Download, FileText, CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuoteDetailsPage({ params }: { params: { id: string } }) {
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
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
    try {
      // Dynamically import pdfmake to avoid SSR issues
      const pdfMakeModule = await import("pdfmake/build/pdfmake");
      const pdfFonts = await import("pdfmake/build/vfs_fonts");
      const pdfMake = pdfMakeModule.default || pdfMakeModule;
      // Handle different module resolutions
      const vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : (pdfFonts.default ? pdfFonts.default.pdfMake.vfs : pdfFonts);
      pdfMake.vfs = vfs;

      const docDefinition: any = {
        pageSize: 'A4',
        pageMargins: [40, 60, 40, 60],
        content: [
          // Header section
          {
            columns: [
              {
                text: [
                  { text: 'VOLT PREMIUM\n', style: 'brandTitle' },
                  { text: 'Офіційний Кошторис', style: 'brandSub' }
                ]
              },
              {
                text: [
                  { text: `Клієнт: ${quote.project.user.name}\n`, style: 'clientInfo' },
                  { text: `${quote.project.user.phone}\n`, style: 'clientInfo' },
                  { text: `Дата: ${new Date(quote.createdAt).toLocaleDateString('uk-UA')}\n`, style: 'clientInfo' },
                  { text: `Статус: ${quote.status === 'APPROVED' ? 'ПОГОДЖЕНО' : quote.status === 'REJECTED' ? 'ВІДХИЛЕНО' : 'В ОЧІКУВАННІ'}`, style: 'clientStatus' }
                ],
                alignment: 'right'
              }
            ],
            columnGap: 20,
            margin: [0, 0, 0, 30]
          },
          // Document Title
          { text: quote.title, style: 'docTitle' },
          { text: `Об'єкт: ${quote.project.title}`, style: 'docSubTitle', margin: [0, 0, 0, 20] },
          
          // Groups
          ...quote.groups.map((group: any) => {
            const groupTotal = group.items.reduce((sum: number, item: any) => sum + item.total, 0);
            return [
              {
                columns: [
                  { text: group.title, style: 'groupTitle' },
                  { text: `${groupTotal.toLocaleString()} ₴`, style: 'groupTotal', alignment: 'right' }
                ],
                margin: [0, 15, 0, 5]
              },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', '*', 'auto', 'auto', 'auto'],
                  body: [
                    // Table Header
                    [
                      { text: '№', style: 'tableHeader', alignment: 'center' },
                      { text: 'Найменування', style: 'tableHeader' },
                      { text: 'Кіл-ть', style: 'tableHeader', alignment: 'center' },
                      { text: 'Ціна (₴)', style: 'tableHeader', alignment: 'right' },
                      { text: 'Сума (₴)', style: 'tableHeader', alignment: 'right' }
                    ],
                    // Table Body
                    ...group.items.map((item: any, idx: number) => [
                      { text: (idx + 1).toString(), alignment: 'center', margin: [0, 5, 0, 5] },
                      { text: item.description ? `${item.name}\n(${item.description})` : item.name, margin: [0, 5, 0, 5] },
                      { text: `${item.quantity} ${item.unit}`, alignment: 'center', margin: [0, 5, 0, 5] },
                      { text: item.price.toLocaleString(), alignment: 'right', margin: [0, 5, 0, 5] },
                      { text: item.total.toLocaleString(), alignment: 'right', bold: true, margin: [0, 5, 0, 5] }
                    ])
                  ]
                },
                layout: {
                  hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 2 : 1,
                  vLineWidth: () => 0,
                  hLineColor: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? '#000000' : '#E5E7EB',
                  fillColor: (rowIndex: number) => (rowIndex === 0) ? '#F3F4F6' : (rowIndex % 2 === 0 ? '#F9FAFB' : null)
                },
                margin: [0, 0, 0, 20]
              }
            ];
          }),
          
          // Grand Total
          {
            text: [
              { text: 'ЗАГАЛЬНА ВАРТІСТЬ: ', style: 'grandTotalLabel' },
              { text: `${quote.totalAmount.toLocaleString()} ₴`, style: 'grandTotalValue' }
            ],
            alignment: 'right',
            margin: [0, 30, 0, 0]
          }
        ],
        styles: {
          brandTitle: { fontSize: 20, bold: true, color: '#000000' },
          brandSub: { fontSize: 12, bold: true, color: '#6B7280' },
          clientInfo: { fontSize: 10, color: '#374151', lineHeight: 1.2 },
          clientStatus: { fontSize: 10, bold: true, color: '#111827', marginTop: 5 },
          docTitle: { fontSize: 18, bold: true, color: '#111827' },
          docSubTitle: { fontSize: 12, color: '#6B7280' },
          groupTitle: { fontSize: 14, bold: true, color: '#111827' },
          groupTotal: { fontSize: 14, bold: true, color: '#111827' },
          tableHeader: { bold: true, fontSize: 11, color: '#374151', margin: [0, 5, 0, 5] },
          grandTotalLabel: { fontSize: 14, bold: true, color: '#374151' },
          grandTotalValue: { fontSize: 24, bold: true, color: '#1d4ed8' }
        },
        defaultStyle: {
          fontSize: 10,
          color: '#111827'
        }
      };

      pdfMake.createPdf(docDefinition).download(`Кошторис_${quote.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error: any) {
      console.error("PDF generation error:", error);
      alert("Помилка генерації PDF: " + (error?.message || error?.toString()));
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
      <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
            className="bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:shadow-[0_0_20px_rgba(213,240,0,0.3)] transition-all flex items-center gap-2"
          >
            <Download size={18} /> Завантажити PDF
          </button>
        </div>
      </div>

      {/* This is the container that will be printed */}
      <div className="bg-white text-black p-8 md:p-12 rounded-2xl shadow-2xl mx-auto max-w-5xl print:shadow-none print:m-0 print:p-0 print:max-w-none w-full">
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
          <div className="mt-16 pt-8 border-t border-gray-300 break-inside-avoid print:hidden">
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
