import React, { useState, useRef } from 'react';
import { Printer, Download, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ModalPortal from './ModalPortal';

export default function PrintModal({
  isOpen,
  onClose,
  title = 'Print Document',
  children,
  defaultShowLetterhead = true,
  documentType = 'report' // 'report' or 'bill'
}) {
  const [showLetterhead, setShowLetterhead] = useState(defaultShowLetterhead);
  const [downloading, setDownloading] = useState(false);
  const printContentRef = useRef(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printContentRef.current) return;
    try {
      setDownloading(true);
      const element = printContentRef.current;

      // Ensure all web fonts and DOM subtrees are fully loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));

      const scrollW = element.scrollWidth || 794;
      const scrollH = element.scrollHeight || 1123;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: scrollW,
        height: scrollH,
        windowWidth: scrollW,
        windowHeight: scrollH,
        x: 0,
        y: 0,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc, clonedElement) => {
          clonedElement.style.width = '210mm';
          clonedElement.style.minHeight = '297mm';
          clonedElement.style.height = 'auto';
          clonedElement.style.overflow = 'visible';
          clonedElement.style.maxHeight = 'none';
          clonedElement.style.transform = 'none';

          let parent = clonedElement.parentElement;
          while (parent && parent !== clonedDoc.body) {
            parent.style.overflow = 'visible';
            parent.style.maxHeight = 'none';
            parent.style.height = 'auto';
            parent.style.transform = 'none';
            parent = parent.parentElement;
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const a4Width = 210;
      const a4Height = 297;
      const calculatedHeight = (canvas.height * a4Width) / canvas.width;

      if (calculatedHeight <= a4Height + 5) {
        // Fits neatly onto single A4 page - preserve natural 1:1 aspect ratio
        const renderHeight = Math.min(calculatedHeight, a4Height);
        pdf.addImage(imgData, 'PNG', 0, 0, a4Width, renderHeight);
      } else {
        // Multiple pages document
        let heightLeft = calculatedHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, a4Width, calculatedHeight);
        heightLeft -= a4Height;

        while (heightLeft > 5) {
          position -= a4Height;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, a4Width, calculatedHeight);
          heightLeft -= a4Height;
        }
      }

      pdf.save(`${documentType}_${Date.now()}.pdf`);
    } catch (err) {
      console.error('Error exporting PDF:', err);
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-3 sm:p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[95vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">

          {/* Modal Header */}
          <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center space-x-2.5">
              <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">{title}</span>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/40 px-2 py-0.5 rounded-full font-mono font-semibold">
                A4
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Stationery header toggle */}
              <button
                onClick={() => setShowLetterhead(!showLetterhead)}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-medium transition ${showLetterhead
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                  }`}
                title="Toggle clinic header for printing on pre-printed stationery"
              >
                <span>Letterhead:</span>
                <strong className="uppercase">{showLetterhead ? 'ON' : 'OFF'}</strong>
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-xs transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              {/* Download PDF Button */}
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex items-center space-x-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{downloading ? 'Exporting...' : 'PDF'}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Document Preview Body - Paper preview retains white backdrop */}
          <div className="p-3 sm:p-6 overflow-auto flex justify-center bg-slate-100/90 dark:bg-slate-950 flex-1 min-h-0">
            <div
              ref={printContentRef}
              className="print-wrapper bg-white text-slate-900 shadow-2xl rounded-sm shrink-0 my-2"
              style={{ width: '210mm' }}
            >
              {typeof children === 'function' ? children(showLetterhead) : children}
            </div>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
}
