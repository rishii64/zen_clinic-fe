import React from 'react';
import ReportLetterhead from './ReportLetterhead';
import { SPECIMEN_TYPES, STANDARD_METHODS } from '../data/reportTemplates';

// Smart test pagination helper to guarantee zero row slicing across pages
function paginateTests(tests) {
  if (!tests || tests.length === 0) return [[]];

  const calcRowHeight = 26;
  const calcTestChromeHeight = (t) => 34 + 26 + (t.impression ? 24 : 0) + 12;

  // Single page capacity (with full header, patient card, impression & signatures): ~520px
  const SINGLE_PAGE_CAPACITY = 520;
  // Multi-page capacities
  const PAGE_1_CAPACITY = 620;
  const MIDDLE_PAGE_CAPACITY = 680;
  const FINAL_PAGE_CAPACITY = 500;

  const totalHeight = tests.reduce((sum, t) => {
    return sum + calcTestChromeHeight(t) + ((t.results || []).length * calcRowHeight);
  }, 0);

  if (totalHeight <= SINGLE_PAGE_CAPACITY) {
    return [tests];
  }

  const pages = [];
  let currentPage = [];
  let currentHeight = 0;

  for (let t = 0; t < tests.length; t++) {
    const test = tests[t];
    const results = test.results || [];
    const testTotalHeight = calcTestChromeHeight(test) + (results.length * calcRowHeight);

    const isFirstPage = pages.length === 0;
    const capacity = isFirstPage ? PAGE_1_CAPACITY : MIDDLE_PAGE_CAPACITY;

    if (currentHeight + testTotalHeight <= capacity) {
      currentPage.push(test);
      currentHeight += testTotalHeight;
    } else if (currentHeight === 0 && testTotalHeight > capacity) {
      // Single test exceeds page capacity: split parameters cleanly
      const maxRows = Math.floor((capacity - calcTestChromeHeight(test)) / calcRowHeight);
      const rowsThisPage = results.slice(0, Math.max(maxRows, 1));
      const rowsRemaining = results.slice(Math.max(maxRows, 1));

      currentPage.push({
        ...test,
        results: rowsThisPage,
        isPartial: true
      });
      pages.push(currentPage);
      currentPage = [];
      currentHeight = 0;

      if (rowsRemaining.length > 0) {
        tests.splice(t + 1, 0, {
          ...test,
          testName: `${test.testName} (Continued)`,
          results: rowsRemaining,
          isContinuation: true
        });
      }
    } else {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
        currentHeight = 0;
      }
      t--; // Re-evaluate test on next page
    }
  }

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  // Ensure final page has room for impressions and signatures
  const lastIdx = pages.length - 1;
  const lastPageHeight = pages[lastIdx].reduce((sum, t) => {
    return sum + calcTestChromeHeight(t) + ((t.results || []).length * calcRowHeight);
  }, 0);

  if (lastPageHeight > FINAL_PAGE_CAPACITY && pages[lastIdx].length > 1) {
    const spilled = pages[lastIdx].pop();
    pages.push([spilled]);
  }

  return pages;
}

export default function DiagnosticReportView({ report, clinicConfig, showLetterhead = true }) {
  if (!report) return null;

  const patient = report.patientSnapshot || {};
  const tests = report.tests || [];

  // Resolve doctor and technologist details
  const doctor = {
    name: report.doctor?.name || clinicConfig?.doctorDetails?.name || 'Dr. R.K. MANDAL',
    qualifications: report.doctor?.qualifications || clinicConfig?.doctorDetails?.qualifications || 'M.B.B.S',
    regNo: report.doctor?.regNo || clinicConfig?.doctorDetails?.regNo || '18840',
    designation: report.doctor?.designation || clinicConfig?.doctorDetails?.designation || 'Consultant Pathologist & Medical Officer'
  };

  const technician = {
    name: report.technician?.name || clinicConfig?.technicianDetails?.name || 'Mr. R.K. Raut',
    qualifications: report.technician?.qualifications || clinicConfig?.technicianDetails?.qualifications || '(BMLT) Jaipur',
    designation: report.technician?.designation || clinicConfig?.technicianDetails?.designation || 'Chief Lab Technologist'
  };

  const rawInvestigationNames = tests.map((t) => t.testName).join(', ') || 'Diagnostic Pathology Investigation';
  const investigationNames = rawInvestigationNames.length > 34 ? rawInvestigationNames.substring(0, 34) + '...' : rawInvestigationNames;
  
  const rawSpecimenTypes = Array.from(new Set(tests.map((t) => t.sampleType || SPECIMEN_TYPES[t.category] || 'Venous Blood'))).join(', ');
  const specimenTypes = rawSpecimenTypes.length > 20 ? rawSpecimenTypes.substring(0, 20) + '...' : rawSpecimenTypes;

  const sampleCollectedDate = report.sampleCollectedAt
    ? new Date(report.sampleCollectedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : '04 Nov 2026, 10:28 am';

  const sampleReceivedDate = report.sampleReceivedAt
    ? new Date(report.sampleReceivedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : sampleCollectedDate;

  const reportedDate = report.reportedAt
    ? new Date(report.reportedAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved':
      case 'Delivered':
        return (
          <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase leading-none">
            Authorized
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-block bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase leading-none">
            Completed
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-block bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded text-[10px] uppercase leading-none">
            In Progress
          </span>
        );
      default:
        return (
          <span className="inline-block bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded text-[10px] uppercase leading-none">
            Collected
          </span>
        );
    }
  };

  // Divide tests into discrete pages
  const testPages = paginateTests(tests);
  const totalPages = testPages.length;

  return (
    <div className="diagnostic-report-pages flex flex-col gap-6 items-center w-full">
      {testPages.map((pageTests, pageIdx) => {
        const isFirstPage = pageIdx === 0;
        const isLastPage = pageIdx === totalPages - 1;

        return (
          <ReportLetterhead
            key={pageIdx}
            config={clinicConfig}
            report={report}
            showLetterhead={showLetterhead}
            currentPage={pageIdx + 1}
            totalPages={totalPages}
          >
            <div className="text-xs font-sans text-slate-800 w-full flex-1 flex flex-col justify-between">
              
              <div>
                {/* 1. PATIENT DEMOGRAPHICS HEADER */}
                {isFirstPage ? (
                  /* Rock-Solid Table-Based 3-Column Patient & Specimen Metadata Box on Page 1 */
                  <div className="bg-slate-50/90 border border-slate-300 rounded p-2 mb-2.5">
                    <table className="w-full text-xs border-collapse table-fixed">
                      <colgroup>
                        <col style={{ width: '34%' }} />
                        <col style={{ width: '33%' }} />
                        <col style={{ width: '33%' }} />
                      </colgroup>
                      <tbody>
                        <tr className="align-top">
                          {/* Col 1: Patient Demographics */}
                          <td className="pr-2.5 border-r border-slate-200">
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-none mb-1">
                              Patient Name
                            </div>
                            <div className="font-extrabold text-slate-950 text-sm leading-tight mb-1">
                              {patient.name || 'Walk-in Patient'}
                            </div>
                            <table className="w-full text-[11px] leading-tight border-collapse">
                              <tbody>
                                <tr>
                                  <td className="text-slate-500 py-0.5 w-[90px]">Patient / Lab ID:</td>
                                  <td className="font-bold text-slate-900 py-0.5">{patient.patientId || 'PAT-0001'}</td>
                                </tr>
                                <tr>
                                  <td className="text-slate-500 py-0.5">Age / Gender:</td>
                                  <td className="font-semibold text-slate-900 py-0.5">{patient.age} {patient.ageUnit || 'Y'} / {patient.gender || 'Unknown'}</td>
                                </tr>
                                <tr>
                                  <td className="text-slate-500 py-0.5">Contact Phone:</td>
                                  <td className="font-semibold text-slate-900 py-0.5">{patient.phone || 'N/A'}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>

                          {/* Col 2: Sample & Investigation Details */}
                          <td className="px-2.5 border-r border-slate-200">
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-none mb-1">
                              Investigation
                            </div>
                            <div className="font-bold text-blue-900 text-xs leading-tight mb-1" title={rawInvestigationNames}>
                              {investigationNames}
                            </div>
                            <table className="w-full text-[11px] leading-tight border-collapse">
                              <tbody>
                                <tr>
                                  <td className="text-slate-500 py-0.5 w-[92px]">Specimen Type:</td>
                                  <td className="font-semibold text-slate-900 py-0.5" title={rawSpecimenTypes}>{specimenTypes}</td>
                                </tr>
                                <tr>
                                  <td className="text-slate-500 py-0.5">Sample Collected:</td>
                                  <td className="font-semibold text-slate-900 py-0.5">{sampleCollectedDate}</td>
                                </tr>
                                <tr>
                                  <td className="text-slate-500 py-0.5">Sample Received:</td>
                                  <td className="font-semibold text-slate-900 py-0.5">{sampleReceivedDate}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>

                          {/* Col 3: Report & Physician Details */}
                          <td className="pl-2.5">
                            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider leading-none mb-1">
                              Report Identification
                            </div>
                            <div className="font-black text-blue-900 text-sm leading-tight mb-1">
                              {report.reportNumber}
                            </div>
                            <table className="w-full text-[11px] leading-tight border-collapse">
                              <tbody>
                                <tr>
                                  <td className="text-slate-500 py-0.5 w-[85px]">Ref. Doctor:</td>
                                  <td className="font-bold text-slate-900 py-0.5">{report.referringDoctor || 'Dr. R.K. MANDAL'}</td>
                                </tr>
                                <tr>
                                  <td className="text-slate-500 py-0.5">Report Date:</td>
                                  <td className="font-semibold text-slate-900 py-0.5">{reportedDate}</td>
                                </tr>
                                <tr>
                                  <td className="text-slate-500 py-0.5">Status:</td>
                                  <td className="py-0.5">{getStatusBadge(report.status)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  /* Streamlined Table Bar on Subsequent Pages (Thyrocare / Janch Report standard) */
                  <div className="bg-slate-50 border border-slate-300 rounded px-2.5 py-1 mb-2.5">
                    <table className="w-full text-[11px] border-collapse leading-tight">
                      <tbody>
                        <tr>
                          <td className="text-left w-[32%]">
                            <span className="text-slate-500 font-medium">Patient: </span>
                            <strong className="text-slate-950 font-bold">{patient.name}</strong>
                          </td>
                          <td className="text-left w-[20%]">
                            <span className="text-slate-500 font-medium">Lab ID: </span>
                            <strong className="text-slate-900 font-bold">{patient.patientId}</strong>
                          </td>
                          <td className="text-left w-[22%]">
                            <span className="text-slate-500 font-medium">Age/Sex: </span>
                            <strong className="text-slate-900 font-semibold">{patient.age} {patient.ageUnit || 'Y'} / {patient.gender}</strong>
                          </td>
                          <td className="text-right w-[26%]">
                            <span className="text-slate-500 font-medium">Report: </span>
                            <strong className="text-blue-900 font-bold">{report.reportNumber}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                {/* 2. DYNAMIC TEST INVESTIGATION PANELS FOR THIS PAGE */}
                <div className="space-y-2.5">
                  {pageTests.map((testItem, tIdx) => {
                    const testMethod = testItem.method || STANDARD_METHODS[testItem.testCode] || 'Standard Clinical Pathology Method';
                    const testSample = testItem.sampleType || SPECIMEN_TYPES[testItem.category] || 'Venous Blood';

                    return (
                      <div key={tIdx} className="border border-slate-300 rounded overflow-hidden shadow-2xs bg-white">
                        
                        {/* Test Header Ribbon */}
                        <div className="bg-slate-100 border-b border-slate-300 px-3 py-1 flex justify-between items-center">
                          <table className="w-full border-collapse">
                            <tbody>
                              <tr>
                                <td className="text-left align-middle">
                                  <span className="inline-block w-2 h-2 rounded-full bg-blue-700 mr-2 align-middle"></span>
                                  <span className="font-bold text-blue-950 uppercase tracking-wide text-xs align-middle">
                                    {testItem.testName}
                                  </span>
                                  {testItem.category && (
                                    <span className="text-[10px] text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded font-medium ml-2 align-middle">
                                      {testItem.category}
                                    </span>
                                  )}
                                </td>
                                <td className="text-right align-middle text-[10px] text-slate-600 font-medium">
                                  <span className="mr-3">Specimen: <strong className="text-slate-800">{testSample}</strong></span>
                                  <span>Method: <strong className="text-slate-800">{testMethod}</strong></span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        {/* Precise Pathology Table with explicit column proportions and zero-overflow cells */}
                        <table className="w-full text-left text-xs border-collapse table-fixed">
                          <colgroup>
                            <col style={{ width: '34%' }} />
                            <col style={{ width: '16%' }} />
                            <col style={{ width: '12%' }} />
                            <col style={{ width: '26%' }} />
                            <col style={{ width: '12%' }} />
                          </colgroup>
                          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-300 text-[11px]">
                            <tr>
                              <th className="py-1 px-3">Test Investigation</th>
                              <th className="py-1 px-3">Observed Value</th>
                              <th className="py-1 px-3">Units</th>
                              <th className="py-1 px-3">Biological Ref. Range</th>
                              <th className="py-1 px-3 text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {(testItem.results || []).map((res, rIdx) => {
                              const isAbnormal = res.flag && res.flag !== 'Normal' && res.flag !== 'Negative';
                              const isHigh = res.flag === 'High';
                              const isLow = res.flag === 'Low';
                              const isCritical = res.flag === 'Critical';
                              const isPositive = res.flag === 'Positive' || res.flag === 'Reactive';

                              return (
                                <tr key={rIdx} className={isCritical ? 'bg-rose-50/70 font-semibold' : isAbnormal ? 'bg-amber-50/50' : 'hover:bg-slate-50/50'}>
                                  {/* Investigation Parameter */}
                                  <td className="py-1 px-3 text-slate-900 font-medium leading-tight">
                                    {res.paramName}
                                  </td>

                                  {/* Observed Value */}
                                  <td className="py-1 px-3 font-bold text-slate-950 leading-tight">
                                    {res.resultValue ? (
                                      <span className={isCritical ? 'text-rose-700 font-black' : isHigh ? 'text-amber-700' : isLow ? 'text-amber-700' : 'text-slate-950'}>
                                        {res.resultValue}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 font-normal">Pending</span>
                                    )}
                                  </td>

                                  {/* Unit */}
                                  <td className="py-1 px-3 text-slate-600 text-[11px] leading-tight">
                                    {res.unit || '-'}
                                  </td>

                                  {/* Biological Ref Range */}
                                  <td className="py-1 px-3 text-slate-600 text-[10px] leading-tight break-words">
                                    {res.refRange || '-'}
                                  </td>

                                  {/* Status Flag Badge */}
                                  <td className="py-1 px-3 text-center align-middle">
                                    {isCritical ? (
                                      <span className="inline-block bg-rose-600 text-white font-black px-1.5 py-0.5 rounded text-[9px] uppercase leading-none">
                                        Critical
                                      </span>
                                    ) : isHigh ? (
                                      <span className="inline-block bg-rose-100 text-rose-800 font-bold px-1.5 py-0.5 rounded text-[9px] leading-none">
                                        High ▲
                                      </span>
                                    ) : isLow ? (
                                      <span className="inline-block bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[9px] leading-none">
                                        Low ▼
                                      </span>
                                    ) : isPositive ? (
                                      <span className="inline-block bg-purple-100 text-purple-800 font-bold px-1.5 py-0.5 rounded text-[9px] leading-none">
                                        Positive
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 text-[10px] font-medium leading-none">Normal</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>

                        {/* Per-test Impression if present */}
                        {testItem.impression && (
                          <div className="bg-slate-50 px-3 py-1 text-[11px] text-slate-700 border-t border-slate-200 leading-tight">
                            <strong className="text-slate-900">Findings: </strong>
                            <span>{testItem.impression}</span>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3. MULTI-PAGE CONTINUATION OR FINAL AUTHORIZATION BLOCK */}
              {!isLastPage ? (
                /* Non-final Page Continuation Indicator */
                <div className="mt-auto pt-2 pb-1 text-center">
                  <span className="inline-block text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full uppercase tracking-wider leading-tight">
                    Page {pageIdx + 1} of {totalPages} — Continued on Next Page ▶
                  </span>
                </div>
              ) : (
                /* Final Page: Clinical Interpretation, End Divider & Signatures */
                <div className="space-y-1.5 mt-auto pt-1.5">
                  
                  {/* Clinical Interpretation & Overall Impression */}
                  {(report.overallImpression || report.doctorRemarks) ? (
                    <div className="bg-slate-50/90 p-2 rounded border border-slate-300 text-xs space-y-1">
                      {report.overallImpression && (
                        <div className="leading-tight">
                          <strong className="text-blue-950 font-bold uppercase tracking-wide text-[10px]">Impression: </strong>
                          <span className="text-slate-900 font-medium ml-1 text-[11px]">{report.overallImpression}</span>
                        </div>
                      )}
                      {report.doctorRemarks && (
                        <div className="leading-tight">
                          <strong className="text-slate-700 font-semibold uppercase tracking-wide text-[10px]">Clinical Advice: </strong>
                          <span className="text-slate-800 ml-1 text-[11px]">{report.doctorRemarks}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-xs text-slate-700 leading-tight">
                      <strong className="text-blue-950 font-bold uppercase text-[10px]">Interpretation: </strong>
                      <span className="text-slate-800 text-[11px]">
                        Biological reference intervals are based on standard clinical pathology reference populations. Diagnostic correlation advised.
                      </span>
                    </div>
                  )}

                  {/* End of Diagnostic Report Divider */}
                  <div className="text-center py-0.5 text-[9px] font-mono text-slate-400 tracking-widest uppercase leading-none">
                    *** END OF DIAGNOSTIC REPORT ***
                  </div>

                  {/* Pathologist & Technologist Authorization Signatures (Table Layout) */}
                  <div className="pt-2 pb-0.5 border-t border-slate-200">
                    <table className="w-full border-collapse">
                      <tbody>
                        <tr>
                          {/* Technologist on left */}
                          <td className="w-1/2 text-center align-top leading-tight">
                            <div className="w-40 border-b border-slate-400 mx-auto pb-1 mb-1">
                              <span className="font-serif italic font-bold text-slate-700 text-sm">{technician.name}</span>
                            </div>
                            <strong className="block text-slate-900 font-bold uppercase text-[11px] leading-tight">{technician.name}</strong>
                            <div className="text-[10px] text-slate-600 font-medium leading-tight">{technician.qualifications}</div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold leading-tight">{technician.designation}</div>
                          </td>

                          {/* Doctor on right */}
                          <td className="w-1/2 text-center align-top leading-tight">
                            <div className="w-40 border-b border-slate-400 mx-auto pb-1 mb-1">
                              <span className="font-serif italic font-bold text-blue-900 text-sm">{doctor.name}</span>
                            </div>
                            <strong className="block text-slate-900 font-bold uppercase text-[11px] leading-tight">{doctor.name}</strong>
                            <div className="text-[10px] text-slate-600 font-medium leading-tight">
                              {doctor.qualifications} {doctor.regNo ? `(Reg. No: ${doctor.regNo})` : ''}
                            </div>
                            <div className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold leading-tight">{doctor.designation}</div>
                            {report.status === 'Approved' && (
                              <div className="mt-0.5">
                                <span className="inline-block text-[8px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-1.5 py-0.2 rounded-full leading-none">
                                  ✓ Digitally Signed & Authorized
                                </span>
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>
              )}

            </div>
          </ReportLetterhead>
        );
      })}
    </div>
  );
}
