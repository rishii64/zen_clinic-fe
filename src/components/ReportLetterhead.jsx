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

  return (
    <div
      className="relative bg-white text-slate-900 font-sans shadow-lg mx-auto print-container flex flex-col justify-between"
      style={{
        width: '210mm',
        minHeight: '297mm',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. TOP BANNER / HEADER (Authentic blue and green curved waves) */}
      {showLetterhead && (
        <header className="w-full shrink-0 relative overflow-hidden select-none" style={{ height: '138px' }}>
          {/* Blue Top Wave Background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-900">
            {/* SVG Wave dividing Blue and Green */}
            <svg
              className="absolute bottom-0 left-0 w-full"
              viewBox="0 0 1000 68"
              preserveAspectRatio="none"
              style={{ height: '56px' }}
            >
              {/* Subtle purple accent contour */}
              <path
                d="M 0,38 Q 300,8 600,42 T 1000,28 L 1000,68 L 0,68 Z"
                fill="#6b21a8"
                opacity="0.35"
              />
              {/* Vibrant Green Curved wave */}
              <path
                d="M 0,44 Q 320,14 620,48 T 1000,34 L 1000,68 L 0,68 Z"
                fill="#15803d"
              />
            </svg>
          </div>

          {/* Upper Blue Zone Content */}
          <div className="relative z-10 px-7 pt-3 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-black tracking-wider text-white drop-shadow-sm uppercase">
                {clinic.clinicName || 'RAJ JANCH GHAR'}
              </h1>
              <p className="text-xs font-bold tracking-wider text-blue-100 uppercase mt-0.5">
                {clinic.address || 'MAIN ROAD NETA JI CHOWK SAHARGHAT'}
              </p>
            </div>

            {/* Right Badge: Reg No & Rj Logo */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <span className="inline-block bg-white text-rose-700 text-[11px] font-black px-2.5 py-0.5 rounded shadow-xs tracking-wide">
                  {clinic.regNumber || 'Reg No - 430/2022'}
                </span>
              </div>
              {/* Authentic Emblem Logo */}
              <div className="w-12 h-12 rounded-lg bg-white p-1 shadow-md flex items-center justify-center border border-blue-200">
                <div className="text-center leading-none">
                  <div className="w-8 h-2 border-t-2 border-r-2 border-blue-900 rounded-tr-full mb-0.5"></div>
                  <span className="text-blue-800 font-black text-2xl tracking-tighter italic">R</span>
                  <span className="text-rose-600 font-black text-xl italic -ml-1">j</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lower Green Wave Doctor / Technologist Zone */}
          <div className="absolute bottom-1 left-0 right-0 z-10 px-7 flex justify-between items-end text-white pb-1">
            {/* Left: Doctor Details */}
            <div className="leading-tight">
              <span className="text-sm font-bold tracking-wide text-yellow-300 italic">
                {doctorInfo.name || 'Dr. R.K. MANDAL'}
              </span>
              <div className="text-[11px] font-medium text-emerald-50">
                <span>{doctorInfo.qualifications || 'M.B.B.S'}</span>
                {doctorInfo.regNo && <span className="ml-2 font-mono text-yellow-200">Reg.No.: {doctorInfo.regNo}</span>}
              </div>
            </div>

            {/* Right: Lab Technologist */}
            <div className="text-right leading-tight">
              <span className="text-sm font-bold tracking-wide text-yellow-300 italic">
                {techInfo.name || 'Mr. R.K. Raut'}
              </span>
              <div className="text-[11px] font-medium text-emerald-50">
                <span>{techInfo.qualifications || '(BMLT) Jaipur'}</span>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* 2. MAIN BODY AREA (Watermark + Injected Report Content + Doctor Signatures) */}
      <main className="flex-1 flex flex-col justify-between px-7 py-3 relative z-10">
        
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

        {/* Doctor & Technologist Signatures (Positioned directly above the footer photos) */}
        <div className="pt-6 pb-2 grid grid-cols-2 gap-8 text-center text-xs page-break-inside-avoid relative z-10">
          {/* Technologist on left */}
          <div>
            <div className="w-44 border-b border-slate-400 mx-auto pb-3 mb-1">
              <span className="font-serif italic font-bold text-slate-700 text-sm">Mr. R.K. Raut</span>
            </div>
            <strong className="block text-slate-900 font-bold">{techInfo.name || 'Mr. R.K. Raut'}</strong>
            <div className="text-[11px] text-slate-600 font-medium">{techInfo.qualifications || '(BMLT) Jaipur'}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Chief Lab Technologist</div>
          </div>

          {/* Doctor on right */}
          <div>
            <div className="w-44 border-b border-slate-400 mx-auto pb-3 mb-1">
              <span className="font-serif italic font-bold text-blue-900 text-sm">Dr. R.K. Mandal</span>
            </div>
            <strong className="block text-slate-900 font-bold">{doctorInfo.name || 'Dr. R.K. MANDAL'}</strong>
            <div className="text-[11px] text-slate-600 font-medium">{doctorInfo.qualifications || 'M.B.B.S'} {doctorInfo.regNo ? `(Reg. No: ${doctorInfo.regNo})` : ''}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Consultant Pathologist & Medical Officer</div>
          </div>
        </div>
      </main>

      {/* 3. FOOTER AREA (4 Lab Photos + Disclaimers + Bottom Wave Banner) */}
      <footer className="w-full shrink-0 select-none page-break-inside-avoid relative z-10">
        
        {/* Row of 4 Laboratory Photos Strip from authentic letterhead */}
        <div className="px-6 pb-2">
          <div className="w-full rounded-sm overflow-hidden border border-slate-300 shadow-2xs bg-white">
            <img
              src={LAB_PHOTOS_STRIP}
              alt="Clinical Laboratory"
              className="w-full h-auto object-cover block"
              style={{ maxHeight: '52px' }}
            />
          </div>
        </div>

        {/* Legal Disclaimers & Pathology Department */}
        <div className="px-6 pb-1 flex justify-between items-end text-[10px] text-slate-600 font-medium">
          <div className="leading-tight">
            <div>1. Invalid for medico legal purpose</div>
            <div>2. Contain of this report is only an opinion not a diagnostic purpose</div>
          </div>
          <div className="font-serif italic text-slate-600 text-xs pr-2 font-semibold">
            pathology...
          </div>
        </div>

        {/* Bottom Curved Wave Ribbon with "A Fully computeriges Labaratory" badge */}
        <div className="relative w-full overflow-hidden" style={{ height: '36px' }}>
          {/* Flowing bottom gradient wave SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 1000 36"
            preserveAspectRatio="none"
          >
            {/* Light blue soft background wave */}
            <path
              d="M 0,16 Q 250,2 500,18 T 1000,10 L 1000,36 L 0,36 Z"
              fill="#93c5fd"
              opacity="0.5"
            />
            {/* Green curved accent wave */}
            <path
              d="M 0,22 Q 300,8 650,24 T 1000,16 L 1000,36 L 0,36 Z"
              fill="#15803d"
            />
          </svg>

          {/* Oval Pill Badge matching physical letterhead */}
          <div className="absolute left-6 top-1 z-10 bg-white border border-blue-500 rounded-full px-3.5 py-0.5 shadow-xs">
            <span className="font-serif italic font-bold text-slate-800 text-[11px] tracking-wide">
              A Fully computeriges Labaratory
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
