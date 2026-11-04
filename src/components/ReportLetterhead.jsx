import React from 'react';

export default function ReportLetterhead({
  config,
  report,
  showLetterhead = true,
  children
}) {
  const clinic = config || {
    clinicName: 'Zen Clinic',
    regNumber: '',
    address: '',
    doctorDetails: {
      name: '',
      qualifications: '',
      regNo: ''
    },
    technicianDetails: {
      name: '',
      qualifications: ''
    },
    reportDisclaimers: [
      '1. Invalid for medico legal purpose',
      '2. Contain of this report is only an opinion not a diagnostic purpose'
    ]
  };

  const doctorInfo = (report && report.doctor) || clinic.doctorDetails || {};
  const techInfo = (report && report.technician) || clinic.technicianDetails || {};

  return (
    <div className="relative bg-white text-slate-800 font-sans shadow-lg mx-auto print-container" style={{ width: '210mm', minHeight: '297mm', padding: '0' }}>
      
      {/* Top Letterhead Header (matching attached Image 2 & Image 3) */}
      {showLetterhead && (
        <div className="w-full relative overflow-hidden select-none" style={{ height: '140px' }}>
          {/* Blue Top Wave Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-800">
            {/* Curved Green Banner Section using SVG */}
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1000 70"
              preserveAspectRatio="none"
              style={{ height: '58px' }}
            >
              {/* Purple accent wave border */}
              <path
                d="M 0,40 Q 300,10 600,45 T 1000,30 L 1000,70 L 0,70 Z"
                fill="#7e22ce"
                opacity="0.4"
              />
              {/* Vibrant Green Curved wave */}
              <path
                d="M 0,46 Q 320,16 620,50 T 1000,36 L 1000,70 L 0,70 Z"
                fill="#16a34a"
              />
            </svg>
          </div>

          {/* Upper Blue Zone Content */}
          <div className="relative z-10 px-6 pt-3 flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-3xl font-extrabold tracking-wider text-white drop-shadow-md uppercase">
                  {clinic.clinicName || 'RAJ JANCH GHAR'}
                </h1>
              </div>
              <p className="text-xs font-semibold tracking-wider text-blue-100 uppercase mt-0.5">
                {clinic.address || 'MAIN ROAD NETA JI CHOWK SAHARGHAT'}
              </p>
            </div>

            {/* Right Badge: Reg No & Rj Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="inline-block bg-white/95 text-rose-700 text-[11px] font-black px-2.5 py-0.5 rounded shadow-sm tracking-wide">
                  {clinic.regNumber || 'Reg.No - 430/2022'}
                </span>
              </div>
              {/* Emblem Logo */}
              <div className="w-12 h-12 rounded-lg bg-white p-1 shadow-md flex items-center justify-center border border-blue-200">
                <div className="text-center leading-none">
                  <span className="text-blue-700 font-black text-2xl tracking-tighter italic">R</span>
                  <span className="text-rose-600 font-black text-xl italic -ml-1">j</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Green Wave Doctor / Technologist Zone */}
          <div className="absolute bottom-1 left-0 right-0 z-10 px-6 flex justify-between items-end text-white pb-1">
            {/* Left: Doctor Details */}
            <div className="leading-tight">
              <span className="text-sm font-bold tracking-wide drop-shadow-sm text-yellow-300">
                {doctorInfo.name || 'Dr. R.K. MANDAL'}
              </span>
              <div className="text-[11px] font-medium text-emerald-50">
                <span>{doctorInfo.qualifications || 'M.B.B.S'}</span>
                {doctorInfo.regNo && <span className="ml-2 font-mono">Reg.No.: {doctorInfo.regNo}</span>}
              </div>
            </div>

            {/* Right: Lab Technologist */}
            <div className="text-right leading-tight">
              <span className="text-sm font-bold tracking-wide drop-shadow-sm text-yellow-300">
                {techInfo.name || 'Mr. R.K. Raut'}
              </span>
              <div className="text-[11px] font-medium text-emerald-50">
                <span>{techInfo.qualifications || '(BMLT) Jaipur'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Body Area with Watermark */}
      <div className="relative px-6 py-4" style={{ minHeight: showLetterhead ? '720px' : '900px' }}>
        
        {/* Authentic Microscope Circular Watermark (matching Image 3) */}
        {clinic.showWatermark !== false && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] select-none z-0">
            <div className="relative flex flex-col items-center justify-center">
              {/* Circular Ring with Stars */}
              <div className="w-96 h-96 rounded-full border-8 border-rose-900 flex flex-col items-center justify-center p-6 text-center">
                <div className="text-rose-900 font-extrabold text-2xl tracking-widest uppercase mb-2">
                  ★ {clinic.clinicName || 'ZEN CLINIC'} ★
                </div>
                {/* Microscope Vector Graphic */}
                <svg className="w-48 h-48 text-rose-900 my-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M6 18h8" />
                  <path d="M3 22h18" />
                  <path d="M14 22a7 7 0 1 0 0-14h-1" />
                  <path d="M9 14h2" />
                  <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
                  <path d="M12 6V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" />
                </svg>
                <div className="text-rose-900 font-bold text-lg tracking-widest uppercase mt-2">
                  ★ {clinic.watermarkText || clinic.clinicName || 'DIAGNOSTICS'} ★
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Report Content injected here */}
        <div className="relative z-10">
          {children}
        </div>
      </div>

      {/* Footer Area (matching Image 3 footer strip and disclaimers) */}
      <div className="relative z-10 w-full mt-auto page-break-inside-avoid">
        {/* Lab Images Collage Strip */}
        <div className="grid grid-cols-4 gap-1 px-6 pb-2">
          <div className="h-10 rounded overflow-hidden bg-slate-200 border border-slate-300">
            <div className="w-full h-full bg-gradient-to-r from-blue-900 to-indigo-800 flex items-center justify-center text-[9px] font-bold text-white uppercase text-center p-1">
              🧪 Auto Analyzer
            </div>
          </div>
          <div className="h-10 rounded overflow-hidden bg-slate-200 border border-slate-300">
            <div className="w-full h-full bg-gradient-to-r from-emerald-800 to-teal-700 flex items-center justify-center text-[9px] font-bold text-white uppercase text-center p-1">
              🔬 Microscopy Lab
            </div>
          </div>
          <div className="h-10 rounded overflow-hidden bg-slate-200 border border-slate-300">
            <div className="w-full h-full bg-gradient-to-r from-cyan-900 to-blue-800 flex items-center justify-center text-[9px] font-bold text-white uppercase text-center p-1">
              🧬 Serology & Elisa
            </div>
          </div>
          <div className="h-10 rounded overflow-hidden bg-slate-200 border border-slate-300">
            <div className="w-full h-full bg-gradient-to-r from-purple-900 to-indigo-900 flex items-center justify-center text-[9px] font-bold text-white uppercase text-center p-1">
              🩸 Hematology Cell
            </div>
          </div>
        </div>

        {/* Footer Blue Strip with Disclaimers and Computerized Lab Badge */}
        <div className="bg-slate-200 border-t border-slate-300 px-6 py-2.5 flex items-center justify-between text-[11px] text-slate-700">
          {/* Stylized Badge (Image 3 left) */}
          <div className="bg-white border border-blue-400 rounded-full px-3 py-1 shadow-sm">
            <span className="font-serif italic text-blue-900 font-bold tracking-wide">
              {clinic.tagline || 'A Fully computerized Laboratory'}
            </span>
          </div>

          {/* Legal Disclaimers (Image 3 center) */}
          <div className="text-center font-medium leading-tight text-slate-600 px-2">
            <div>1. Invalid for medico legal purpose</div>
            <div>2. Contain of this report is only an opinion not a diagnostic purpose</div>
          </div>

          {/* Authorized Signature (Image 3 right) */}
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              Pathologist / Authorized Sign
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

