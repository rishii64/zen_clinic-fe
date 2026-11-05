import React from 'react';
import { LAB_PHOTOS_STRIP } from '../assets/letterheadAssets';

export default function ReportLetterhead({
  config,
  report,
  showLetterhead = true,
  children
}) {
  const clinic = config || {
    clinicName: 'RAJ JANCH GHAR',
    regNumber: 'Reg No - 430/2022',
    address: 'MAIN ROAD NETA JI CHOWK SAHARGHAT',
    doctorDetails: {
      name: 'Dr. R.K. MANDAL',
      qualifications: 'M.B.B.S',
      regNo: '18840'
    },
    technicianDetails: {
      name: 'Mr. R.K. Raut',
      qualifications: '(BMLT) Jaipur'
    },
    reportDisclaimers: [
      '1. Invalid for medico legal purpose',
      '2. Contain of this report is only an opinion not a diagnostic purpose'
    ]
  };

  const doctorInfo = (report && report.doctor) || clinic.doctorDetails || {};
  const techInfo = (report && report.technician) || clinic.technicianDetails || {};

  const formatRegNo = (val) => {
    if (!val) return 'Reg No - 430/2022';
    const trimmed = String(val).trim();
    if (/^reg/i.test(trimmed)) return trimmed;
    return `Reg No - ${trimmed}`;
  };

  return (
    <div
      className="relative bg-white text-slate-900 font-sans shadow-lg mx-auto print-container flex flex-col justify-between"
      style={{
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. TOP BANNER / HEADER (Authentic Blue & Green Curved Wave Banner matching paper letterhead) */}
      {showLetterhead && (
        <header className="w-full shrink-0 relative overflow-hidden select-none" style={{ height: '152px' }}>
          {/* Authentic SVG Curved Wave Background */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 152"
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
              d="M 0,0 L 1000,0 L 1000,90 Q 700,108 400,94 Q 180,84 0,76 Z"
              fill="url(#headerBlueGrad)"
            />

            {/* Purple Accent Ribbon Line */}
            <path
              d="M 0,76 Q 180,84 400,94 Q 700,108 1000,90 L 1000,96 Q 700,114 400,100 Q 180,90 0,82 Z"
              fill="#6b21a8"
              opacity="0.85"
            />

            {/* Bottom Vibrant Green Wave Field */}
            <path
              d="M 0,82 Q 180,90 400,100 Q 700,114 1000,96 L 1000,152 L 0,152 Z"
              fill="url(#headerGreenGrad)"
            />
          </svg>

          {/* Upper Blue Zone Content: Clinic Name, Address, Reg Badge, Emblem Logo */}
          <div className="relative z-10 px-8 pt-3.5 flex justify-between items-start" style={{ height: '82px' }}>
            <div>
              <h1 className="text-3xl font-black tracking-wider text-white uppercase drop-shadow-xs leading-tight">
                {clinic.clinicName || 'RAJ JANCH GHAR'}
              </h1>
              <p className="text-[11px] font-bold tracking-widest text-white uppercase mt-1 drop-shadow-xs">
                {clinic.address || 'MAIN ROAD NETA JI CHOWK SAHARGHAT'}
              </p>
            </div>

            {/* Right Side: Reg No Badge & Emblem Logo Box */}
            <div className="flex items-center space-x-3 pt-0.5">
              <div className="text-right">
                <span className="inline-block bg-white text-rose-600 text-[11px] font-black px-2.5 py-0.5 rounded shadow-xs tracking-wide whitespace-nowrap">
                  {formatRegNo(clinic.regNumber)}
                </span>
              </div>
              {/* Emblem Logo with Swooshes & Rj */}
              <div className="w-12 h-12 rounded-lg bg-white p-1 shadow-md flex items-center justify-center border border-blue-200">
                <svg viewBox="0 0 44 44" className="w-10 h-10">
                  <path d="M 6,14 C 14,4 30,4 38,14" fill="none" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M 12,18 C 18,10 28,10 34,18" fill="none" stroke="#1e3a8a" strokeWidth="1.5" strokeLinecap="round" />
                  <text x="10" y="34" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="22" fill="#1e3a8a">R</text>
                  <text x="24" y="35" fontFamily="serif" fontStyle="italic" fontWeight="bold" fontSize="18" fill="#1e3a8a">j</text>
                </svg>
              </div>
            </div>
          </div>

          {/* Lower Green Wave Zone: Doctor (Left) & Technologist (Right) inside the Green Wave */}
          <div className="absolute bottom-0 left-0 right-0 z-10 px-8 pb-2 flex justify-between items-end text-white" style={{ height: '70px' }}>
            {/* Left: Doctor Details */}
            <div className="leading-tight space-y-0.5">
              <div className="text-[14px] font-black tracking-wide text-yellow-300 italic drop-shadow-xs">
                {doctorInfo.name || 'Dr. R.K. MANDAL'}
              </div>
              <div className="text-[11px] font-bold text-white drop-shadow-xs">
                {doctorInfo.qualifications || 'M.B.B.S'}
              </div>
              <div className="text-[11px] font-bold text-yellow-300 drop-shadow-xs">
                Reg.No.: {doctorInfo.regNo || '18840'}
              </div>
            </div>

            {/* Right: Lab Technologist */}
            <div className="text-right leading-tight space-y-0.5">
              <div className="text-[14px] font-black tracking-wide text-yellow-300 italic drop-shadow-xs">
                {techInfo.name || 'Mr. R.K. Raut'}
              </div>
              <div className="text-[11px] font-bold text-white italic drop-shadow-xs">
                {techInfo.qualifications || '(BMLT) Jaipur'}
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 2. MAIN BODY AREA (Microscope Watermark + Injected Report Content + Doctor Signatures) */}
      <main className="flex-1 flex flex-col justify-between px-8 py-3 relative z-10">
        
        {/* Authentic Circular Microscope Watermark */}
        {clinic.showWatermark !== false && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none z-0">
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-[340px] h-[340px] rounded-full border-[6px] border-rose-950 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-rose-950 font-black text-xl tracking-widest uppercase mb-2">
                  ★ {clinic.clinicName || 'RAJ JANCH GHAR'} ★
                </div>
                {/* Microscope Vector Graphic */}
                <svg className="w-40 h-40 text-rose-950 my-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 18h8" />
                  <path d="M3 22h18" />
                  <path d="M14 22a7 7 0 1 0 0-14h-1" />
                  <path d="M9 14h2" />
                  <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                  <path d="M12 6V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" />
                </svg>
                <div className="text-rose-950 font-bold text-base tracking-widest uppercase mt-2">
                  ★ {clinic.watermarkText || (clinic.address ? 'SAHARGHAT' : 'DIAGNOSTICS')} ★
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Report Content (Patient Demographics, Test Investigation Table, Impression) */}
        <div className="relative z-10 w-full space-y-3">
          {children}
        </div>

        {/* Doctor & Technologist Signatures (Positioned directly above the footer lab photos) */}
        <div className="pt-6 pb-2 grid grid-cols-2 gap-8 text-center text-xs page-break-inside-avoid relative z-10">
          {/* Technologist on left */}
          <div>
            <div className="w-44 border-b border-slate-400 mx-auto pb-3 mb-1">
              <span className="font-serif italic font-bold text-slate-700 text-sm">Mr. R.K. Raut</span>
            </div>
            <strong className="block text-slate-900 font-bold">{techInfo.name || 'MR. RK RAUT'}</strong>
            <div className="text-[11px] text-slate-600 font-medium">{techInfo.qualifications || '(BMLT) Jaipur'}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Chief Lab Technologist</div>
          </div>

          {/* Doctor on right */}
          <div>
            <div className="w-44 border-b border-slate-400 mx-auto pb-3 mb-1">
              <span className="font-serif italic font-bold text-blue-900 text-sm">Dr. R.K. Mandal</span>
            </div>
            <strong className="block text-slate-900 font-bold">{doctorInfo.name || 'DR. RK MANDAL'}</strong>
            <div className="text-[11px] text-slate-600 font-medium">
              {doctorInfo.qualifications || 'M.B.B.S'} {doctorInfo.regNo ? `(Reg. No: ${doctorInfo.regNo})` : '(Reg. No: 18840)'}
            </div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Consultant Pathologist & Medical Officer</div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER AREA (4 Lab Photos + Integrated Ribbon Banner matching paper letterhead) */}
      <footer className="w-full shrink-0 select-none page-break-inside-avoid relative z-10">
        
        {/* Row of 4 Laboratory Photos Strip from authentic letterhead */}
        <div className="px-8 pb-1.5">
          <div className="w-full rounded overflow-hidden border border-slate-300 shadow-2xs bg-white">
            <img
              src={LAB_PHOTOS_STRIP}
              alt="Clinical Laboratory"
              className="w-full h-auto object-cover block"
              style={{ maxHeight: '48px' }}
            />
          </div>
        </div>

        {/* Bottom Integrated Ribbon Banner with Soft Blue & Green Wave */}
        <div className="relative w-full overflow-hidden" style={{ height: '48px' }}>
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
          <div className="absolute inset-0 z-10 px-8 flex justify-between items-center">
            
            {/* Oval Pill Badge on left */}
            <div className="bg-white border border-blue-600 rounded-full px-4 py-1 shadow-sm flex items-center">
              <span className="font-serif italic font-bold text-slate-800 text-[11px] tracking-wide whitespace-nowrap">
                A Fully computeriges Labaratory
              </span>
            </div>

            {/* Disclaimers in Center */}
            <div className="text-[10px] font-semibold text-slate-700 leading-tight">
              <div>1. Invalid for medico legal purpose</div>
              <div>2. Contain of this report is only an opinion not a diagnostic purpose</div>
            </div>

            {/* Pathology script on right */}
            <div className="font-serif italic text-slate-700 text-sm font-bold pr-2">
              pathology...
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
