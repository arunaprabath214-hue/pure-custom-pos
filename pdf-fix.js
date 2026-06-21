(() => {
  const STORE = {
    bills: "pureBills",
    quotations: "pureQuotations",
    settings: "pureSettings"
  };

  const money = (value) => Number(String(value ?? 0).replace(/,/g, "")) || 0;
  const rs = (value) => `Rs. ${money(value).toLocaleString("en-LK")}`;
  const read = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const safe = (value) => String(value ?? "").replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();

  function show(message) {
    const old = document.querySelector(".toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2400);
  }

  function getPreviewId(kind) {
    const rows = [...document.querySelectorAll("#overlayContent .invoice-row")];
    const wanted = kind === "quotation" ? "quotation" : "invoice";
    for (const row of rows) {
      const label = row.querySelector("b")?.textContent?.trim().toLowerCase();
      const value = row.querySelector("span")?.textContent?.trim();
      if (label === wanted && value) return value;
    }
    return "";
  }

  function getDocument(kind, id) {
    const list = read(kind === "quotation" ? STORE.quotations : STORE.bills, []);
    return list.find((item) => String(item.id) === String(id));
  }

  function getSettings() {
    return read(STORE.settings, {
      businessName: "Pure Custom Creation",
      phone: "077 188 2985",
      address: "Kandy, Sri Lanka",
      invoiceFooter: "Thank you for your business."
    });
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = [...document.scripts].find((script) => script.src === src);
      if (existing) {
        existing.addEventListener("load", resolve, { once: true });
        existing.addEventListener("error", reject, { once: true });
        return;
      }
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function getPdfClass() {
    if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;
    if (window.jsPDF) return window.jsPDF;

    const urls = [
      "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js",
      "https://unpkg.com/jspdf@2.5.1/dist/jspdf.umd.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"
    ];

    for (const url of urls) {
      try {
        show("Loading PDF engine...");
        await loadScript(url);
        if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;
        if (window.jsPDF) return window.jsPDF;
      } catch {
        // try next CDN
      }
    }
    return null;
  }

  function openPrintable(docData, kind) {
    const settings = getSettings();
    const title = kind === "quotation" ? "QUOTATION" : "INVOICE";
    const html = `<!doctype html><html><head><title>${title} ${docData.id}</title><style>body{font-family:Arial,sans-serif;padding:32px;color:#111}.paper{max-width:720px;margin:auto}h1{margin:0}.meta{color:#555}.row{display:flex;justify-content:space-between;border-bottom:1px solid #ddd;padding:10px 0}.total{font-weight:700;font-size:18px}.actions{margin:20px 0}@media print{.actions{display:none}}</style></head><body><div class="paper"><div class="actions"><button onclick="window.print()">Print / Save as PDF</button></div><h1>${safe(settings.businessName)}</h1><p class="meta">${safe(settings.address)}<br>${safe(settings.phone)}</p><div class="row"><b>${title}</b><span>${safe(docData.id)}</span></div><div class="row"><b>Date</b><span>${safe(docData.date)}</span></div>${kind === "quotation" ? `<div class="row"><b>Valid Until</b><span>${safe(docData.validUntil || "-")}</span></div>` : ""}<div class="row"><b>Customer</b><span>${safe(docData.customerName)}</span></div><div class="row"><span>${safe(docData.size)} custom branded bottles × ${safe(docData.quantity)}</span><b>${rs(docData.total)}</b></div>${kind === "invoice" ? `<div class="row"><span>Paid</span><b>${rs(docData.paid)}</b></div><div class="row"><span>Pending</span><b>${rs(docData.pending)}</b></div>` : ""}<div class="row total"><span>Total</span><b>${rs(docData.total)}</b></div><p>${safe(docData.note || settings.invoiceFooter || "Thank you.")}</p></div></body></html>`;
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow popups, then try again.");
      return;
    }
    win.document.open();
    win.document.write(html);
    win.document.close();
    setTimeout(() => win.print(), 250);
  }

  async function downloadPdf(id, kind) {
    const docData = getDocument(kind, id);
    if (!docData) {
      show("Document not found. Save the document first.");
      return;
    }

    const JsPDF = await getPdfClass();
    if (!JsPDF) {
      show("PDF engine blocked. Opening print version.");
      openPrintable(docData, kind);
      return;
    }

    try {
      const settings = getSettings();
      const title = kind === "quotation" ? "QUOTATION" : "INVOICE";
      const pdf = new JsPDF({ unit: "pt", format: "a4" });
      let y = 52;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text(safe(settings.businessName || "Pure Custom Creation"), 40, y);
      y += 18;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(safe(settings.address || ""), 40, y);
      y += 14;
      pdf.text(safe(settings.phone || ""), 40, y);
      y += 34;
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.text(title, 40, y);
      pdf.setFontSize(11);
      pdf.text(safe(docData.id), 430, y);
      y += 28;
      pdf.setFont("helvetica", "normal");
      pdf.text(`Date: ${safe(docData.date)}`, 40, y);
      y += 18;
      if (kind === "quotation") {
        pdf.text(`Valid Until: ${safe(docData.validUntil || "-")}`, 40, y);
        y += 18;
      }
      pdf.text(`Customer: ${safe(docData.customerName)}`, 40, y);
      y += 32;
      pdf.setDrawColor(220);
      pdf.line(40, y, 555, y);
      y += 24;
      pdf.setFont("helvetica", "bold");
      pdf.text("Description", 40, y);
      pdf.text("Qty", 330, y);
      pdf.text("Unit", 390, y);
      pdf.text("Amount", 470, y);
      y += 12;
      pdf.line(40, y, 555, y);
      y += 24;
      pdf.setFont("helvetica", "normal");
      pdf.text(`${safe(docData.size)} custom branded bottles`, 40, y);
      pdf.text(safe(docData.quantity), 330, y);
      pdf.text(rs(docData.unitPrice), 390, y);
      pdf.text(rs(docData.total), 470, y);
      y += 28;
      pdf.line(40, y, 555, y);
      y += 24;
      pdf.setFont("helvetica", "bold");
      pdf.text("Total", 390, y);
      pdf.text(rs(docData.total), 470, y);
      if (kind === "invoice") {
        y += 18;
        pdf.text("Paid", 390, y);
        pdf.text(rs(docData.paid), 470, y);
        y += 18;
        pdf.text("Pending", 390, y);
        pdf.text(rs(docData.pending), 470, y);
      }
      y += 42;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.text(safe(docData.note || settings.invoiceFooter || "Thank you."), 40, y, { maxWidth: 500 });
      pdf.save(`${safe(docData.id)}-${kind}.pdf`);
      show("PDF downloaded");
    } catch (error) {
      console.error("PDF generation failed", error);
      show("PDF failed. Opening print version.");
      openPrintable(docData, kind);
    }
  }

  document.addEventListener("click", (event) => {
    const billButton = event.target.closest("[data-pdf-bill], #downloadInvoicePdfBtn");
    const quotationButton = event.target.closest("[data-pdf-quotation], #downloadQuotationPdfBtn");
    if (!billButton && !quotationButton) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (billButton) {
      const id = billButton.dataset.pdfBill || getPreviewId("invoice");
      downloadPdf(id, "invoice");
    } else {
      const id = quotationButton.dataset.pdfQuotation || getPreviewId("quotation");
      downloadPdf(id, "quotation");
    }
  }, true);
})();
