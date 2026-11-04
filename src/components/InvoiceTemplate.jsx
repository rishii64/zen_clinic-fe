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

export default function InvoiceTemplate({ bill, config, showLetterhead = true }) {
  if (!bill) return null;

  const clinic = config || {
    clinicName: 'RAJ JANCH GHAR',
    regNumber: 'Reg.No - 430/2022',
    address: 'MAIN ROAD NETA JI CHOWK SAHARGHAT',
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

  return (
    <div
      className="relative bg-white text-slate-900 font-sans mx-auto print-container flex flex-col justify-between shadow-lg"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '12mm 14mm',
        boxSizing: 'border-box'
      }}
    >
      <div>
        {/* Top Header */}
        {showLetterhead && (
          <header className="border-b-2 border-blue-600 pb-4 mb-5 select-none">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-extrabold text-2xl tracking-tight uppercase">
                    {clinic.clinicName || 'RAJ JANCH GHAR'}
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded">
                    {clinic.regNumber || 'Reg.No - 430/2022'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-1 uppercase">
                  {clinic.address || 'MAIN ROAD NETA JI CHOWK SAHARGHAT'}
                </p>
                <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-4 gap-y-0.5">
                  {clinic.phone && <span>Phone: <strong className="font-mono text-slate-700">{clinic.phone}</strong></span>}
                  {clinic.email && <span>Email: {clinic.email}</span>}
                  {clinic.isGstEnabled && clinic.gstin && (
                    <span>GSTIN: <strong className="font-mono text-slate-700">{clinic.gstin}</strong></span>
                  )}
                  {clinic.state && <span>State: {clinic.state} {clinic.stateCode ? `(${clinic.stateCode})` : ''}</span>}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-block bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded tracking-wider uppercase mb-1">
                  {bill.isGstBill ? 'TAX INVOICE' : 'DIAGNOSTIC BILL / CASH RECEIPT'}
                </span>
                <div className="text-sm font-bold text-slate-900 font-mono mt-0.5">
                  {bill.invoiceNumber}
                </div>
                <div className="text-xs text-slate-500">
                  Date: {new Date(bill.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Patient & Invoice Meta Box - Precise 2-Column Grid */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50/90 p-4 rounded-lg border border-slate-200 text-xs mb-5">
          {/* Left Column: Patient Details */}
          <div className="space-y-1.5">
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-500 font-medium">Patient Name:</span>
              <span className="font-bold text-slate-950 text-sm leading-tight">{patient.name || 'Walk-in Patient'}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-500 font-medium">Patient ID:</span>
              <span className="font-mono font-semibold text-slate-800">{patient.patientId || 'N/A'}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-500 font-medium">Age / Gender:</span>
              <span className="font-medium text-slate-800">{patient.age} {patient.ageUnit || 'Yrs'} / {patient.gender}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-500 font-medium">Contact Phone:</span>
              <span className="font-mono text-slate-800">{patient.phone || 'N/A'}</span>
            </div>
            {patient.address && (
              <div className="flex items-baseline">
                <span className="w-28 shrink-0 text-slate-500 font-medium">Address:</span>
                <span className="text-slate-700 leading-snug">{patient.address}</span>
              </div>
            )}
          </div>

          {/* Right Column: Billing & Doctor Metadata */}
          <div className="space-y-1.5 border-l border-slate-200 pl-5">
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-500 font-medium">Ref. Doctor:</span>
              <span className="font-bold text-blue-900 leading-tight">{bill.referringDoctor || 'Dr. R.K. MANDAL'}</span>
            </div>
            <div className="flex items-baseline">
              <span className="w-28 shrink-0 text-slate-500 font-medium">Linked Report:</span>
              <span className="font-mono font-semibold text-emerald-700">{bill.report ? 'Generated (Linked)' : 'Pending Specimen'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-28 shrink-0 text-slate-500 font-medium">Billing Mode:</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${bill.isGstBill ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'}`}>
                {bill.isGstBill ? 'GST Registered Mode' : 'Non-GST Diagnostic Exempt'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="w-28 shrink-0 text-slate-500 font-medium">Payment Status:</span>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isPaid
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : isPartial
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-rose-100 text-rose-800 border border-rose-300'
                }`}>
                ● {bill.paymentStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Tests Itemized Table with Fixed Column Proportions */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-5">
          <table className="w-full text-left text-xs border-collapse table-fixed">
            <colgroup>
              <col style={{ width: '6%' }} />
              <col style={{ width: '15%' }} />
              <col style={{ width: '35%' }} />
              <col style={{ width: '18%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '14%' }} />
            </colgroup>
            <thead>
              <tr className="bg-blue-700 text-white font-semibold">
                <th className="py-2.5 px-3 text-center">#</th>
                <th className="py-2.5 px-3">Test Code</th>
                <th className="py-2.5 px-3">Diagnostic Test Description</th>
                <th className="py-2.5 px-3">Category / Specimen</th>
                <th className="py-2.5 px-3 text-right">Rate (₹)</th>
                <th className="py-2.5 px-3 text-center">Qty</th>
                <th className="py-2.5 px-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(bill.items || []).map((item, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                  <td className="py-2.5 px-3 text-slate-500 font-mono text-center">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-blue-900">{item.testCode}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{item.testName}</td>
                  <td className="py-2.5 px-3 text-slate-600">
                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                      {item.category || 'Diagnostic'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono font-medium">₹{Number(item.unitPrice).toFixed(2)}</td>
                  <td className="py-2.5 px-3 text-center font-mono">{item.quantity || 1}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-950">
                    ₹{Number(item.totalAmount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Breakdown Grid */}
        <div className="grid grid-cols-2 gap-6 mb-6">

          {/* Left: Notes, UPI QR Code & Payment History */}
          <div className="text-xs space-y-3">
            <div className="bg-blue-50/70 border border-blue-200 p-3 rounded-lg flex items-center space-x-3">
              <img src={qrUrl} alt="UPI QR" className="w-16 h-16 rounded border border-blue-300 bg-white p-0.5 shrink-0" />
              <div>
                <div className="font-bold text-blue-900">Instant UPI Payment</div>
                <div className="text-[11px] text-blue-700">Scan to pay directly via GPay / PhonePe / Paytm</div>
                <div className="text-[10px] font-mono text-slate-600 mt-0.5">VPA: {upiId}</div>
              </div>
            </div>

            {/* Payment Receipts History */}
            {bill.payments && bill.payments.length > 0 && (
              <div>
                <span className="font-bold text-slate-700 block mb-1">Receipt Logs:</span>
                <div className="space-y-1">
                  {bill.payments.map((p, idx) => (
                    <div key={idx} className="bg-slate-100 px-2.5 py-1 rounded text-[11px] flex justify-between items-center">
                      <span>
                        <strong className="text-slate-800">{p.mode}</strong>: <span className="font-mono font-bold text-slate-900">₹{p.amount}</span>
                        {p.transactionId && <span className="font-mono text-slate-500 ml-1">({p.transactionId})</span>}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">
                        {new Date(p.receivedAt || Date.now()).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-500 italic leading-relaxed">
              Note: {bill.notes || clinic.invoiceNotes || 'Healthcare & diagnostic services are generally exempt from GST unless requested.'}
            </div>
          </div>

          {/* Right: Calculations with Strict Column Alignment */}
          <div className="bg-slate-50/90 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
            <div className="flex justify-between items-center text-slate-600">
              <span>Subtotal (Tests Total):</span>
              <span className="font-mono font-medium text-right w-28">₹{Number(bill.subtotal || 0).toFixed(2)}</span>
            </div>

            {bill.discountAmount > 0 && (
              <div className="flex justify-between items-center text-rose-600 font-medium">
                <span>Discount ({bill.discountReason || 'Discount'}):</span>
                <span className="font-mono text-right w-28">- ₹{Number(bill.discountAmount || 0).toFixed(2)}</span>
              </div>
            )}

            {/* GST breakdown if applicable */}
            {bill.isGstBill ? (
              <div className="border-t border-slate-200 pt-2 space-y-1.5">
                <div className="flex justify-between items-center text-slate-600">
                  <span>Taxable Value:</span>
                  <span className="font-mono text-right w-28">₹{(bill.subtotal - (bill.discountAmount || 0)).toFixed(2)}</span>
                </div>
                {bill.cgstAmount > 0 && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span>CGST ({bill.cgstRate}%):</span>
                    <span className="font-mono text-right w-28">₹{Number(bill.cgstAmount).toFixed(2)}</span>
                  </div>
                )}
                {bill.sgstAmount > 0 && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span>SGST ({bill.sgstRate}%):</span>
                    <span className="font-mono text-right w-28">₹{Number(bill.sgstAmount).toFixed(2)}</span>
                  </div>
                )}
                {bill.igstAmount > 0 && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span>IGST ({bill.igstRate}%):</span>
                    <span className="font-mono text-right w-28">₹{Number(bill.igstAmount).toFixed(2)}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-1.5 italic">
                Healthcare diagnostic services are exempt from GST.
              </div>
            )}

            <div className="border-t-2 border-slate-300 pt-2 flex justify-between items-center text-base font-extrabold text-blue-900">
              <span>Grand Total:</span>
              <span className="font-mono text-right w-32">₹{Number(bill.grandTotal || 0).toFixed(2)}</span>
            </div>

            <div className="text-[11px] font-semibold text-slate-700 italic pb-1">
              {numberToWordsIndian(bill.grandTotal)}
            </div>

            <div className="border-t border-slate-200 pt-2 space-y-1.5">
              <div className="flex justify-between items-center text-emerald-700 font-bold">
                <span>Paid Amount:</span>
                <span className="font-mono text-right w-28">₹{Number(bill.paidAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-rose-700 font-bold text-sm">
                <span>Balance Due:</span>
                <span className="font-mono text-right w-28">₹{Number(bill.dueAmount || 0).toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Signature & Seal Block - Pinned at Document Bottom */}
      <footer className="border-t border-slate-200 pt-4 flex justify-between items-end text-xs text-slate-600 select-none page-break-inside-avoid">
        <div>
          <span className="font-mono text-[10px] text-slate-400">Generated by {clinic.clinicName || 'Zen Clinic'} ERP System</span>
        </div>
        <div className="text-center">
          <div className="w-48 border-b border-slate-400 pb-7 mb-1 mx-auto"></div>
          <span className="font-bold text-slate-900 block text-xs">Authorized Signatory / Cashier</span>
          <div className="text-[10px] text-slate-500">{clinic.clinicName || 'Zen Clinic'}</div>
        </div>
      </footer>

    </div>
  );
}
