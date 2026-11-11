import{j as e}from"./index-eR9e1S4B.js";import{r as o,Z as I,v as O,P as $,i as E,D as W,X as U}from"./icons-uAsKsH0X.js";import{E as X,h as q}from"./pdf-vendor-yPRbxKTF.js";import{M as B}from"./ModalPortal-BA3wHsQb.js";function V({isOpen:d,onClose:m,title:k="Print Document",children:p,defaultShowLetterhead:j=!0,documentType:N="report",reportNumber:b=""}){const[l,P]=o.useState(j),[f,g]=o.useState(!1),[u,s]=o.useState(.95),[S,w]=o.useState(!1),c=o.useRef(null);if(o.useEffect(()=>{if(typeof window<"u"){const t=window.innerWidth;t<640?s(.45):t<1024?s(.7):t<1440?s(.9):s(1)}},[d]),!d)return null;const C=()=>s(t=>Math.min(t+.1,1.5)),D=()=>s(t=>Math.max(t-.1,.4)),F=()=>s(1),R=()=>{window.print()},T=async()=>{if(c.current)try{g(!0);const t=c.current;typeof window<"u"&&window.scrollTo(0,0),document.fonts&&document.fonts.ready&&await document.fonts.ready,await new Promise(n=>setTimeout(n,150));const h=t.querySelectorAll(".a4-page"),y=h&&h.length>0?Array.from(h):[t],x=new X({orientation:"p",unit:"mm",format:"a4",compress:!0}),Z=210,M=297;for(let n=0;n<y.length;n++){const H=y[n];n>0&&x.addPage();const A=(await q(H,{scale:2,useCORS:!0,allowTaint:!0,logging:!1,backgroundColor:"#ffffff",width:794,height:1123,windowWidth:794,windowHeight:1123,scrollX:0,scrollY:0,onclone:(i,a)=>{a.style.width="210mm",a.style.height="297mm",a.style.minHeight="297mm",a.style.maxHeight="297mm",a.style.overflow="hidden",a.style.boxSizing="border-box",a.style.transform="none",a.style.margin="0 auto",a.style.boxShadow="none";let r=a.parentElement;for(;r&&r!==i.body;)r.style.overflow="visible",r.style.maxHeight="none",r.style.height="auto",r.style.transform="none",r=r.parentElement;const v=i.createElement("style");v.innerHTML=`
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
            `,i.head.appendChild(v),document.fonts&&i.fonts&&document.fonts.forEach(L=>{try{i.fonts.add(L)}catch{}})}})).toDataURL("image/png");x.addImage(A,"PNG",0,0,Z,M,void 0,"FAST")}const z=b?`${b}.pdf`:`${N}_${Date.now()}.pdf`;x.save(z),w(!0),setTimeout(()=>w(!1),2500)}catch(t){console.error("Error generating PDF:",t),window.print()}finally{g(!1)}};return e.jsxs(B,{isOpen:d,onClose:m,children:[e.jsx("style",{children:`
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
      `}),e.jsx("div",{className:"fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto no-print",onClick:t=>{t.target===t.currentTarget&&m()},children:e.jsxs("div",{className:"relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[96vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800 my-auto",children:[e.jsxs("div",{className:"px-4 py-2.5 bg-slate-50 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2.5 select-none",children:[e.jsxs("div",{className:"flex items-center space-x-2.5",children:[e.jsx("span",{className:"font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate max-w-md",children:k}),e.jsx("span",{className:"text-[10px] bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40 px-2 py-0.5 rounded font-mono font-bold",children:"A4 (210×297mm)"})]}),e.jsxs("div",{className:"flex items-center flex-wrap gap-2",children:[e.jsxs("div",{className:"flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-0.5 shadow-2xs",children:[e.jsx("button",{onClick:D,title:"Zoom Out",className:"p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition",children:e.jsx(I,{className:"w-3.5 h-3.5"})}),e.jsxs("button",{onClick:F,title:"Reset to 100%",className:"px-2 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600",children:[Math.round(u*100),"%"]}),e.jsx("button",{onClick:C,title:"Zoom In",className:"p-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition",children:e.jsx(O,{className:"w-3.5 h-3.5"})})]}),e.jsxs("button",{onClick:()=>P(!l),className:`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${l?"bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800":"bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"}`,title:"Toggle Letterhead banner for printing on physical pre-printed stationery",children:[e.jsx("span",{children:"Letterhead:"}),e.jsx("strong",{className:"uppercase",children:l?"ON":"OFF"})]}),e.jsxs("button",{onClick:R,className:"flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition",title:"Print or Save as PDF using your browser's native print engine",children:[e.jsx($,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:"Print"})]}),e.jsx("button",{onClick:T,disabled:f,className:"flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-xs transition disabled:opacity-50",title:"Download pixel-perfect diagnostic PDF report",children:S?e.jsxs(e.Fragment,{children:[e.jsx(E,{className:"w-3.5 h-3.5 text-white"}),e.jsx("span",{children:"Downloaded!"})]}):e.jsxs(e.Fragment,{children:[e.jsx(W,{className:"w-3.5 h-3.5"}),e.jsx("span",{children:f?"Rendering PDF...":"Export PDF"})]})}),e.jsx("button",{onClick:m,className:"p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition ml-1",children:e.jsx(U,{className:"w-4 h-4"})})]})]}),e.jsx("div",{className:"p-3 sm:p-6 overflow-auto flex justify-center bg-slate-200/80 dark:bg-slate-950 flex-1 min-h-0",children:e.jsx("div",{style:{transform:`scale(${u})`,transformOrigin:"top center",transition:"transform 0.15s ease-out"},className:"shrink-0 my-2",children:e.jsx("div",{ref:c,className:"print-wrapper flex flex-col gap-6 items-center",style:{width:"210mm",boxSizing:"border-box"},children:typeof p=="function"?p(l):p})})})]})})]})}export{V as P};
