import React from 'react';

// Number to Indian words helper for medical invoice compliance
function numberToWordsIndian(num) {
  if (!num || isNaN(num) || num <= 0) return 'Zero Rupees Only';
  const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function inWords(n) {
    if (n === 0) return '';
    if (n < 20) return a[n] + ' ';
    if (n < 100) return b[Math.floor(n / 10)] + ' ' + a[n % 10] + ' ';
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred ' + inWords(n % 100);
    if (n < 100000) return inWords(Math.floor(n / 1000)) + 'Thousand ' + inWords(n % 1000);
    if (n < 10000000) return inWords(Math.floor(n / 100000)) + 'Lakh ' + inWords(n % 100000);
    return inWords(Math.floor(n / 10000000)) + 'Crore ' + inWords(n % 10000000);
  }

  const rounded = Math.round(num);
  return `${inWords(rounded).trim()} Rupees Only`;
}

// Invoice items pagination helper to guarantee zero row slicing
function paginateInvoiceItems(items) {
  if (!items || items.length === 0) return [[]];

  // Up to 12 items comfortably fit on a single page with all financial summaries & QR code
  if (items.length <= 12) {
    return [items];
  }

  // Multi-page invoice:
  // Page 1 gets up to 14 items without financial breakdown
  // Subsequent pages get up to 10 items to reserve space for final totals & signatures
  const pages = [];
  const PAGE_1_MAX = 14;
  const SUBSEQUENT_PAGE_MAX = 10;

  const copy = [...items];
  pages.push(copy.splice(0, PAGE_1_MAX));

  while (copy.length > 0) {
    pages.push(copy.splice(0, SUBSEQUENT_PAGE_MAX));
  }

  return pages;
}

export default function InvoiceTemplate({ bill, config, showLetterhead = true }) {
  if (!bill) return null;

  const clinic = config || {
    clinicName: 'RAJ JANCH GHAR',
    regNumber: 'Reg No - 430/2022',
    address: 'MAIN ROAD NETAJI CHOWK SAHARGHAT',
    phone: '',
    email: '',
    gstin: '',
    state: 'Bihar',
    stateCode: '10'
  };

  const patient = bill.patientSnapshot || {};
  const isPaid = bill.paymentStatus === 'Paid';
  const isPartial = bill.paymentStatus === 'Partially Paid';

  // Generate UPI QR link for quick patient payment
  const upiId = clinic.upiId || clinic.email || 'clinic@upi';
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(clinic.clinicName || 'Clinic')}&am=${bill.dueAmount || bill.grandTotal}&cu=INR&tn=Invoice_${bill.invoiceNumber}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(upiLink)}`;

  const items = bill.items || [];
  const itemPages = paginateInvoiceItems(items);
  const totalPages = itemPages.length;

  return (
    <div className="invoice-pages flex flex-col gap-6 items-center w-full">
      {itemPages.map((pageItems, pIdx) => {
        const isFirstPage = pIdx === 0;
        const isLastPage = pIdx === totalPages - 1;
        // Compute running item index offset
        let itemIndexOffset = 0;
        for (let i = 0; i < pIdx; i++) {
          itemIndexOffset += itemPages[i].length;
        }

        return (
          <div
            key={pIdx}
            className="a4-page relative bg-white text-slate-900 font-sans mx-auto print-container flex flex-col justify-between shadow-lg"
            style={{
              width: '210mm',
              height: '297mm',
              minHeight: '297mm',
              maxHeight: '297mm',
              padding: '12mm 14mm',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}
          >
            <div>
              {/* Top Header */}
              {showLetterhead && (
                <header className="border-b-2 border-blue-600 pb-2.5 mb-3 select-none">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="text-left align-top">
                          <div className="flex items-center space-x-2">
                            <span className="text-blue-800 font-black text-2xl tracking-tight uppercase leading-none">
                              {clinic.clinicName || 'RAJ JANCH GHAR'}
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded leading-none">
                              {clinic.regNumber || 'Reg No - 430/2022'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 font-semibold mt-1 uppercase leading-none">
                            {clinic.address || 'MAIN ROAD NETAJI CHOWK SAHARGHAT'}
                          </p>
                          <div className="text-[11px] text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-0.5 leading-none">
                            {clinic.phone && <span>Phone: <strong className="text-slate-700">{clinic.phone}</strong></span>}
                            {clinic.email && <span>Email: {clinic.email}</span>}
                            {clinic.isGstEnabled && clinic.gstin && (
                              <span>GSTIN: <strong className="text-slate-700">{clinic.gstin}</strong></span>
                            )}
                            {clinic.state && <span>State: {clinic.state} {clinic.stateCode ? `(${clinic.stateCode})` : ''}</span>}
                          </div>
                        </td>

                        <td className="text-right align-top w-[240px]">
                          <span className="inline-block bg-blue-700 text-white font-bold text-xs px-2.5 py-1 rounded tracking-wider uppercase mb-1 leading-none">
                            {bill.isGstBill ? 'TAX INVOICE' : 'DIAGNOSTIC BILL / RECEIPT'}
                          </span>
                          <div className="text-sm font-black text-slate-900 leading-tight">
                            {bill.invoiceNumber}
                          </div>
                          <div className="text-[11px] text-slate-500 leading-tight">
                            Date: {new Date(bill.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </header>
              )}

              {/* Patient & Invoice Meta Box */}
              {isFirstPage ? (
                /* Full Patient & Billing Info Box on Page 1 (Table-Based) */
                <div className="bg-slate-50/90 p-2.5 rounded border border-slate-200 text-xs mb-3">
                  <table className="w-full border-collapse table-fixed">
                    <colgroup>
                      <col style={{ width: '50%' }} />
                      <col style={{ width: '50%' }} />
                    </colgroup>
                    <tbody>
                      <tr className="align-top">
                        {/* Left: Patient Details */}
                        <td className="pr-3 border-r border-slate-200">
                          <table className="w-full text-[11px] leading-tight border-collapse">
                            <tbody>
                              <tr>
                                <td className="text-slate-500 py-0.5 w-[90px]">Patient Name:</td>
                                <td className="font-bold text-slate-950 text-xs py-0.5">{patient.name || 'Walk-in Patient'}</td>
                              </tr>
                              <tr>
                                <td className="text-slate-500 py-0.5">Patient ID:</td>
                                <td className="font-bold text-slate-900 py-0.5">{patient.patientId || 'N/A'}</td>
                              </tr>
                              <tr>
                                <td className="text-slate-500 py-0.5">Age / Gender:</td>
                                <td className="font-semibold text-slate-800 py-0.5">{patient.age} {patient.ageUnit || 'Yrs'} / {patient.gender}</td>
                              </tr>
                              <tr>
                                <td className="text-slate-500 py-0.5">Contact Phone:</td>
                                <td className="font-semibold text-slate-800 py-0.5">{patient.phone || 'N/A'}</td>
                              </tr>
                            </tbody>
                          </table>
                        </td>

                        {/* Right: Billing & Doctor Metadata */}
                        <td className="pl-3">
                          <table className="w-full text-[11px] leading-tight border-collapse">
                            <tbody>
                              <tr>
                                <td className="text-slate-500 py-0.5 w-[85px]">Ref. Doctor:</td>
                                <td className="font-bold text-blue-900 py-0.5">{bill.referringDoctor || 'Dr. R.K. MANDAL'}</td>
                              </tr>
                              <tr>
                                <td className="text-slate-500 py-0.5">Billing Mode:</td>
                                <td className="py-0.5">
                                  <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded leading-none ${bill.isGstBill ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'}`}>
                                    {bill.isGstBill ? 'GST Registered' : 'Diagnostic Exempt'}
                                  </span>
                                </td>
                              </tr>
                              <tr>
                                <td className="text-slate-500 py-0.5">Status:</td>
                                <td className="py-0.5">
                                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full leading-none ${isPaid
                                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                      : isPartial
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-rose-100 text-rose-800 border border-rose-300'
                                    }`}>
                                    ● {bill.paymentStatus}
                                  </span>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Compact Streamlined Patient Bar on Subsequent Pages */
                <div className="bg-slate-50 border border-slate-200 rounded px-3 py-1 mb-3">
                  <table className="w-full text-xs border-collapse leading-tight">
                    <tbody>
                      <tr>
                        <td className="text-left">
                          <span className="text-slate-500 font-medium">Patient: </span>
                          <strong className="text-slate-900 font-bold">{patient.name}</strong>
                          <span className="text-slate-400 mx-2">|</span>
                          <span className="text-slate-500 font-medium">ID: </span>
                          <strong className="text-slate-800 font-bold">{patient.patientId}</strong>
                        </td>
                        <td className="text-right">
                          <span className="text-slate-500 font-medium">Invoice: </span>
                          <strong className="text-blue-900 font-bold">{bill.invoiceNumber}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tests Itemized Table with Fixed Column Proportions & Zero-Overflow Cells */}
              <div className="border border-slate-300 rounded overflow-hidden mb-3">
                <table className="w-full text-left text-xs border-collapse table-fixed">
                  <colgroup>
                    <col style={{ width: '6%' }} />
                    <col style={{ width: '15%' }} />
                    <col style={{ width: '37%' }} />
                    <col style={{ width: '16%' }} />
                    <col style={{ width: '12%' }} />
                    <col style={{ width: '5%' }} />
                    <col style={{ width: '13%' }} />
                  </colgroup>
                  <thead>
                    <tr className="bg-blue-700 text-white font-semibold text-[11px]">
                      <th className="py-1.5 px-3 text-center">#</th>
                      <th className="py-1.5 px-3">Test Code</th>
                      <th className="py-1.5 px-3">Diagnostic Investigation</th>
                      <th className="py-1.5 px-3">Category</th>
                      <th className="py-1.5 px-3 text-right">Rate (₹)</th>
                      <th className="py-1.5 px-3 text-center">Qty</th>
                      <th className="py-1.5 px-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pageItems.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                        <td className="py-1.5 px-3 text-slate-500 text-center text-[11px] leading-tight">{itemIndexOffset + idx + 1}</td>
                        <td className="py-1.5 px-3 font-bold text-blue-900 text-[11px] leading-tight">{item.testCode}</td>
                        <td className="py-1.5 px-3 font-semibold text-slate-900 text-xs leading-tight">{item.testName}</td>
                        <td className="py-1.5 px-3 text-slate-600 leading-tight">
                          <span className="inline-block text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-1 py-0.5 rounded font-medium leading-none">
                            {item.category || 'Diagnostic'}
                          </span>
                        </td>
                        <td className="py-1.5 px-3 text-right font-medium text-xs leading-tight">₹{Number(item.unitPrice).toFixed(2)}</td>
                        <td className="py-1.5 px-3 text-center text-xs leading-tight">{item.quantity || 1}</td>
                        <td className="py-1.5 px-3 text-right font-bold text-slate-950 text-xs leading-tight">
                          ₹{Number(item.totalAmount).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Summary & Breakdown on Final Page */}
              {isLastPage ? (
                <div className="mt-2">
                  <table className="w-full border-collapse table-fixed">
                    <colgroup>
                      <col style={{ width: '48%' }} />
                      <col style={{ width: '4%' }} />
                      <col style={{ width: '48%' }} />
                    </colgroup>
                    <tbody>
                      <tr className="align-top">
                        {/* Left: UPI QR Code, Notes & Payment Receipts */}
                        <td>
                          <div className="bg-blue-50/70 border border-blue-200 p-2.5 rounded mb-2">
                            <table className="border-collapse">
                              <tbody>
                                <tr>
                                  <td className="pr-3 align-middle">
                                    <img src={qrUrl} alt="UPI QR" className="w-14 h-14 rounded border border-blue-300 bg-white p-0.5 block" />
                                  </td>
                                  <td className="align-middle text-xs leading-tight">
                                    <div className="font-bold text-blue-950">Instant UPI Payment</div>
                                    <div className="text-[10px] text-blue-800">Scan via GPay / PhonePe / Paytm</div>
                                    <div className="text-[10px] text-slate-600 mt-0.5">VPA: {upiId}</div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>

                          {/* Payment Receipts History */}
                          {bill.payments && bill.payments.length > 0 && (
                            <div className="mb-2">
                              <span className="font-bold text-slate-700 block mb-1 text-[11px] leading-tight">Payment Logs:</span>
                              <div className="space-y-1">
                                {bill.payments.map((p, idx) => (
                                  <div key={idx} className="bg-slate-100 px-2 py-0.5 rounded text-[10px] flex justify-between items-center leading-tight">
                                    <span>
                                      <strong className="text-slate-800">{p.mode}</strong>: <span className="font-bold text-slate-900">₹{p.amount}</span>
                                      {p.transactionId && <span className="text-slate-500 ml-1">({p.transactionId})</span>}
                                    </span>
                                    <span className="text-slate-500">
                                      {new Date(p.receivedAt || Date.now()).toLocaleDateString('en-IN')}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="text-[10px] text-slate-500 italic leading-snug">
                            Note: {bill.notes || clinic.invoiceNotes || 'Healthcare & diagnostic services are generally exempt from GST unless requested.'}
                          </div>
                        </td>

                        {/* Gap */}
                        <td></td>

                        {/* Right: Calculations with Strict Column Alignment (Table-Based) */}
                        <td>
                          <div className="bg-slate-50/90 p-3 rounded border border-slate-200 text-xs">
                            <table className="w-full border-collapse leading-tight">
                              <tbody>
                                <tr>
                                  <td className="text-slate-600 py-0.5">Subtotal:</td>
                                  <td className="text-right font-medium text-slate-900 py-0.5 w-28">₹{Number(bill.subtotal || 0).toFixed(2)}</td>
                                </tr>

                                {bill.discountAmount > 0 && (
                                  <tr>
                                    <td className="text-rose-600 font-medium py-0.5">Discount ({bill.discountReason || 'Discount'}):</td>
                                    <td className="text-right font-bold text-rose-600 py-0.5 w-28">- ₹{Number(bill.discountAmount || 0).toFixed(2)}</td>
                                  </tr>
                                )}

                                {bill.isGstBill ? (
                                  <>
                                    <tr className="border-t border-slate-200">
                                      <td className="text-slate-600 py-0.5 pt-1">Taxable Value:</td>
                                      <td className="text-right font-medium text-slate-900 py-0.5 pt-1 w-28">₹{(bill.subtotal - (bill.discountAmount || 0)).toFixed(2)}</td>
                                    </tr>
                                    {bill.cgstAmount > 0 && (
                                      <tr>
                                        <td className="text-slate-600 py-0.5">CGST ({bill.cgstRate}%):</td>
                                        <td className="text-right font-medium text-slate-900 py-0.5 w-28">₹{Number(bill.cgstAmount).toFixed(2)}</td>
                                      </tr>
                                    )}
                                    {bill.sgstAmount > 0 && (
                                      <tr>
                                        <td className="text-slate-600 py-0.5">SGST ({bill.sgstRate}%):</td>
                                        <td className="text-right font-medium text-slate-900 py-0.5 w-28">₹{Number(bill.sgstAmount).toFixed(2)}</td>
                                      </tr>
                                    )}
                                  </>
                                ) : (
                                  <tr className="border-t border-slate-200">
                                    <td colSpan="2" className="text-[10px] text-slate-500 py-0.5 pt-1 italic">
                                      Healthcare diagnostic services exempt from GST.
                                    </td>
                                  </tr>
                                )}

                                <tr className="border-t-2 border-slate-300">
                                  <td className="text-sm font-black text-blue-950 py-1 pt-1.5">Grand Total:</td>
                                  <td className="text-right font-black text-base text-blue-950 py-1 pt-1.5 w-32">₹{Number(bill.grandTotal || 0).toFixed(2)}</td>
                                </tr>

                                <tr>
                                  <td colSpan="2" className="text-[10px] font-semibold text-slate-700 italic pb-1">
                                    {numberToWordsIndian(bill.grandTotal)}
                                  </td>
                                </tr>

                                <tr className="border-t border-slate-200">
                                  <td className="text-emerald-700 font-bold py-0.5 pt-1">Paid Amount:</td>
                                  <td className="text-right font-bold text-emerald-700 py-0.5 pt-1 w-28">₹{Number(bill.paidAmount || 0).toFixed(2)}</td>
                                </tr>
                                <tr>
                                  <td className="text-rose-700 font-bold py-0.5">Balance Due:</td>
                                  <td className="text-right font-bold text-rose-700 py-0.5 w-28">₹{Number(bill.dueAmount || 0).toFixed(2)}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                /* Non-final page continuation notice */
                <div className="mt-4 text-center">
                  <span className="inline-block text-[10px] font-bold text-blue-900 bg-blue-50 border border-blue-200 px-3.5 py-1 rounded-full uppercase tracking-wider leading-tight">
                    Page {pIdx + 1} of {totalPages} — Continued on Next Page ▶
                  </span>
                </div>
              )}
            </div>

            {/* Signature & Seal Block - Pinned at Document Bottom */}
            <footer className="border-t border-slate-200 pt-2 select-none page-break-inside-avoid">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td className="text-left align-bottom leading-tight">
                      <span className="text-[9px] text-slate-400">Generated by {clinic.clinicName || 'Zen Clinic'} ERP</span>
                      {totalPages > 1 && (
                        <span className="text-[10px] text-slate-600 font-bold ml-3">
                          Page {pIdx + 1} of {totalPages}
                        </span>
                      )}
                    </td>
                    <td className="text-right align-bottom leading-tight w-[200px]">
                      <div className="w-40 border-b border-slate-400 pb-5 mb-1 ml-auto"></div>
                      <span className="font-bold text-slate-900 block text-[11px] leading-tight">Authorized Signatory / Cashier</span>
                      <div className="text-[9px] text-slate-500 leading-tight">{clinic.clinicName || 'Zen Clinic'}</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </footer>

          </div>
        );
      })}
    </div>
  );
}
