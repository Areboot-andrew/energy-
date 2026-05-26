"use client";

import { useEffect, useState, useRef } from "react";
import { ArrowLeft, Download, FileText, CheckCircle2, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import AdminLayout from "@/components/layout/AdminLayout";

import { useRouter } from "next/navigation";

export default function AdminQuoteDetailsPage({ params }: { params: { id: string, quoteId: string } }) {
  const router = useRouter();
  const [quote, setQuote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    fetch(`/api/quotes/${params.quoteId}`)
      .then(res => res.json())
      .then(data => {
        setQuote(data);
        setLoading(false);
      });
  }, [params.quoteId]);

  const handleDelete = async () => {
    if (!confirm("Ви впевнені, що хочете видалити цей кошторис? Цю дію неможливо скасувати.")) return;
    
    try {
      const res = await fetch(`/api/quotes/${params.quoteId}`, { method: 'DELETE' });
      if (res.ok) {
        router.push(`/admin/projects/${params.id}`);
      } else {
        alert("Помилка при видаленні кошторису");
      }
    } catch (e) {
      alert("Помилка сервера");
    }
  };

  const getBase64ImageFromUrl = async (imageUrl: string) => {
    try {
      const url = imageUrl.startsWith('/') ? window.location.origin + imageUrl : imageUrl;
      return new Promise<string>((resolve) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(null as any);
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL("image/jpeg", 0.8)); // Force JPEG for pdfmake compatibility
        };
        img.onerror = () => {
          console.error("Failed to load image");
          resolve(null as any);
        };
        img.src = url;
      });
    } catch (e) {
      console.error("Failed to load image for PDF:", e);
      return null;
    }
  };

  const handleDownloadPDF = async () => {
    if (generatingPDF) return;
    setGeneratingPDF(true);

    try {
      // Pre-load images
      const groupsWithImages = await Promise.all(quote.groups.map(async (group: any) => {
        const itemsWithImages = await Promise.all(group.items.map(async (item: any) => {
          let base64Photo = null;
          if (item.photoUrl) {
            base64Photo = await getBase64ImageFromUrl(item.photoUrl);
          }
          return { ...item, base64Photo };
        }));
        return { ...group, items: itemsWithImages };
      }));
      // Dynamically import pdfmake to avoid SSR issues
      const pdfMakeModule: any = await import("pdfmake/build/pdfmake");
      const pdfFonts: any = await import("pdfmake/build/vfs_fonts");
      const pdfMake = pdfMakeModule.default || pdfMakeModule;
      
      let vfs = null;
      if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) vfs = pdfFonts.pdfMake.vfs;
      else if (pdfFonts && pdfFonts.default && pdfFonts.default.pdfMake && pdfFonts.default.pdfMake.vfs) vfs = pdfFonts.default.pdfMake.vfs;
      else if (pdfFonts && pdfFonts.vfs) vfs = pdfFonts.vfs;
      else if (typeof window !== 'undefined' && (window as any).pdfMake && (window as any).pdfMake.vfs) vfs = (window as any).pdfMake.vfs;
      else if (pdfFonts) vfs = pdfFonts; // fallback if it exports the vfs directly
      
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
          ...groupsWithImages.map((group: any) => {
            const groupTotal = group.items.reduce((sum: number, item: any) => sum + item.total, 0);
            return [
              {
                columns: [
                  { text: group.title, style: 'groupTitle' },
                  { text: `${groupTotal.toLocaleString()} грн`, style: 'groupTotal', alignment: 'right' }
                ],
                margin: [0, 15, 0, 5]
              },
              {
                table: {
                  headerRows: 1,
                  widths: ['auto', '*', 'auto', 'auto', 'auto', 'auto'],
                  body: [
                    // Table Header
                    [
                      { text: '№', style: 'tableHeader', alignment: 'center' },
                      { text: 'Найменування', style: 'tableHeader' },
                      { text: 'Фото', style: 'tableHeader', alignment: 'center' },
                      { text: 'Кіл-ть', style: 'tableHeader', alignment: 'center' },
                      { text: 'Ціна (грн)', style: 'tableHeader', alignment: 'right' },
                      { text: 'Сума (грн)', style: 'tableHeader', alignment: 'right' }
                    ],
                    // Table Body
                    ...group.items.map((item: any, idx: number) => [
                      { text: (idx + 1).toString(), alignment: 'center', margin: [0, 10, 0, 10] },
                      { 
                        text: item.description 
                          ? [ { text: item.name + '\n' }, { text: item.description, fontSize: 8, color: '#6B7280', italics: true } ]
                          : item.name, 
                        margin: [0, 10, 0, 10] 
                      },
                      item.base64Photo 
                        ? { image: item.base64Photo, width: 35, height: 35, alignment: 'center', margin: [0, 2, 0, 2] } 
                        : { text: '-', alignment: 'center', margin: [0, 10, 0, 10], color: '#9CA3AF' },
                      { text: `${item.quantity} ${item.unit}`, alignment: 'center', margin: [0, 10, 0, 10] },
                      { text: item.price.toLocaleString(), alignment: 'right', margin: [0, 10, 0, 10] },
                      { text: item.total.toLocaleString(), alignment: 'right', bold: true, margin: [0, 10, 0, 10] }
                    ])
                  ]
                },
                layout: {
                  hLineWidth: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? 2 : 1,
                  vLineWidth: (i: number, node: any) => (i === 0 || i === node.table.widths.length) ? 2 : 1,
                  hLineColor: (i: number, node: any) => (i === 0 || i === node.table.body.length) ? '#000000' : '#D1D5DB',
                  vLineColor: (i: number, node: any) => (i === 0 || i === node.table.widths.length) ? '#000000' : '#D1D5DB',
                  fillColor: (rowIndex: number) => (rowIndex === 0) ? '#E5E7EB' : (rowIndex % 2 === 0 ? '#F9FAFB' : null),
                  paddingTop: () => 5,
                  paddingBottom: () => 5,
                  paddingLeft: () => 8,
                  paddingRight: () => 8,
                },
                margin: [0, 0, 0, 20]
              }
            ];
          }),
          
          // Grand Total and Signatures
          {
            columns: [
              {
                stack: [
                  { text: 'Підписи сторін:', style: 'signaturesHeader', margin: [0, 0, 0, 20] },
                  { text: '________________________', margin: [0, 0, 0, 5] },
                  { text: 'Виконавець (VOLT PREMIUM)', style: 'signatureLabel' }
                ],
                margin: [0, 30, 0, 0]
              },
              {
                stack: [
                  { text: '________________________', margin: [0, 34, 0, 5] },
                  { text: `Замовник (${quote.project.user.name})`, style: 'signatureLabel' }
                ],
                margin: [0, 30, 0, 0],
                alignment: 'center'
              },
              {
                stack: [
                  { text: 'ЗАГАЛЬНА ВАРТІСТЬ:', style: 'grandTotalLabel', margin: [0, 0, 0, 5] },
                  { text: `${quote.totalAmount.toLocaleString()} грн`, style: 'grandTotalValue' }
                ],
                alignment: 'right',
                margin: [0, 30, 0, 0]
              }
            ]
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
          grandTotalValue: { fontSize: 24, bold: true, color: '#1d4ed8' },
          signaturesHeader: { fontSize: 12, bold: true, color: '#6B7280', uppercase: true },
          signatureLabel: { fontSize: 10, color: '#6B7280' }
        },
        defaultStyle: {
          fontSize: 10,
          color: '#111827'
        }
      };

      pdfMake.createPdf(docDefinition).download(`Кошторис_${quote.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error: any) {
      console.error("PDF generation error:", error);
      alert("Не вдалося згенерувати PDF через помилку браузера (або зображення). Використовуємо системне збереження PDF...");
      // Fallback to beautiful native print
      setTimeout(() => {
        window.print();
      }, 500);
    } finally {
      setGeneratingPDF(false);
    }
  };

  if (loading) return <AdminLayout><div className="text-white p-10">Завантаження кошторису...</div></AdminLayout>;
  if (!quote || quote.error) return <AdminLayout><div className="text-error p-10">Помилка завантаження.</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6 pb-20">
        <div className="print:hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Link href={`/admin/projects/${params.id}`} className="inline-flex items-center gap-2 text-secondary-fixed-dim hover:text-white transition-colors mb-4 text-sm font-bold uppercase tracking-widest">
              <ArrowLeft size={16} /> Назад до проєкту
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">{quote.title}</h1>
            <p className="text-secondary-fixed-dim">Проєкт: {quote.project.title}</p>
          </div>

          <div className="flex gap-2">
            <Link 
              href={`/admin/projects/${params.id}/quotes/${quote.id}/edit`}
              className="bg-surface-container-highest text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm hover:bg-white/10 transition-all flex items-center gap-2"
            >
              <Edit size={18} /> Редагувати
            </Link>
            <button 
              onClick={handleDownloadPDF}
              disabled={generatingPDF}
              className={`${generatingPDF ? 'bg-gray-500 cursor-not-allowed' : 'bg-primary-fixed hover:shadow-[0_0_20px_rgba(213,240,0,0.3)]'} text-on-primary-fixed px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2`}
            >
              <Download size={18} /> {generatingPDF ? "Генерація..." : "PDF"}
            </button>
            <button 
              onClick={handleDelete}
              className="bg-error/10 text-error hover:bg-error hover:text-white px-4 py-3 rounded-xl transition-all flex items-center justify-center"
              title="Видалити кошторис"
            >
              <Trash2 size={18} />
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
                    <span>{groupTotal.toLocaleString()} грн</span>
                  </div>
                  <table className="w-full mt-4 text-sm text-left border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-200 border-b-2 border-gray-400 text-gray-700 uppercase tracking-widest text-xs">
                        <th className="py-3 px-3 w-[5%] border border-gray-300">№</th>
                        <th className="py-3 px-3 w-[40%] border border-gray-300">Найменування</th>
                        <th className="py-3 px-3 w-[15%] border border-gray-300 bg-gray-100/50">Кіл-ть</th>
                        <th className="py-3 px-3 w-[20%] text-right border border-gray-300 bg-gray-100/50">Ціна (грн)</th>
                        <th className="py-3 px-3 w-[20%] text-right border border-gray-300 bg-blue-50/50">Сума (грн)</th>
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
              <p className="text-5xl font-black text-blue-900">{quote.totalAmount.toLocaleString()} <span className="text-2xl">грн</span></p>
            </div>
          </div>

          {/* History Log */}
          {quote.history && quote.history.length > 0 && (
            <div id="history-log" className="mt-16 pt-8 border-t border-gray-300 break-inside-avoid print:hidden" style={{ '@media print': { display: 'none !important' } } as any}>
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
    </AdminLayout>
  );
}
