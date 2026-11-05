import React, { useState, useRef, useEffect } from 'react';
import {
  Printer,
  Download,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ModalPortal from './ModalPortal';

export default function PrintModal({
  isOpen,
  onClose,
  title = 'Print Document',
  children,
  defaultShowLetterhead = true,
  documentType = 'report', // 'report' or 'bill'
  reportNumber = ''
}) {
  const [showLetterhead, setShowLetterhead] = useState(defaultShowLetterhead);
  const [downloading, setDownloading] = useState(false);
  const [zoom, setZoom] = useState(0.95);
  const [copySuccess, setCopySuccess] = useState(false);
  const printContentRef = useRef(null);

  // Auto-fit initial zoom depending on screen width
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const w = window.innerWidth;
      if (w < 640) setZoom(0.45);
      else if (w < 1024) setZoom(0.7);
      else if (w < 1440) setZoom(0.9);
      else setZoom(1.0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.4));
  const handleResetZoom = () => setZoom(1.0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = async () => {
    if (!printContentRef.current) return;
    try {
      setDownloading(true);
      const element = printContentRef.current;

      // Reset scroll position before capture
      if (typeof window !== 'undefined') {
        window.scrollTo(0, 0);
      }

      // Ensure all web fonts and styles are loaded
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      await new Promise((resolve) => setTimeout(resolve, 150));

      const pageElements = element.querySelectorAll('.a4-page');
      const pagesToCapture = pageElements && pageElements.length > 0 ? Array.from(pageElements) : [element];

      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const a4Width = 210;
      const a4Height = 297;

      for (let i = 0; i < pagesToCapture.length; i++) {
        const pageEl = pagesToCapture[i];
        if (i > 0) {
          pdf.addPage();
        }

        const canvas = await html2canvas(pageEl, {
          scale: 2, // High resolution (192 DPI)
          useCORS: true,
          allowTaint: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          height: 1123,
          windowWidth: 794,
          windowHeight: 1123,
          scrollX: 0,
          scrollY: 0,
          onclone: (clonedDoc, clonedElement) => {
            clonedElement.style.width = '210mm';
            clonedElement.style.height = '297mm';
            clonedElement.style.minHeight = '297mm';
            clonedElement.style.maxHeight = '297mm';
            clonedElement.style.overflow = 'hidden';
            clonedElement.style.boxSizing = 'border-box';
            clonedElement.style.transform = 'none';
            clonedElement.style.margin = '0 auto';
            clonedElement.style.boxShadow = 'none';

            let parent = clonedElement.parentElement;
            while (parent && parent !== clonedDoc.body) {
              parent.style.overflow = 'visible';
              parent.style.maxHeight = 'none';
              parent.style.height = 'auto';
              parent.style.transform = 'none';
              parent = parent.parentElement;
            }

            // Inject baseline normalization styles to neutralize html2canvas font shift
            const style = clonedDoc.createElement('style');
            style.innerHTML = `
              * {
                box-sizing: border-box !important;
              }
              body, .a4-page, .print-wrapper, table, td, th, div, span, p {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
                -webkit-font-smoothing: antialiased !important;
              }
              img {
                display: inline-block !important;
                vertical-align: middle !important;
              }
              table {
                border-collapse: collapse !important;
              }
              /* Eliminate unnecessary top margin & baseline offsets in canvas */
              th, td {
                line-height: 1.25 !important;
                vertical-align: middle !important;
              }
              p, span, div, h1, h2, h3, h4 {
                line-height: 1.25 !important;
              }
            `;
            clonedDoc.head.appendChild(style);

            // Copy fonts from main document to cloned iframe document
            if (document.fonts && clonedDoc.fonts) {
              document.fonts.forEach((font) => {
                try {
                  clonedDoc.fonts.add(font);
                } catch (e) {}
              });
            }
          }
        });

        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 0, 0, a4Width, a4Height, undefined, 'FAST');
      }

      const filename = reportNumber ? `${reportNumber}.pdf` : `${documentType}_${Date.now()}.pdf`;
      pdf.save(filename);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    } catch (err) {
      console.error('Error generating PDF:', err);
      // Seamless fallback to browser vector print dialog
      window.print();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ModalPortal isOpen={isOpen} onClose={onClose}>
      {/* Native Browser Print Styles for Pixel-Perfect 100% Vector Output */}
      <style>{`
        @media print {
          body * {
            visibility: hidden !important;
          }
          .print-wrapper, .print-wrapper * {
            visibility: visible !important;
          }
          .print-wrapper {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            transform: none !important;
            background: white !important;
          }
          .a4-page {
            width: 210mm !important;
            height: 297mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            margin: 0 !important;
            padding-left: 14mm !important;
            padding-right: 14mm !important;
            box-shadow: none !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .a4-page:last-child {
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .no-print {
            display: none !important;
          }
          @page {
            size: A4 portrait;
            margin: 0;
          }
        }
      `}</style>

      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-print"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 my-auto">
          
          {/* Top Control Bar */}
          <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 select-none">
            
            {/* Title & Document Badge */}
            <div className="flex items-center space-x-2.5">
              <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-md">
                {title}
              </span>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 px-2 py-0.5 rounded font-mono font-bold">
                A4 (210×297mm)
              </span>
            </div>

            {/* Action & Zoom Controls */}
            <div className="flex items-center flex-wrap gap-2">
              
              {/* Zoom Controls */}
              <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs">
                <button
                  onClick={handleZoomOut}
                  title="Zoom Out"
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="Reset to 100%"
                  className="px-2 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  onClick={handleZoomIn}
                  title="Zoom In"
                  className="p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Stationery Letterhead Toggle */}
              <button
                onClick={() => setShowLetterhead(!showLetterhead)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
                  showLetterhead
                    ? 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700'
                }`}
                title="Toggle Letterhead banner for printing on physical pre-printed stationery"
              >
                <span>Letterhead:</span>
                <strong className="uppercase">{showLetterhead ? 'ON' : 'OFF'}</strong>
              </button>

              {/* Native Vector Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition"
                title="Print or Save as PDF using your browser's native print engine"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              {/* High-Resolution Export PDF Button */}
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-50"
                title="Download pixel-perfect diagnostic PDF report"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    <span>Downloaded!</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>{downloading ? 'Rendering PDF...' : 'Export PDF'}</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ml-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Modal Document Preview Body */}
          <div className="p-3 sm:p-6 overflow-auto flex justify-center bg-slate-200/80 dark:bg-slate-950 flex-1 min-h-0">
            <div
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out'
              }}
              className="shrink-0 my-2"
            >
              <div
                ref={printContentRef}
                className="print-wrapper flex flex-col gap-6 items-center"
                style={{
                  width: '210mm',
                  boxSizing: 'border-box'
                }}
              >
                {typeof children === 'function' ? children(showLetterhead) : children}
              </div>
            </div>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
}
