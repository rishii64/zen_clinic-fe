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
    phone: '+91 94312 87654 / +91 98012 34567',
    email: 'rajjanchghar@gmail.com',
    gstin: '10ABCPG4321R1Z8',
    state: 'Bihar',
    stateCode: '10'
  };

  const patient = bill.patientSnapshot || {};
  const isPaid = bill.paymentStatus === 'Paid';
  const isPartial = bill.paymentStatus === 'Partially Paid';

  // Generate UPI QR link for quick patient payment
  const upiId = 'rajjanchghar@sbi';
  const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(clinic.clinicName)}&am=${bill.dueAmount || bill.grandTotal}&cu=INR&tn=Invoice_${bill.invoiceNumber}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(upiLink)}`;

  return (
    <div className="bg-white text-slate-800 p-8 max-w-4xl mx-auto shadow-md border border-slate-200 print-container">
      
      {/* Top Header */}
      {showLetterhead && (
        <div className="border-b-2 border-blue-600 pb-4 mb-5">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-700 font-extrabold text-2xl tracking-tight">
                  {clinic.clinicName || 'RAJ JANCH GHAR'}
                </span>
                <span className="bg-blue-100 text-blue-800 text-[11px] font-bold px-2 py-0.5 rounded">
                  {clinic.regNumber || 'Reg.No - 430/2022'}
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-1">
                {clinic.address || 'MAIN ROAD NETA JI CHOWK SAHARGHAT'}
              </p>
              <div className="text-xs text-slate-500 mt-0.5 flex space-x-4">
                <span>Phone: {clinic.phone}</span>
                {clinic.isGstEnabled && <span>GSTIN: <strong className="font-mono">{clinic.gstin}</strong></span>}
                {clinic.state && <span>State: {clinic.state} ({clinic.stateCode})</span>}
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block bg-blue-600 text-white font-bold text-sm px-3 py-1 rounded tracking-wider uppercase mb-1">
                {bill.isGstBill ? 'TAX INVOICE' : 'DIAGNOSTIC BILL / CASH RECEIPT'}
              </span>
              <div className="text-sm font-bold text-slate-800 font-mono mt-1">
                {bill.invoiceNumber}
              </div>
              <div className="text-xs text-slate-500">
                Date: {new Date(bill.createdAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Patient & Invoice Meta Box */}
      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs mb-5">
        <div className="space-y-1">
          <div className="flex">
            <span className="w-28 text-slate-500 font-medium">Patient Name:</span>
            <span className="font-bold text-slate-900 text-sm">{patient.name || 'Walk-in Patient'}</span>
          </div>
          <div className="flex">
            <span className="w-28 text-slate-500 font-medium">Patient ID:</span>
            <span className="font-mono font-semibold text-slate-800">{patient.patientId || 'N/A'}</span>
          </div>
          <div className="flex">
            <span className="w-28 text-slate-500 font-medium">Age / Gender:</span>
            <span className="font-medium text-slate-800">{patient.age} {patient.ageUnit || 'Yrs'} / {patient.gender}</span>
          </div>
          <div className="flex">
            <span className="w-28 text-slate-500 font-medium">Contact Phone:</span>
            <span className="font-mono text-slate-800">{patient.phone || 'N/A'}</span>
          </div>
          {patient.address && (
            <div className="flex">
              <span className="w-28 text-slate-500 font-medium">Address:</span>
              <span className="text-slate-700">{patient.address}</span>
            </div>
          )}
        </div>

        <div className="space-y-1 text-right sm:text-left sm:pl-6 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0">
          <div className="flex justify-between sm:justify-start sm:space-x-4">
            <span className="text-slate-500 font-medium">Ref. Doctor:</span>
            <span className="font-bold text-blue-900">{bill.referringDoctor || 'Dr. R.K. MANDAL'}</span>
          </div>
          <div className="flex justify-between sm:justify-start sm:space-x-4">
            <span className="text-slate-500 font-medium">Linked Report:</span>
            <span className="font-mono font-bold text-emerald-700">{bill.report ? 'Generated (Linked)' : 'Pending Specimen'}</span>
          </div>
          <div className="flex justify-between sm:justify-start sm:space-x-4 items-center">
            <span className="text-slate-500 font-medium">Billing Mode:</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${bill.isGstBill ? 'bg-purple-100 text-purple-800' : 'bg-slate-200 text-slate-700'}`}>
              {bill.isGstBill ? 'GST Registered Mode' : 'Non-GST Diagnostic Exempt'}
            </span>
          </div>
          <div className="flex justify-between sm:justify-start sm:space-x-4 items-center">
            <span className="text-slate-500 font-medium">Payment Status:</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              isPaid
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

      {/* Tests Itemized Table */}
      <table className="w-full text-left text-xs mb-5 border-collapse">
        <thead>
          <tr className="bg-blue-700 text-white font-semibold">
            <th className="py-2.5 px-3 rounded-tl">#</th>
            <th className="py-2.5 px-3">Test Code</th>
            <th className="py-2.5 px-3">Diagnostic Test Description</th>
            <th className="py-2.5 px-3">Category / Specimen</th>
            <th className="py-2.5 px-3 text-right">Rate (₹)</th>
            <th className="py-2.5 px-3 text-center">Qty</th>
            <th className="py-2.5 px-3 text-right rounded-tr">Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 border-b border-slate-200">
          {(bill.items || []).map((item, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              <td className="py-2 px-3 text-slate-500 font-mono">{idx + 1}</td>
              <td className="py-2 px-3 font-mono font-bold text-blue-900">{item.testCode}</td>
              <td className="py-2 px-3 font-semibold text-slate-900">{item.testName}</td>
              <td className="py-2 px-3 text-slate-600">
                <span className="text-[11px] bg-slate-200 px-1.5 py-0.5 rounded">
                  {item.category || 'Diagnostic'}
                </span>
              </td>
              <td className="py-2 px-3 text-right font-mono">₹{Number(item.unitPrice).toFixed(2)}</td>
              <td className="py-2 px-3 text-center font-mono">{item.quantity || 1}</td>
              <td className="py-2 px-3 text-right font-mono font-bold text-slate-900">
                ₹{Number(item.totalAmount).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Financial Summary & Breakdown */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        
        {/* Left: Notes, UPI QR Code & Payment History */}
        <div className="text-xs space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex items-center space-x-3">
            <img src={qrUrl} alt="UPI QR" className="w-16 h-16 rounded border border-blue-300 bg-white p-0.5" />
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
                  <div key={idx} className="bg-slate-100 px-2.5 py-1 rounded text-[11px] flex justify-between">
                    <span>
                      <strong className="text-slate-800">{p.mode}</strong>: ₹{p.amount}
                      {p.transactionId && <span className="font-mono text-slate-500 ml-1">({p.transactionId})</span>}
                    </span>
                    <span className="text-slate-500">
                      {new Date(p.receivedAt || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-[11px] text-slate-500 italic">
            Note: {bill.notes || clinic.invoiceNotes || 'Thank you for choosing Raj Janch Ghar. Get well soon!'}
          </div>
        </div>

        {/* Right: Calculations */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-2">
          <div className="flex justify-between text-slate-600">
            <span>Subtotal (Tests Total):</span>
            <span className="font-mono font-medium">₹{Number(bill.subtotal || 0).toFixed(2)}</span>
          </div>

          {bill.discountAmount > 0 && (
            <div className="flex justify-between text-rose-600 font-medium">
              <span>Discount ({bill.discountReason || 'Discount'}):</span>
              <span className="font-mono">- ₹{Number(bill.discountAmount || 0).toFixed(2)}</span>
            </div>
          )}

          {/* GST breakdown if applicable */}
          {bill.isGstBill ? (
            <div className="border-t border-slate-200 pt-2 space-y-1">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value:</span>
                <span className="font-mono">₹{(bill.subtotal - (bill.discountAmount || 0)).toFixed(2)}</span>
              </div>
              {bill.cgstAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>CGST ({bill.cgstRate}%):</span>
                  <span className="font-mono">₹{Number(bill.cgstAmount).toFixed(2)}</span>
                </div>
              )}
              {bill.sgstAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>SGST ({bill.sgstRate}%):</span>
                  <span className="font-mono">₹{Number(bill.sgstAmount).toFixed(2)}</span>
                </div>
              )}
              {bill.igstAmount > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>IGST ({bill.igstRate}%):</span>
                  <span className="font-mono">₹{Number(bill.igstAmount).toFixed(2)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="text-[11px] text-slate-500 border-t border-slate-200 pt-1 italic">
              Health care diagnostic services are exempt from GST.
            </div>
          )}

          <div className="border-t-2 border-slate-300 pt-2 flex justify-between text-base font-extrabold text-blue-900">
            <span>Grand Total:</span>
            <span className="font-mono">₹{Number(bill.grandTotal || 0).toFixed(2)}</span>
          </div>

          <div className="text-[11px] font-semibold text-slate-700 italic pb-1">
            {numberToWordsIndian(bill.grandTotal)}
          </div>

          <div className="border-t border-slate-200 pt-2 space-y-1">
            <div className="flex justify-between text-emerald-700 font-bold">
              <span>Paid Amount:</span>
              <span className="font-mono">₹{Number(bill.paidAmount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-rose-700 font-bold text-sm">
              <span>Balance Due:</span>
              <span className="font-mono">₹{Number(bill.dueAmount || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Signature & Seal Block */}
      <div className="border-t border-slate-200 pt-6 flex justify-between items-end text-xs text-slate-600">
        <div>
          <span className="font-mono text-[10px] text-slate-400">Generated by Raj Janch Ghar ERP System</span>
        </div>
        <div className="text-center">
          <div className="w-44 border-b border-slate-400 pb-8 mb-1"></div>
          <span className="font-bold text-slate-800">Authorized Signatory / Cashier</span>
          <div className="text-[10px] text-slate-500">Raj Janch Ghar, Saharghat</div>
        </div>
      </div>

    </div>
  );
}

