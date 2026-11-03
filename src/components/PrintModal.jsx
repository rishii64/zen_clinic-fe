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
      
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[#001D35]/40 backdrop-blur-sm p-4 overflow-y-auto"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="relative bg-white rounded-3xl shadow-m3-4 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-[#E0E2EC] my-auto">
          
          {/* Modal Top Bar (Material 3 Light Theme) */}
          <div className="px-6 py-3.5 bg-[#F8FAFD] border-b border-[#E0E2EC] flex items-center justify-between no-print">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-base text-[#1F1F1F]">{title}</span>
              <span className="text-xs bg-[#C2E7FF] text-[#001D35] px-2.5 py-0.5 rounded-full font-mono font-bold">
                A4 Format
              </span>
            </div>

            {/* Action Buttons in Material 3 Style */}
            <div className="flex items-center space-x-2.5">
              
              {/* Pre-printed stationery toggle */}
              <button
                onClick={() => setShowLetterhead(!showLetterhead)}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  showLetterhead
                    ? 'bg-[#E8F0FE] text-[#0B57D0] border border-[#A8C7FA]'
                    : 'bg-[#F0F4F9] text-[#74777F] border border-[#C4C7C5]'
                }`}
                title="Toggle clinic header for printing on pre-printed clinic letterhead paper"
              >
                <span>Letterhead Header:</span>
                <strong className="uppercase">{showLetterhead ? 'ON' : 'OFF'}</strong>
              </button>

              {/* Print Button */}
              <button
                onClick={handlePrint}
                className="flex items-center space-x-1.5 bg-[#0B57D0] hover:bg-[#0842A0] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm transition"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>

              {/* Download PDF Button */}
              <button
                onClick={handleDownloadPdf}
                disabled={downloading}
                className="flex items-center space-x-1.5 bg-[#CEEAD6] text-[#0D652D] hover:bg-[#A8DAB5] px-4 py-1.5 rounded-full text-xs font-bold transition disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>{downloading ? 'Exporting...' : 'Download PDF'}</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-1.5 text-[#444746] hover:text-[#1F1F1F] rounded-full hover:bg-[#E9EEF6] transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Document Preview Body */}
          <div className="p-6 overflow-y-auto flex justify-center bg-[#F0F4F9]">
            <div ref={printContentRef} className="print-wrapper bg-white shadow-m3-2 rounded-xl overflow-hidden">
              {typeof children === 'function' ? children(showLetterhead) : children}
            </div>
          </div>

        </div>
      </div>
    </ModalPortal>
  );
}
