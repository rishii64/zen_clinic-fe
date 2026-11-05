import React from 'react';

export default function ReportLetterhead({
  config,
  report,
  showLetterhead = true,
  currentPage = 1,
  totalPages = 1,
  children
}) {
  const clinic = {
    clinicName: config?.clinicName || 'RAJ JANCH GHAR',
    regNumber: config?.regNumber || 'Reg No - 430/2022',
    address: config?.address || 'MAIN ROAD NETAJI CHOWK SAHARGHAT',
    phone: config?.phone || '',
    email: config?.email || '',
    doctorDetails: {
      name: config?.doctorDetails?.name || 'Dr. R.K. MANDAL',
      qualifications: config?.doctorDetails?.qualifications || 'M.B.B.S',
      regNo: config?.doctorDetails?.regNo || '18840',
      designation: config?.doctorDetails?.designation || 'Consultant Pathologist & Medical Officer'
    },
    technicianDetails: {
      name: config?.technicianDetails?.name || 'Mr. R.K. Raut',
      qualifications: config?.technicianDetails?.qualifications || '(BMLT) Jaipur',
      designation: config?.technicianDetails?.designation || 'Chief Lab Technologist'
    },
    reportDisclaimers: config?.reportDisclaimers || [
      '1. Invalid for medico legal purpose',
      '2. Contain of this report is only an opinion not a diagnostic purpose'
    ],
    showWatermark: config?.showWatermark !== false,
    watermarkText: config?.watermarkText || 'SAHARGHAT'
  };

  const doctorInfo = {
    name: report?.doctor?.name || clinic.doctorDetails.name,
    qualifications: report?.doctor?.qualifications || clinic.doctorDetails.qualifications,
    regNo: report?.doctor?.regNo || clinic.doctorDetails.regNo,
    designation: report?.doctor?.designation || clinic.doctorDetails.designation
  };

  const techInfo = {
    name: report?.technician?.name || clinic.technicianDetails.name,
    qualifications: report?.technician?.qualifications || clinic.technicianDetails.qualifications,
    designation: report?.technician?.designation || clinic.technicianDetails.designation
  };

  const formatRegNo = (val) => {
    if (!val) return 'Reg No - 430/2022';
    const trimmed = String(val).trim();
    if (/^reg/i.test(trimmed)) return trimmed;
    return `Reg No - ${trimmed}`;
  };

  return (
    <div
      className="a4-page relative bg-white text-slate-900 font-sans shadow-lg mx-auto print-container flex flex-col justify-between"
      style={{
        width: '210mm',
        height: '297mm',
        minHeight: '297mm',
        maxHeight: '297mm',
        boxSizing: 'border-box',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP BANNER / HEADER (Authentic Blue & Green Curved Wave Banner matching paper letterhead) */}
      {showLetterhead ? (
        <header className="w-full shrink-0 relative overflow-hidden select-none" style={{ height: '148px' }}>
          {/* Authentic SVG Curved Wave Background */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 148"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="headerBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#254696" />
                <stop offset="60%" stopColor="#3154aa" />
                <stop offset="100%" stopColor="#233f8b" />
              </linearGradient>
              <linearGradient id="headerGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#15803d" />
                <stop offset="50%" stopColor="#16a34a" />
                <stop offset="100%" stopColor="#15803d" />
              </linearGradient>
            </defs>

            {/* Top Blue Wave Field */}
            <path
              d="M 0,0 L 1000,0 L 1000,88 Q 700,106 400,92 Q 180,82 0,74 Z"
              fill="url(#headerBlueGrad)"
            />

            {/* Purple Accent Ribbon Line */}
            <path
              d="M 0,74 Q 180,82 400,92 Q 700,106 1000,88 L 1000,94 Q 700,112 400,98 Q 180,88 0,80 Z"
              fill="#6b21a8"
              opacity="0.85"
            />

            {/* Bottom Vibrant Green Wave Field */}
            <path
              d="M 0,80 Q 180,88 400,98 Q 700,112 1000,94 L 1000,148 L 0,148 Z"
              fill="url(#headerGreenGrad)"
            />
          </svg>

          {/* Thin blue baseline stroke along bottom of green band */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#254696] z-10" />

          {/* Upper Blue Zone Content: Clinic Name, Address, Reg Badge, Emblem Logo */}
          <div className="relative z-10 px-8 pt-3" style={{ height: '78px' }}>
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="text-left align-top">
                    <h1 className="text-3xl font-black tracking-wider text-white uppercase drop-shadow-xs leading-none">
                      {clinic.clinicName}
                    </h1>
                    <p className="text-[11px] font-bold tracking-widest text-white uppercase mt-1 drop-shadow-xs leading-none">
                      {clinic.address}
                    </p>
                  </td>
                  <td className="text-right align-top w-[220px]">
                    <table className="inline-table border-collapse">
                      <tbody>
                        <tr>
                          <td className="align-middle pr-3">
                            <span className="inline-block bg-white text-rose-600 text-[11px] font-black px-2.5 py-0.5 rounded shadow-xs tracking-wide whitespace-nowrap leading-tight">
                              {formatRegNo(clinic.regNumber)}
                            </span>
                          </td>
                          <td className="align-middle">
                            <div className="w-12 h-12 rounded-lg bg-white p-1 shadow-md flex items-center justify-center border border-blue-200">
                              <svg viewBox="0 0 44 44" className="w-10 h-10">
                                <path d="M 6,14 C 14,4 30,4 38,14" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
                                <path d="M 12,18 C 18,10 28,10 34,18" fill="none" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
                                <text x="10" y="34" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="22" fill="#1e3a8a">R</text>
                                <text x="24" y="35" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="18" fill="#1e3a8a">j</text>
                              </svg>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Lower Green Wave Zone: Doctor (Left) & Technologist (Right) inside the Green Wave */}
          <div className="absolute bottom-2 left-0 right-0 z-10 px-8 text-white">
            <table className="w-full border-collapse">
              <tbody>
                <tr>
                  <td className="text-left align-bottom leading-tight">
                    <div className="text-[13px] font-black tracking-wide text-yellow-300 italic">
                      {doctorInfo.name}
                    </div>
                    <div className="text-[11px] font-bold text-white">
                      {doctorInfo.qualifications}
                    </div>
                    <div className="text-[10px] font-bold text-yellow-300">
                      Reg.No.: {doctorInfo.regNo}
                    </div>
                  </td>
                  <td className="text-right align-bottom leading-tight">
                    <div className="text-[13px] font-black tracking-wide text-yellow-300 italic">
                      {techInfo.name}
                    </div>
                    <div className="text-[11px] font-bold text-yellow-200 italic">
                      {techInfo.qualifications}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </header>
      ) : (
        /* Spacer reserved for physical pre-printed letterhead paper */
        <div className="w-full shrink-0 select-none" style={{ height: '140px' }} />
      )}

      {/* 2. MAIN BODY AREA (Microscope Watermark + Injected Report Content) */}
      <main className="flex-1 flex flex-col justify-between px-7 py-2 relative z-10 overflow-hidden">
        
        {/* Authentic Circular Microscope Watermark */}
        {showLetterhead && clinic.showWatermark && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none z-0">
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-[360px] h-[360px] rounded-full border-[6px] border-rose-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-rose-950 font-black text-xl tracking-widest uppercase mb-1">
                  ★ {clinic.clinicName} ★
                </div>
                {/* Microscope Vector Graphic */}
                <svg className="w-44 h-44 text-rose-950 my-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 18h8" />
                  <path d="M3 22h18" />
                  <path d="M14 22a7 7 0 1 0 0-14h-1" />
                  <path d="M9 14h2" />
                  <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                  <path d="M12 6V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" />
                </svg>
                <div className="text-rose-950 font-bold text-base tracking-widest uppercase mt-1">
                  ★ {clinic.watermarkText || 'SAHARGHAT'} ★
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Report Content (Patient Demographics, Test Investigation Table, Impression, Signatures) */}
        <div className="relative z-10 w-full flex-1 flex flex-col justify-between overflow-hidden">
          {children}
        </div>
      </main>

      {/* 3. FOOTER AREA (Integrated Ribbon Banner matching paper letterhead) */}
      {showLetterhead ? (
        <footer className="w-full shrink-0 select-none page-break-inside-avoid relative z-10">
          {/* Bottom Integrated Ribbon Banner with Soft Blue & Green Wave */}
          <div className="relative w-full overflow-hidden" style={{ height: '62px' }}>
            {/* Flowing soft blue & green wave background SVG */}
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 1000 48"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="footerBlueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#93c5fd" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#bfdbfe" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="footerGreenGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#15803d" />
                  <stop offset="60%" stopColor="#16a34a" />
                  <stop offset="100%" stopColor="#15803d" />
                </linearGradient>
              </defs>

              {/* Soft cyan/light blue background wave */}
              <path
                d="M 0,6 Q 250,0 500,8 T 1000,4 L 1000,48 L 0,48 Z"
                fill="url(#footerBlueGrad)"
              />

              {/* Bottom Green flowing wave ribbon */}
              <path
                d="M 0,26 Q 300,12 650,28 T 1000,20 L 1000,48 L 0,48 Z"
                fill="url(#footerGreenGrad)"
              />
            </svg>

            {/* Overlaid Content inside Footer Ribbon */}
            <div className="absolute inset-0 z-10 px-7 flex items-center">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="w-[33%] text-left align-middle leading-none">
                      <span className="inline-block bg-white border border-blue-600 rounded-full px-3 py-1 font-serif italic font-bold text-slate-800 text-[10px] tracking-wide whitespace-nowrap shadow-xs">
                        A Fully computerised Labaratory
                      </span>
                    </td>
                    <td className="w-[42%] text-center align-middle text-[9px] font-semibold text-slate-900 leading-tight">
                      <div>1. Invalid for medico legal purpose</div>
                      <div>2. Contain of this report is only an opinion not a diagnostic purpose</div>
                    </td>
                    <td className="w-[25%] text-right align-middle leading-tight">
                      {totalPages > 1 && (
                        <div className="text-[9px] font-mono text-slate-700 font-bold mb-0.5">
                          Page {currentPage} of {totalPages}
                        </div>
                      )}
                      <div className="font-serif italic text-slate-700 text-xs font-bold pr-1">
                        pathologist...
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </footer>
      ) : (
        /* Discreet footer when printing on pre-printed stationery paper */
        <footer className="w-full shrink-0 select-none page-break-inside-avoid relative z-10 px-7 pb-2" style={{ height: '60px' }}>
          <div className="flex justify-between items-center text-[10px] text-slate-600 pt-2 border-t border-slate-300">
            <span>{clinic.clinicName}</span>
            {totalPages > 1 && <span className="font-mono font-bold">Page {currentPage} of {totalPages}</span>}
            <span className="font-serif italic">pathologist...</span>
          </div>
        </footer>
      )}

    </div>
  );
}
