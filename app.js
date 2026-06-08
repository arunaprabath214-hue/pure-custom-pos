const body = document.body;
const lightBtn = document.getElementById("lightBtn");
const darkBtn = document.getElementById("darkBtn");
const pageHeading = document.getElementById("pageHeading");
const pageSubtitle = document.getElementById("pageSubtitle");

const leadPipelineList = document.getElementById("leadPipelineList");
const leadSearchInput = document.getElementById("leadSearchInput");
const leadPipelineHead = document.getElementById("leadPipelineHead");
const leadFilterRow = document.getElementById("leadFilterRow");
const pipelineCount = document.getElementById("pipelineCount");

const customerList = document.getElementById("customerList");
const customerSearchInput = document.getElementById("customerSearchInput");
const customerListHead = document.getElementById("customerListHead");
const customerListCount = document.getElementById("customerListCount");

const cashEntryList = document.getElementById("cashEntryList");
const cashSearchInput = document.getElementById("cashSearchInput");
const cashListHead = document.getElementById("cashListHead");
const cashFilterRow = document.getElementById("cashFilterRow");
const cashListCount = document.getElementById("cashListCount");

const savedTheme = localStorage.getItem("pureTheme") || "dark";
const savedTab = localStorage.getItem("pureActiveTab") || "dashboard";

let activeLeadStatusFilter = "All";
let activeCustomerFilter = "all";
let activeCashTypeFilter = "All";

const defaultLeads = [
  {
    id: "lead-001",
    businessName: "Cuppa Café",
    contactPerson: "Kasun Perera",
    phone: "0771234567",
    whatsapp: "94771234567",
    address: "Kandy",
    businessType: "Café",
    status: "Closed",
    followUp: "06 May 2026",
    notes: "Closed lead. Ready to convert into official customer."
  },
  {
    id: "lead-002",
    businessName: "Royal Event House",
    contactPerson: "Nadeesha Silva",
    phone: "0719876543",
    whatsapp: "94719876543",
    address: "Colombo",
    businessType: "Event",
    status: "Quotation Sent",
    followUp: "08 May 2026",
    notes: "Wants 1500ml bottles with cap printing for wedding event."
  },
  {
    id: "lead-003",
    businessName: "Hilltop Hotel",
    contactPerson: "Manager",
    phone: "0762228899",
    whatsapp: "94762228899",
    address: "Nuwara Eliya",
    businessType: "Hotel",
    status: "Closed",
    followUp: "Today",
    notes: "Closed recurring 500ml supply for room service branding."
  },
  {
    id: "lead-004",
    businessName: "Green Table Restaurant",
    contactPerson: "Amila",
    phone: "0754455667",
    whatsapp: "94754455667",
    address: "Peradeniya",
    businessType: "Restaurant",
    status: "Contacted",
    followUp: "Tomorrow",
    notes: "Asked for 500ml bottle price with normal label."
  }
];

const defaultCustomers = [
  {
    id: "CUS-001",
    leadId: "lead-001",
    businessName: "Cafe Aroma",
    contactPerson: "Tharindu",
    phone: "0771882985",
    whatsapp: "94771882985",
    address: "Kandy",
    brandName: "Cafe Aroma",
    advanceDate: "20 April 2026",
    advanceAmount: "15000",
    pendingBalance: "12500",
    creditBalance: "3000",
    lastOrderDate: "12 April 2026",
    lastContactedDate: "26 April 2026",
    stock500: "860",
    stock1000: "420",
    stock1500: "140",
    normal500: "50",
    normal1000: "80",
    normal1500: "100",
    afterAdvance500: "47",
    afterAdvance1000: "75.5",
    afterAdvance1500: "95.5",
    notes: "Regular 500ml supply. Prefers delivery every two weeks.",
    orderHistory: [
      {
        date: "12 April 2026",
        item: "500ml custom bottles",
        quantity: "500",
        total: "25000",
        paid: "12500",
        pending: "12500",
        note: "Partial payment. Balance pending."
      },
      {
        date: "28 March 2026",
        item: "500ml custom bottles",
        quantity: "300",
        total: "15000",
        paid: "15000",
        pending: "0",
        note: "Paid full amount."
      }
    ]
  },
  {
    id: "CUS-002",
    leadId: "lead-003",
    businessName: "Hilltop Hotel",
    contactPerson: "Manager",
    phone: "0762228899",
    whatsapp: "94762228899",
    address: "Nuwara Eliya",
    brandName: "Hilltop Hotel",
    advanceDate: "12 April 2026",
    advanceAmount: "30000",
    pendingBalance: "0",
    creditBalance: "0",
    lastOrderDate: "03 April 2026",
    lastContactedDate: "10 April 2026",
    stock500: "320",
    stock1000: "90",
    stock1500: "60",
    normal500: "50",
    normal1000: "80",
    normal1500: "100",
    afterAdvance500: "47",
    afterAdvance1000: "75.5",
    afterAdvance1500: "95.5",
    notes: "Hotel customer. Current label stock is low.",
    orderHistory: [
      {
        date: "03 April 2026",
        item: "500ml custom bottles",
        quantity: "800",
        total: "37600",
        paid: "37600",
        pending: "0",
        note: "Paid full amount."
      }
    ]
  }
];

const defaultCashEntries = [
  {
    id: "CASH-001",
    type: "Advance",
    customer: "Cafe Aroma",
    amount: "15000",
    date: "20 April 2026",
    method: "Bank",
    note: "Advance payment received for label printing."
  },
  {
    id: "CASH-002",
    type: "Collection",
    customer: "Cafe Aroma",
    amount: "12500",
    date: "12 April 2026",
    method: "Cash",
    note: "Partial payment collected from 500ml order."
  },
  {
    id: "CASH-003",
    type: "Expense",
    customer: "Artline Printing",
    amount: "8500",
    date: "11 April 2026",
    method: "Cash",
    note: "Label printing payment."
  },
  {
    id: "CASH-004",
    type: "Credit",
    customer: "Cafe Aroma",
    amount: "3000",
    date: "12 April 2026",
    method: "Credit",
    note: "Credit balance allowed for customer."
  }
];

let leads = JSON.parse(localStorage.getItem("pureLeads")) || defaultLeads;
let customers = JSON.parse(localStorage.getItem("pureCustomers")) || defaultCustomers;
let cashEntries = JSON.parse(localStorage.getItem("pureCashEntries")) || defaultCashEntries;

leads = leads.map((lead) => ({
  whatsapp: lead.whatsapp || toWhatsAppNumber(lead.phone || ""),
  ...lead
}));

customers = customers.map((customer) => ({
  whatsapp: customer.whatsapp || toWhatsAppNumber(customer.phone || ""),
  orderHistory: customer.orderHistory || [],
  ...customer
}));

function toWhatsAppNumber(phone) {
  const digits = String(phone || "").replace(/\D/g, "");

  if (digits.startsWith("94")) return digits;
  if (digits.startsWith("0")) return `94${digits.slice(1)}`;
  if (digits.length === 9) return `94${digits}`;

  return digits;
}

function cleanPhone(phone) {
  return String(phone || "").replace(/\s/g, "");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function moneyNumber(value) {
  return Number(value || 0);
}

function formatCurrency(value) {
  const amount = moneyNumber(value);
  return `Rs. ${amount.toLocaleString("en-LK")}`;
}

function totalLabelStock(customer) {
  return moneyNumber(customer.stock500) + moneyNumber(customer.stock1000) + moneyNumber(customer.stock1500);
}

function isThisMonth(dateText) {
  if (!dateText) return false;

  const now = new Date();
  const parsed = new Date(dateText);

  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.getFullYear() === now.getFullYear() && parsed.getMonth() === now.getMonth();
}

function isToday(dateText) {
  if (!dateText) return false;

  const now = new Date();
  const parsed = new Date(dateText);

  if (Number.isNaN(parsed.getTime())) return false;

  return parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth() &&
    parsed.getDate() === now.getDate();
}

function needsFollowUp(customer) {
  return !isThisMonth(customer.lastOrderDate);
}

function needsReminder(customer) {
  return moneyNumber(customer.pendingBalance) > 0 ||
    moneyNumber(customer.creditBalance) > 0 ||
    totalLabelStock(customer) < 500;
}

function getCustomerBadge(customer) {
  if (moneyNumber(customer.pendingBalance) > 0) return { label: "Pending Pay", className: "pending-pay" };
  if (totalLabelStock(customer) < 500) return { label: "Low Stock", className: "low-stock" };
  if (needsFollowUp(customer)) return { label: "Follow-up", className: "followup" };
  return { label: "Active", className: "active" };
}

function statusClass(status) {
  const value = String(status).toLowerCase();

  if (value === "new") return "new";
  if (value === "contacted") return "contacted";
  if (value === "quotation sent") return "quoted";
  if (value === "negotiating") return "negotiating";
  if (value === "closed") return "closed";
  if (value === "lost") return "lost";

  return "new";
}

function cashTypeClass(type) {
  const value = String(type || "").toLowerCase();

  if (value === "income") return "income";
  if (value === "expense") return "expense";
  if (value === "advance") return "advance";
  if (value === "collection") return "collection";
  if (value === "credit") return "credit";

  return "income";
}

function isCashIn(type) {
  return ["Income", "Advance", "Collection"].includes(type);
}

function isCashOut(type) {
  return ["Expense", "Credit"].includes(type);
}

function saveLeads() {
  localStorage.setItem("pureLeads", JSON.stringify(leads));
}

function saveCustomers() {
  localStorage.setItem("pureCustomers", JSON.stringify(customers));
}

function saveCashEntries() {
  localStorage.setItem("pureCashEntries", JSON.stringify(cashEntries));
}

function applyTheme(theme) {
  if (theme === "light") {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
  } else {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
  }

  localStorage.setItem("pureTheme", theme);
}

function setHeader(tab) {
  if (tab === "leads") {
    pageHeading.textContent = "Leads";
    pageSubtitle.textContent = "Track prospects & follow-ups";
    return;
  }

  if (tab === "customers") {
    pageHeading.textContent = "Customers";
    pageSubtitle.textContent = "Manage official customer accounts";
    return;
  }

  if (tab === "cash") {
    pageHeading.textContent = "Cash Balance";
    pageSubtitle.textContent = "Track cash movements & collections";
    return;
  }

  if (tab === "more") {
    pageHeading.textContent = "More";
    pageSubtitle.textContent = "Settings, reports & tools";
    return;
  }

  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  pageHeading.textContent = "Dashboard";
  pageSubtitle.textContent = formattedDate;
}

function switchTab(tab) {
  const screens = document.querySelectorAll(".tab-screen");
  const navItems = document.querySelectorAll(".nav-item");

  screens.forEach((screen) => screen.classList.remove("active-screen"));
  navItems.forEach((item) => item.classList.remove("active"));

  const targetScreen = document.getElementById(`${tab}Screen`);
  const targetNav = document.querySelector(`[data-tab="${tab}"]`);

  if (targetScreen) {
    targetScreen.classList.add("active-screen");
  } else {
    document.getElementById("dashboardScreen").classList.add("active-screen");
    tab = "dashboard";
  }

  if (targetNav) {
    targetNav.classList.add("active");
  } else {
    document.querySelector('[data-tab="dashboard"]').classList.add("active");
  }

  setHeader(tab);
  localStorage.setItem("pureActiveTab", tab);
  updateDashboardSummary();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function updateDashboardSummary() {
  const dashboardTodayRevenue = document.getElementById("dashboardTodayRevenue");
  const dashboardTodayRevenueMeta = document.getElementById("dashboardTodayRevenueMeta");
  const dashboardPendingPayments = document.getElementById("dashboardPendingPayments");
  const dashboardPendingPaymentsMeta = document.getElementById("dashboardPendingPaymentsMeta");
  const dashboardActiveOrders = document.getElementById("dashboardActiveOrders");
  const dashboardActiveOrdersMeta = document.getElementById("dashboardActiveOrdersMeta");
  const dashboardLowStockAlerts = document.getElementById("dashboardLowStockAlerts");
  const dashboardLowStockAlertsMeta = document.getElementById("dashboardLowStockAlertsMeta");
  const dashboardCashBalance = document.getElementById("dashboardCashBalance");
  const dashboardCashBalanceMeta = document.getElementById("dashboardCashBalanceMeta");

  const todayRevenue = cashEntries
    .filter((entry) => isToday(entry.date) && isCashIn(entry.type))
    .reduce((sum, entry) => sum + moneyNumber(entry.amount), 0);

  const pendingPayments = customers.reduce((sum, customer) => sum + moneyNumber(customer.pendingBalance), 0);
  const followUpCustomers = customers.filter(needsFollowUp).length;
  const activeLeads = leads.filter((lead) => !["Closed", "Lost"].includes(lead.status)).length;
  const lowStockAlerts = customers.filter((customer) => totalLabelStock(customer) < 500).length;

  const cashIn = cashEntries
    .filter((entry) => isCashIn(entry.type))
    .reduce((sum, entry) => sum + moneyNumber(entry.amount), 0);
  const cashOut = cashEntries
    .filter((entry) => isCashOut(entry.type))
    .reduce((sum, entry) => sum + moneyNumber(entry.amount), 0);

  if (dashboardTodayRevenue) dashboardTodayRevenue.textContent = formatCurrency(todayRevenue);
  if (dashboardTodayRevenueMeta) dashboardTodayRevenueMeta.textContent = "From today's cash-in entries";
  if (dashboardPendingPayments) dashboardPendingPayments.textContent = formatCurrency(pendingPayments);
  if (dashboardPendingPaymentsMeta) dashboardPendingPaymentsMeta.textContent = `${customers.length} customer accounts`;
  if (dashboardActiveOrders) dashboardActiveOrders.textContent = String(activeLeads + followUpCustomers);
  if (dashboardActiveOrdersMeta) dashboardActiveOrdersMeta.textContent = `${activeLeads} active leads • ${followUpCustomers} customers need follow-up`;
  if (dashboardLowStockAlerts) dashboardLowStockAlerts.textContent = String(lowStockAlerts);
  if (dashboardLowStockAlertsMeta) dashboardLowStockAlertsMeta.textContent = "Customers below 500 labels";
  if (dashboardCashBalance) dashboardCashBalance.textContent = formatCurrency(cashIn - cashOut);
  if (dashboardCashBalanceMeta) dashboardCashBalanceMeta.textContent = "Cash-in minus expenses/credit";
}

/* LEADS */

function getFilteredLeads() {
  const query = leadSearchInput ? leadSearchInput.value.trim().toLowerCase() : "";
  let result = [...leads];

  if (query) {
    result = result.filter((lead) => {
      const text = [
        lead.businessName,
        lead.contactPerson,
        lead.phone,
        lead.whatsapp,
        lead.address,
        lead.businessType,
        lead.status,
        lead.notes
      ].join(" ").toLowerCase();

      return text.includes(query);
    });

    if (leadPipelineHead) leadPipelineHead.classList.add("hidden");
    if (leadFilterRow) leadFilterRow.classList.add("hidden");
  } else {
    if (leadPipelineHead) leadPipelineHead.classList.remove("hidden");
    if (leadFilterRow) leadFilterRow.classList.remove("hidden");

    if (activeLeadStatusFilter !== "All") {
      result = result.filter((lead) => lead.status === activeLeadStatusFilter);
    }
  }

  return result;
}

function renderLeadPipeline() {
  if (!leadPipelineList) return;

  const filteredLeads = getFilteredLeads();
  const query = leadSearchInput ? leadSearchInput.value.trim() : "";

  if (pipelineCount && !query) {
    pipelineCount.textContent = activeLeadStatusFilter === "All"
      ? `${filteredLeads.length} leads`
      : `${filteredLeads.length} ${activeLeadStatusFilter}`;
  }

  if (filteredLeads.length === 0) {
    leadPipelineList.innerHTML = `
      <div class="section-card glass round-lg empty-state">
        No leads found for this filter.
      </div>
    `;
    return;
  }

  leadPipelineList.innerHTML = filteredLeads.map((lead) => `
    <div class="lead-card glass round-lg">
      <div class="lead-top">
        <div>
          <div class="lead-name">${escapeHtml(lead.businessName)}</div>
          <div class="lead-person">${escapeHtml(lead.contactPerson)} • ${escapeHtml(lead.address)}</div>
        </div>
        <span class="status-badge ${statusClass(lead.status)}">${escapeHtml(lead.status)}</span>
      </div>

      <div class="lead-info">
        <div><i class="bi bi-telephone"></i> ${escapeHtml(lead.phone)}</div>
        <div><i class="bi bi-shop"></i> ${escapeHtml(lead.businessType)}</div>
        <div><i class="bi bi-calendar-event"></i> Follow-up: ${escapeHtml(lead.followUp)}</div>
      </div>

      <div class="lead-note">${escapeHtml(lead.notes)}</div>

      <div class="lead-actions">
        <a href="tel:${escapeHtml(cleanPhone(lead.phone))}">
          <i class="bi bi-telephone-fill"></i> Call
        </a>
        <a href="https://wa.me/${toWhatsAppNumber(lead.whatsapp || lead.phone)}" target="_blank">
          <i class="bi bi-whatsapp"></i> WhatsApp
        </a>
        <button data-edit-lead="${lead.id}">
          <i class="bi bi-pencil-square"></i> Edit
        </button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-edit-lead]").forEach((button) => {
    button.addEventListener("click", () => renderLeadEdit(button.getAttribute("data-edit-lead")));
  });
}

function updateLeadSummary() {
  const totalLeadCount = document.getElementById("totalLeadCount");
  const newLeadCount = document.getElementById("newLeadCount");
  const followUpCount = document.getElementById("followUpCount");
  const quotationCount = document.getElementById("quotationCount");

  if (totalLeadCount) totalLeadCount.textContent = String(leads.length).padStart(2, "0");

  if (newLeadCount) {
    newLeadCount.textContent = String(leads.filter((lead) => lead.status === "New").length).padStart(2, "0");
  }

  if (followUpCount) {
    followUpCount.textContent = String(leads.filter((lead) => Boolean(lead.followUp)).length).padStart(2, "0");
  }

  if (quotationCount) {
    quotationCount.textContent = String(leads.filter((lead) => lead.status === "Quotation Sent").length).padStart(2, "0");
  }
}

function getSummaryLeads(filter) {
  if (filter === "all") return leads;
  if (filter === "followups") return leads.filter((lead) => Boolean(lead.followUp));
  return leads.filter((lead) => lead.status === filter);
}

function createLeadOverlay() {
  if (document.getElementById("leadOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "leadOverlay";
  overlay.className = "lead-overlay hidden";
  overlay.innerHTML = `
    <div class="lead-panel glass">
      <div id="leadPanelContent"></div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function openLeadOverlay() {
  createLeadOverlay();
  document.getElementById("leadOverlay").classList.remove("hidden");
}

function closeLeadOverlay() {
  const overlay = document.getElementById("leadOverlay");
  if (overlay) overlay.classList.add("hidden");
}

function renderLeadList(filter = "all") {
  openLeadOverlay();

  const selectedLeads = getSummaryLeads(filter);
  const titleMap = {
    all: "Total Leads",
    New: "New Leads",
    followups: "Follow-Ups",
    "Quotation Sent": "Quotation Sent"
  };

  const content = document.getElementById("leadPanelContent");

  content.innerHTML = `
    <div class="lead-panel-head">
      <div>
        <div class="lead-panel-title">${titleMap[filter] || "Leads"}</div>
        <div class="lead-panel-sub">Tap a lead to view full details</div>
      </div>
      <button class="panel-close-btn" id="closeLeadPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="compact-lead-list">
      ${
        selectedLeads.length
          ? selectedLeads.map((lead) => `
              <button class="compact-lead-item" data-lead-id="${lead.id}">
                <div>
                  <div class="compact-lead-name">${escapeHtml(lead.businessName)}</div>
                  <div class="compact-lead-address">${escapeHtml(lead.address)}</div>
                </div>
                <i class="bi bi-chevron-right"></i>
              </button>
            `).join("")
          : `<div class="empty-state">No leads found.</div>`
      }
    </div>
  `;

  document.getElementById("closeLeadPanel").addEventListener("click", closeLeadOverlay);

  document.querySelectorAll(".compact-lead-item").forEach((item) => {
    item.addEventListener("click", () => {
      renderLeadDetail(item.getAttribute("data-lead-id"), filter);
    });
  });
}

function renderLeadDetail(leadId, returnFilter = "all") {
  openLeadOverlay();

  const lead = leads.find((item) => item.id === leadId);
  if (!lead) return;

  const content = document.getElementById("leadPanelContent");

  content.innerHTML = `
    <div class="lead-panel-head">
      <div>
        <div class="lead-panel-title">${escapeHtml(lead.businessName)}</div>
        <div class="lead-panel-sub">${escapeHtml(lead.address)}</div>
      </div>
      <button class="panel-close-btn" id="closeLeadPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="lead-panel-head">
      <button class="panel-back-btn" id="backToLeadList">
        <i class="bi bi-arrow-left"></i> Back
      </button>
      <button class="panel-edit-btn" id="editLeadBtn">
        <i class="bi bi-pencil-square"></i> Edit Lead
      </button>
    </div>

    <div class="lead-detail-grid">
      <div class="lead-detail-row">
        <div class="detail-label">Business Name</div>
        <div class="detail-value">${escapeHtml(lead.businessName)}</div>
      </div>
      <div class="lead-detail-row">
        <div class="detail-label">Contact Person</div>
        <div class="detail-value">${escapeHtml(lead.contactPerson)}</div>
      </div>
      <div class="lead-detail-row">
        <div class="detail-label">Phone Number</div>
        <div class="detail-value">${escapeHtml(lead.phone)}</div>
      </div>
      <div class="lead-detail-row">
        <div class="detail-label">WhatsApp Number</div>
        <div class="detail-value">${escapeHtml(lead.whatsapp)}</div>
      </div>
      <div class="lead-detail-row">
        <div class="detail-label">Address / Location</div>
        <div class="detail-value">${escapeHtml(lead.address)}</div>
      </div>
      <div class="lead-detail-row">
        <div class="detail-label">Business Type</div>
        <div class="detail-value">${escapeHtml(lead.businessType)}</div>
      </div>
      <div class="lead-detail-row">
        <div class="detail-label">Lead Status</div>
        <div class="detail-value">${escapeHtml(lead.status)}</div>
      </div>
      <div class="lead-detail-row">
        <div class="detail-label">Follow-up Date</div>
        <div class="detail-value">${escapeHtml(lead.followUp)}</div>
      </div>
      <div class="lead-detail-row">
        <div class="detail-label">Notes</div>
        <div class="detail-value">${escapeHtml(lead.notes)}</div>
      </div>
    </div>
  `;

  document.getElementById("closeLeadPanel").addEventListener("click", closeLeadOverlay);
  document.getElementById("backToLeadList").addEventListener("click", () => renderLeadList(returnFilter));
  document.getElementById("editLeadBtn").addEventListener("click", () => renderLeadEdit(leadId, returnFilter));
}

function renderLeadEdit(leadId, returnFilter = "all") {
  openLeadOverlay();

  const isNewLead = !leadId;
  const lead = leads.find((item) => item.id === leadId) || {
    id: `lead-${Date.now()}`,
    businessName: "",
    contactPerson: "",
    phone: "",
    whatsapp: "",
    address: "",
    businessType: "Café",
    status: "New",
    followUp: "",
    notes: ""
  };

  const content = document.getElementById("leadPanelContent");

  content.innerHTML = `
    <div class="lead-panel-head">
      <div>
        <div class="lead-panel-title">${isNewLead ? "Add New Lead" : "Edit Lead"}</div>
        <div class="lead-panel-sub">${isNewLead ? "Create a fresh prospect record" : escapeHtml(lead.businessName)}</div>
      </div>
      <button class="panel-close-btn" id="closeLeadPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <form class="lead-edit-form" id="leadEditForm">
      <label>Business Name<input name="businessName" value="${escapeHtml(lead.businessName)}" required /></label>
      <label>Contact Person<input name="contactPerson" value="${escapeHtml(lead.contactPerson)}" /></label>
      <label>Phone Number<input name="phone" value="${escapeHtml(lead.phone)}" /></label>
      <label>WhatsApp Number<input name="whatsapp" value="${escapeHtml(lead.whatsapp)}" /></label>
      <label>Address / Location<input name="address" value="${escapeHtml(lead.address)}" /></label>

      <label>
        Business Type
        <select name="businessType">
          ${["Café", "Restaurant", "Hotel", "Event", "Office", "Retail", "Other"].map((type) => `
            <option value="${type}" ${lead.businessType === type ? "selected" : ""}>${type}</option>
          `).join("")}
        </select>
      </label>

      <label>
        Status
        <select name="status">
          ${["New", "Contacted", "Quotation Sent", "Negotiating", "Closed", "Lost"].map((status) => `
            <option value="${status}" ${lead.status === status ? "selected" : ""}>${status}</option>
          `).join("")}
        </select>
      </label>

      <label>Follow-up Date<input name="followUp" value="${escapeHtml(lead.followUp)}" /></label>
      <label>Notes<textarea name="notes">${escapeHtml(lead.notes)}</textarea></label>

      <button class="panel-save-btn" type="submit">
        <i class="bi bi-check2-circle"></i> Save Lead
      </button>
    </form>
  `;

  document.getElementById("closeLeadPanel").addEventListener("click", closeLeadOverlay);

  document.getElementById("leadEditForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    const updatedLead = {
      id: lead.id,
      businessName: form.get("businessName"),
      contactPerson: form.get("contactPerson"),
      phone: form.get("phone"),
      whatsapp: form.get("whatsapp") || toWhatsAppNumber(form.get("phone")),
      address: form.get("address"),
      businessType: form.get("businessType"),
      status: form.get("status"),
      followUp: form.get("followUp"),
      notes: form.get("notes")
    };

    if (isNewLead) {
      leads.unshift(updatedLead);
    } else {
      leads = leads.map((item) => item.id === lead.id ? updatedLead : item);
    }

    saveLeads();
    updateLeadSummary();
    renderLeadPipeline();
    renderLeadDetail(updatedLead.id, returnFilter);
  });
}

/* CUSTOMERS */

function getClosedLeads() {
  return leads.filter((lead) => lead.status === "Closed");
}

function getCustomerFilteredList() {
  const query = customerSearchInput ? customerSearchInput.value.trim().toLowerCase() : "";
  let result = [...customers];

  if (query) {
    result = result.filter((customer) => {
      const text = [
        customer.businessName,
        customer.brandName,
        customer.contactPerson,
        customer.phone,
        customer.whatsapp,
        customer.address,
        customer.notes
      ].join(" ").toLowerCase();

      return text.includes(query);
    });

    if (customerListHead) customerListHead.classList.add("hidden");
  } else {
    if (customerListHead) customerListHead.classList.remove("hidden");

    if (activeCustomerFilter === "followup") {
      result = result.filter(needsFollowUp);
    }

    if (activeCustomerFilter === "lowStock") {
      result = result.filter((customer) => totalLabelStock(customer) < 500);
    }

    if (activeCustomerFilter === "pending") {
      result = result.filter((customer) => moneyNumber(customer.pendingBalance) > 0);
    }
  }

  return result;
}

function renderCustomerList() {
  if (!customerList) return;

  const filteredCustomers = getCustomerFilteredList();
  const query = customerSearchInput ? customerSearchInput.value.trim() : "";

  if (customerListCount && !query) {
    const labelMap = {
      all: "All customers",
      followup: "Need follow-up",
      lowStock: "Low stock customers",
      pending: "Pending pay customers"
    };
    customerListCount.textContent = labelMap[activeCustomerFilter] || "All customers";
  }

  if (filteredCustomers.length === 0) {
    customerList.innerHTML = `
      <div class="section-card glass round-lg empty-state">
        No customers found.
      </div>
    `;
    return;
  }

  customerList.innerHTML = filteredCustomers.map((customer) => customerCardTemplate(customer)).join("");

  document.querySelectorAll("[data-edit-customer]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      renderCustomerEdit(button.getAttribute("data-edit-customer"));
    });
  });

  document.querySelectorAll("[data-view-customer]").forEach((card) => {
    card.addEventListener("click", () => {
      renderCustomerDetail(card.getAttribute("data-view-customer"), activeCustomerFilter);
    });
  });
}

function customerCardTemplate(customer) {
  const badge = getCustomerBadge(customer);
  const totalStock = totalLabelStock(customer);
  const reminderNeeded = needsReminder(customer);

  return `
    <div class="customer-card glass round-lg" data-view-customer="${escapeHtml(customer.id)}">
      <div class="customer-top">
        <div>
          <div class="customer-name">${escapeHtml(customer.brandName || customer.businessName)}</div>
          <div class="customer-person">${escapeHtml(customer.contactPerson)} • ${escapeHtml(customer.address)}</div>
        </div>
        <span class="customer-badge ${badge.className}">${badge.label}</span>
      </div>

      <div class="customer-info">
        <div><i class="bi bi-person-badge"></i> ${escapeHtml(customer.id)}</div>
        <div><i class="bi bi-calendar-event"></i> Last order: ${escapeHtml(customer.lastOrderDate || "No order yet")}</div>
        <div><i class="bi bi-credit-card"></i> Pending: ${formatCurrency(customer.pendingBalance)}</div>
        <div><i class="bi bi-wallet2"></i> Credit: ${formatCurrency(customer.creditBalance)}</div>
      </div>

      <div class="customer-stock">
        <div>Remaining Labels: <strong>${totalStock}</strong></div>
        <div class="stock-grid">
          <div class="stock-pill">
            <div class="stock-size">500ml</div>
            <div class="stock-count">${escapeHtml(customer.stock500 || 0)}</div>
          </div>
          <div class="stock-pill">
            <div class="stock-size">1000ml</div>
            <div class="stock-count">${escapeHtml(customer.stock1000 || 0)}</div>
          </div>
          <div class="stock-pill">
            <div class="stock-size">1500ml</div>
            <div class="stock-count">${escapeHtml(customer.stock1500 || 0)}</div>
          </div>
        </div>
      </div>

      <div class="customer-price-grid">
        <div>Unit Prices</div>
        <div class="price-grid">
          <div class="price-pill">
            <div class="price-size">500ml</div>
            <div class="price-count">${formatCurrency(customer.normal500)}</div>
          </div>
          <div class="price-pill">
            <div class="price-size">1000ml</div>
            <div class="price-count">${formatCurrency(customer.normal1000)}</div>
          </div>
          <div class="price-pill">
            <div class="price-size">1500ml</div>
            <div class="price-count">${formatCurrency(customer.normal1500)}</div>
          </div>
        </div>
        <div class="price-caption">
          After advance: 500ml ${formatCurrency(customer.afterAdvance500)} •
          1000ml ${formatCurrency(customer.afterAdvance1000)} •
          1500ml ${formatCurrency(customer.afterAdvance1500)}
        </div>
      </div>

      ${
        reminderNeeded
          ? `
            <div class="customer-mini-alert">
              <div>
                <strong>Attention needed</strong>
                <span>${getReminderReason(customer)}</span>
              </div>
              <i class="bi bi-bell"></i>
            </div>
          `
          : ""
      }

      <div class="customer-actions">
        <a href="tel:${escapeHtml(cleanPhone(customer.phone))}" onclick="event.stopPropagation()">
          <i class="bi bi-telephone-fill"></i> Call
        </a>
        <a href="https://wa.me/${toWhatsAppNumber(customer.whatsapp || customer.phone)}" target="_blank" onclick="event.stopPropagation()">
          <i class="bi bi-whatsapp"></i> WhatsApp
        </a>
        ${
          reminderNeeded
            ? `
              <a class="remind-button" href="${escapeHtml(whatsappReminderLink(customer))}" target="_blank" onclick="event.stopPropagation()">
                <i class="bi bi-bell-fill"></i> Remind
              </a>
            `
            : `
              <button data-edit-customer="${escapeHtml(customer.id)}">
                <i class="bi bi-pencil-square"></i> Edit
              </button>
            `
        }
      </div>
    </div>
  `;
}

function getReminderReason(customer) {
  if (moneyNumber(customer.pendingBalance) > 0) return `Pending balance ${formatCurrency(customer.pendingBalance)}`;
  if (moneyNumber(customer.creditBalance) > 0) return `Credit balance ${formatCurrency(customer.creditBalance)}`;
  if (totalLabelStock(customer) < 500) return `Label stock below 500`;
  return "Follow-up recommended";
}

function customerSummaryMessage(customer) {
  const history = customer.orderHistory || [];
  const historyText = history.length
    ? history.map((order) => `• ${order.date}: ${order.item}, Qty ${order.quantity}, Total ${formatCurrency(order.total)}, Paid ${formatCurrency(order.paid)}, Pending ${formatCurrency(order.pending)}`).join("\n")
    : "No order history recorded yet.";

  return `Hello ${customer.contactPerson || customer.businessName},

This is Pure Custom Creation.

Customer: ${customer.brandName || customer.businessName}
Pending balance: ${formatCurrency(customer.pendingBalance)}
Credit balance: ${formatCurrency(customer.creditBalance)}
Remaining label stock: ${totalLabelStock(customer)}

Order history:
${historyText}

Thank you.`;
}

function pendingReminderMessage(customer) {
  return `Hello ${customer.contactPerson || customer.businessName},

This is Pure Custom Creation.

Your current pending balance is ${formatCurrency(customer.pendingBalance)}.
Please arrange the payment when possible.

Thank you.`;
}

function creditReminderMessage(customer) {
  return `Hello ${customer.contactPerson || customer.businessName},

This is Pure Custom Creation.

Your current credit/cash balance record is ${formatCurrency(customer.creditBalance)}.
Please confirm this balance when possible.

Thank you.`;
}

function stockReminderMessage(customer) {
  return `Hello ${customer.contactPerson || customer.businessName},

This is Pure Custom Creation.

Your current label stock is below 500 labels.
Remaining label stock: ${totalLabelStock(customer)}

Please confirm whether you would like to print the next label batch.

Thank you.`;
}

function whatsappLink(customer, message) {
  return `https://wa.me/${toWhatsAppNumber(customer.whatsapp || customer.phone)}?text=${encodeURIComponent(message)}`;
}

function whatsappReminderLink(customer) {
  if (moneyNumber(customer.pendingBalance) > 0) return whatsappLink(customer, pendingReminderMessage(customer));
  if (moneyNumber(customer.creditBalance) > 0) return whatsappLink(customer, creditReminderMessage(customer));
  if (totalLabelStock(customer) < 500) return whatsappLink(customer, stockReminderMessage(customer));
  return whatsappLink(customer, customerSummaryMessage(customer));
}

function updateCustomerSummary() {
  const totalCustomerCount = document.getElementById("totalCustomerCount");
  const followupCustomerCount = document.getElementById("followupCustomerCount");
  const lowStockCustomerCount = document.getElementById("lowStockCustomerCount");
  const pendingCustomerTotal = document.getElementById("pendingCustomerTotal");

  if (totalCustomerCount) totalCustomerCount.textContent = String(customers.length).padStart(2, "0");

  if (followupCustomerCount) {
    followupCustomerCount.textContent = String(customers.filter(needsFollowUp).length).padStart(2, "0");
  }

  if (lowStockCustomerCount) {
    lowStockCustomerCount.textContent = String(customers.filter((c) => totalLabelStock(c) < 500).length).padStart(2, "0");
  }

  if (pendingCustomerTotal) {
    const totalPending = customers.reduce((sum, customer) => sum + moneyNumber(customer.pendingBalance), 0);
    pendingCustomerTotal.textContent = formatCurrency(totalPending);
  }
}

function createCustomerOverlay() {
  if (document.getElementById("customerOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "customerOverlay";
  overlay.className = "customer-overlay hidden";
  overlay.innerHTML = `
    <div class="customer-panel glass">
      <div id="customerPanelContent"></div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function openCustomerOverlay() {
  createCustomerOverlay();
  document.getElementById("customerOverlay").classList.remove("hidden");
}

function closeCustomerOverlay() {
  const overlay = document.getElementById("customerOverlay");
  if (overlay) overlay.classList.add("hidden");
}

function renderClosedLeadSelector() {
  openCustomerOverlay();

  const closedLeads = getClosedLeads();
  const content = document.getElementById("customerPanelContent");

  content.innerHTML = `
    <div class="customer-panel-head">
      <div>
        <div class="customer-panel-title">Closed Leads</div>
        <div class="customer-panel-sub">Select a closed lead to create customer</div>
      </div>
      <button class="panel-close-btn" id="closeCustomerPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="closed-leads-list">
      ${
        closedLeads.length
          ? closedLeads.map((lead) => `
            <button class="closed-lead-item" data-closed-lead="${lead.id}">
              <div>
                <div class="closed-lead-name">${escapeHtml(lead.businessName)}</div>
                <div class="closed-lead-address">${escapeHtml(lead.contactPerson)} • ${escapeHtml(lead.address)}</div>
              </div>
              <i class="bi bi-chevron-right"></i>
            </button>
          `).join("")
          : `<div class="empty-state">No closed leads found. Change a lead status to Closed first.</div>`
      }
    </div>
  `;

  document.getElementById("closeCustomerPanel").addEventListener("click", closeCustomerOverlay);

  document.querySelectorAll("[data-closed-lead]").forEach((button) => {
    button.addEventListener("click", () => {
      renderCustomerCreateFromLead(button.getAttribute("data-closed-lead"));
    });
  });
}

function renderCustomerCreateFromLead(leadId) {
  const lead = leads.find((item) => item.id === leadId);
  if (!lead) return;

  openCustomerOverlay();

  const content = document.getElementById("customerPanelContent");

  content.innerHTML = `
    <div class="customer-panel-head">
      <div>
        <div class="customer-panel-title">Create Customer</div>
        <div class="customer-panel-sub">${escapeHtml(lead.businessName)} • ${escapeHtml(lead.address)}</div>
      </div>
      <button class="panel-close-btn" id="closeCustomerPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <form class="customer-edit-form" id="customerCreateForm">
      <label>Customer ID<input name="id" value="CUS-${String(Date.now()).slice(-4)}" required /></label>
      <label>Business Name<input name="businessName" value="${escapeHtml(lead.businessName)}" required /></label>
      <label>Brand Name<input name="brandName" value="${escapeHtml(lead.businessName)}" required /></label>
      <label>Contact Person<input name="contactPerson" value="${escapeHtml(lead.contactPerson)}" /></label>
      <label>Phone Number<input name="phone" value="${escapeHtml(lead.phone)}" /></label>
      <label>WhatsApp Number<input name="whatsapp" value="${escapeHtml(lead.whatsapp)}" /></label>
      <label>Address / Location<input name="address" value="${escapeHtml(lead.address)}" /></label>

      <div class="form-grid-2">
        <label>Advance Payment Date<input name="advanceDate" placeholder="02 May 2026" /></label>
        <label>Advance Amount<input name="advanceAmount" type="number" placeholder="15000" /></label>
      </div>

      <div class="form-grid-2">
        <label>Pending Balance<input name="pendingBalance" type="number" value="0" /></label>
        <label>Credit Balance<input name="creditBalance" type="number" value="0" /></label>
      </div>

      <label>Last Order Date<input name="lastOrderDate" placeholder="02 May 2026" /></label>
      <label>Last Contacted Date<input name="lastContactedDate" placeholder="02 May 2026" /></label>

      <div class="form-grid-2">
        <label>500ml Labels<input name="stock500" type="number" value="0" /></label>
        <label>1000ml Labels<input name="stock1000" type="number" value="0" /></label>
      </div>

      <label>1500ml Labels<input name="stock1500" type="number" value="0" /></label>

      <div class="form-grid-2">
        <label>500ml Unit Price<input name="normal500" type="number" value="50" /></label>
        <label>After Advance 500ml<input name="afterAdvance500" type="number" value="47" /></label>
      </div>

      <div class="form-grid-2">
        <label>1000ml Unit Price<input name="normal1000" type="number" value="80" /></label>
        <label>After Advance 1000ml<input name="afterAdvance1000" type="number" value="75.5" /></label>
      </div>

      <div class="form-grid-2">
        <label>1500ml Unit Price<input name="normal1500" type="number" value="100" /></label>
        <label>After Advance 1500ml<input name="afterAdvance1500" type="number" value="95.5" /></label>
      </div>

      <label>Notes<textarea name="notes">${escapeHtml(lead.notes || "")}</textarea></label>

      <button class="panel-save-btn" type="submit">
        <i class="bi bi-check2-circle"></i> Save Customer
      </button>
    </form>
  `;

  document.getElementById("closeCustomerPanel").addEventListener("click", closeCustomerOverlay);

  document.getElementById("customerCreateForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const newCustomer = formToCustomer(form, lead.id);

    customers.unshift(newCustomer);
    saveCustomers();
    updateCustomerSummary();
    renderCustomerList();
    renderCustomerDetail(newCustomer.id, "all");
  });
}

function formToCustomer(form, leadId = "") {
  return {
    id: form.get("id"),
    leadId,
    businessName: form.get("businessName"),
    brandName: form.get("brandName"),
    contactPerson: form.get("contactPerson"),
    phone: form.get("phone"),
    whatsapp: form.get("whatsapp") || toWhatsAppNumber(form.get("phone")),
    address: form.get("address"),
    advanceDate: form.get("advanceDate"),
    advanceAmount: form.get("advanceAmount"),
    pendingBalance: form.get("pendingBalance"),
    creditBalance: form.get("creditBalance"),
    lastOrderDate: form.get("lastOrderDate"),
    lastContactedDate: form.get("lastContactedDate"),
    stock500: form.get("stock500"),
    stock1000: form.get("stock1000"),
    stock1500: form.get("stock1500"),
    normal500: form.get("normal500"),
    normal1000: form.get("normal1000"),
    normal1500: form.get("normal1500"),
    afterAdvance500: form.get("afterAdvance500"),
    afterAdvance1000: form.get("afterAdvance1000"),
    afterAdvance1500: form.get("afterAdvance1500"),
    notes: form.get("notes"),
    orderHistory: []
  };
}

function renderCustomerCompactList(filter = "all") {
  openCustomerOverlay();

  const selectedCustomers = getCustomerGroup(filter);
  const titleMap = {
    all: "Total Customers",
    followup: "Follow-up Customers",
    lowStock: "Low Stock Customers",
    pending: "Pending Pay Customers"
  };

  const content = document.getElementById("customerPanelContent");

  content.innerHTML = `
    <div class="customer-panel-head">
      <div>
        <div class="customer-panel-title">${titleMap[filter] || "Customers"}</div>
        <div class="customer-panel-sub">Tap a customer to view order history</div>
      </div>
      <button class="panel-close-btn" id="closeCustomerPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="compact-customer-list">
      ${
        selectedCustomers.length
          ? selectedCustomers.map((customer) => `
              <button class="compact-customer-item" data-customer-id="${escapeHtml(customer.id)}">
                <div>
                  <div class="compact-customer-name">${escapeHtml(customer.brandName || customer.businessName)}</div>
                  <div class="compact-customer-address">${escapeHtml(customer.address)}</div>
                </div>
                <i class="bi bi-chevron-right"></i>
              </button>
            `).join("")
          : `<div class="empty-state">No customers found.</div>`
      }
    </div>
  `;

  document.getElementById("closeCustomerPanel").addEventListener("click", closeCustomerOverlay);

  document.querySelectorAll(".compact-customer-item").forEach((item) => {
    item.addEventListener("click", () => {
      renderCustomerDetail(item.getAttribute("data-customer-id"), filter);
    });
  });
}

function getCustomerGroup(filter) {
  if (filter === "followup") return customers.filter(needsFollowUp);
  if (filter === "lowStock") return customers.filter((customer) => totalLabelStock(customer) < 500);
  if (filter === "pending") return customers.filter((customer) => moneyNumber(customer.pendingBalance) > 0);
  return customers;
}

function renderCustomerDetail(customerId, returnFilter = "all") {
  openCustomerOverlay();

  const customer = customers.find((item) => item.id === customerId);
  if (!customer) return;

  const content = document.getElementById("customerPanelContent");
  const history = customer.orderHistory || [];

  content.innerHTML = `
    <div class="customer-panel-head">
      <div>
        <div class="customer-panel-title">${escapeHtml(customer.brandName || customer.businessName)}</div>
        <div class="customer-panel-sub">${escapeHtml(customer.id)} • ${escapeHtml(customer.address)}</div>
      </div>
      <button class="panel-close-btn" id="closeCustomerPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="customer-panel-head">
      <button class="panel-back-btn" id="backToCustomerList">
        <i class="bi bi-arrow-left"></i> Back
      </button>
      <button class="panel-edit-btn" id="editCustomerBtn">
        <i class="bi bi-pencil-square"></i> Edit
      </button>
    </div>

    <div class="customer-detail-grid">
      <div class="customer-detail-row">
        <div class="detail-label">Balances</div>
        <div class="detail-value">Pending: ${formatCurrency(customer.pendingBalance)} • Credit: ${formatCurrency(customer.creditBalance)}</div>
      </div>

      <div class="customer-detail-row">
        <div class="detail-label">Label Stock</div>
        <div class="detail-value">Total ${totalLabelStock(customer)} • 500ml ${escapeHtml(customer.stock500)}, 1000ml ${escapeHtml(customer.stock1000)}, 1500ml ${escapeHtml(customer.stock1500)}</div>
      </div>

      <div class="customer-detail-row">
        <div class="detail-label">Advance Payment</div>
        <div class="detail-value">${formatCurrency(customer.advanceAmount)} on ${escapeHtml(customer.advanceDate || "Not set")}</div>
      </div>

      <div class="customer-detail-row">
        <div class="detail-label">Unit Prices</div>
        <div class="detail-value small">
          Normal: 500ml ${formatCurrency(customer.normal500)}, 1000ml ${formatCurrency(customer.normal1000)}, 1500ml ${formatCurrency(customer.normal1500)}<br>
          After advance: 500ml ${formatCurrency(customer.afterAdvance500)}, 1000ml ${formatCurrency(customer.afterAdvance1000)}, 1500ml ${formatCurrency(customer.afterAdvance1500)}
        </div>
      </div>

      <div class="customer-detail-row">
        <div class="detail-label">Notes</div>
        <div class="detail-value">${escapeHtml(customer.notes || "No notes.")}</div>
      </div>
    </div>

    <div class="reminder-card">
      <div class="reminder-title">WhatsApp Templates</div>
      <div class="reminder-text">Send order summary, pending payment reminder, or label stock reminder.</div>
      <div class="reminder-actions">
        <a href="${escapeHtml(whatsappLink(customer, customerSummaryMessage(customer)))}" target="_blank">
          <i class="bi bi-list-check"></i> Summary
        </a>
        <a href="${escapeHtml(whatsappLink(customer, pendingReminderMessage(customer)))}" target="_blank">
          <i class="bi bi-credit-card"></i> Pending
        </a>
        <a href="${escapeHtml(whatsappLink(customer, stockReminderMessage(customer)))}" target="_blank">
          <i class="bi bi-tags"></i> Stock
        </a>
      </div>
    </div>

    <div class="section-head">
      <h3>Order History</h3>
      <span>${history.length} records</span>
    </div>

    ${
      history.length
        ? history.map((order) => `
          <div class="order-history-card">
            <div class="order-history-top">
              <div class="order-date">${escapeHtml(order.date)}</div>
              <div class="order-amount">${formatCurrency(order.total)}</div>
            </div>
            <div class="order-meta">
              <div>${escapeHtml(order.item)} • Qty ${escapeHtml(order.quantity)}</div>
              <div>Paid: ${formatCurrency(order.paid)} • Pending: ${formatCurrency(order.pending)}</div>
              <div>${escapeHtml(order.note)}</div>
            </div>
          </div>
        `).join("")
        : `<div class="empty-state">No order history yet.</div>`
    }
  `;

  document.getElementById("closeCustomerPanel").addEventListener("click", closeCustomerOverlay);
  document.getElementById("backToCustomerList").addEventListener("click", () => renderCustomerCompactList(returnFilter));
  document.getElementById("editCustomerBtn").addEventListener("click", () => renderCustomerEdit(customerId, returnFilter));
}

function renderCustomerEdit(customerId, returnFilter = "all") {
  openCustomerOverlay();

  const customer = customers.find((item) => item.id === customerId);
  if (!customer) return;

  const content = document.getElementById("customerPanelContent");

  content.innerHTML = `
    <div class="customer-panel-head">
      <div>
        <div class="customer-panel-title">Edit Customer</div>
        <div class="customer-panel-sub">${escapeHtml(customer.brandName || customer.businessName)}</div>
      </div>
      <button class="panel-close-btn" id="closeCustomerPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <form class="customer-edit-form" id="customerEditForm">
      <label>Customer ID<input name="id" value="${escapeHtml(customer.id)}" required /></label>
      <label>Business Name<input name="businessName" value="${escapeHtml(customer.businessName)}" required /></label>
      <label>Brand Name<input name="brandName" value="${escapeHtml(customer.brandName)}" required /></label>
      <label>Contact Person<input name="contactPerson" value="${escapeHtml(customer.contactPerson)}" /></label>
      <label>Phone Number<input name="phone" value="${escapeHtml(customer.phone)}" /></label>
      <label>WhatsApp Number<input name="whatsapp" value="${escapeHtml(customer.whatsapp)}" /></label>
      <label>Address / Location<input name="address" value="${escapeHtml(customer.address)}" /></label>

      <div class="form-grid-2">
        <label>Advance Payment Date<input name="advanceDate" value="${escapeHtml(customer.advanceDate)}" /></label>
        <label>Advance Amount<input name="advanceAmount" type="number" value="${escapeHtml(customer.advanceAmount)}" /></label>
      </div>

      <div class="form-grid-2">
        <label>Pending Balance<input name="pendingBalance" type="number" value="${escapeHtml(customer.pendingBalance)}" /></label>
        <label>Credit Balance<input name="creditBalance" type="number" value="${escapeHtml(customer.creditBalance)}" /></label>
      </div>

      <label>Last Order Date<input name="lastOrderDate" value="${escapeHtml(customer.lastOrderDate)}" /></label>
      <label>Last Contacted Date<input name="lastContactedDate" value="${escapeHtml(customer.lastContactedDate)}" /></label>

      <div class="form-grid-2">
        <label>500ml Labels<input name="stock500" type="number" value="${escapeHtml(customer.stock500)}" /></label>
        <label>1000ml Labels<input name="stock1000" type="number" value="${escapeHtml(customer.stock1000)}" /></label>
      </div>

      <label>1500ml Labels<input name="stock1500" type="number" value="${escapeHtml(customer.stock1500)}" /></label>

      <div class="form-grid-2">
        <label>500ml Unit Price<input name="normal500" type="number" value="${escapeHtml(customer.normal500)}" /></label>
        <label>After Advance 500ml<input name="afterAdvance500" type="number" value="${escapeHtml(customer.afterAdvance500)}" /></label>
      </div>

      <div class="form-grid-2">
        <label>1000ml Unit Price<input name="normal1000" type="number" value="${escapeHtml(customer.normal1000)}" /></label>
        <label>After Advance 1000ml<input name="afterAdvance1000" type="number" value="${escapeHtml(customer.afterAdvance1000)}" /></label>
      </div>

      <div class="form-grid-2">
        <label>1500ml Unit Price<input name="normal1500" type="number" value="${escapeHtml(customer.normal1500)}" /></label>
        <label>After Advance 1500ml<input name="afterAdvance1500" type="number" value="${escapeHtml(customer.afterAdvance1500)}" /></label>
      </div>

      <label>Notes<textarea name="notes">${escapeHtml(customer.notes || "")}</textarea></label>

      <button class="panel-save-btn" type="submit">
        <i class="bi bi-check2-circle"></i> Save Customer
      </button>
    </form>
  `;

  document.getElementById("closeCustomerPanel").addEventListener("click", closeCustomerOverlay);

  document.getElementById("customerEditForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(event.target);
    const updatedCustomer = {
      ...formToCustomer(form, customer.leadId),
      orderHistory: customer.orderHistory || []
    };

    customers = customers.map((item) => item.id === customer.id ? updatedCustomer : item);

    saveCustomers();
    updateCustomerSummary();
    renderCustomerList();
    renderCustomerDetail(updatedCustomer.id, returnFilter);
  });
}

/* CASH BALANCE */

function getFilteredCashEntries() {
  const query = cashSearchInput ? cashSearchInput.value.trim().toLowerCase() : "";
  let result = [...cashEntries];

  if (query) {
    result = result.filter((entry) => {
      const text = [
        entry.type,
        entry.customer,
        entry.amount,
        entry.date,
        entry.method,
        entry.note
      ].join(" ").toLowerCase();

      return text.includes(query);
    });

    if (cashListHead) cashListHead.classList.add("hidden");
    if (cashFilterRow) cashFilterRow.classList.add("hidden");
  } else {
    if (cashListHead) cashListHead.classList.remove("hidden");
    if (cashFilterRow) cashFilterRow.classList.remove("hidden");

    if (activeCashTypeFilter !== "All") {
      result = result.filter((entry) => entry.type === activeCashTypeFilter);
    }
  }

  return result;
}

function updateCashSummary() {
  const availableCashValue = document.getElementById("availableCashValue");
  const todayCollectedValue = document.getElementById("todayCollectedValue");
  const pendingCollectionValue = document.getElementById("pendingCollectionValue");
  const creditGivenValue = document.getElementById("creditGivenValue");

  const monthlyIncomeValue = document.getElementById("monthlyIncomeValue");
  const monthlyExpenseValue = document.getElementById("monthlyExpenseValue");
  const netCashValue = document.getElementById("netCashValue");

  const cashIn = cashEntries
    .filter((entry) => isCashIn(entry.type))
    .reduce((sum, entry) => sum + moneyNumber(entry.amount), 0);

  const cashOut = cashEntries
    .filter((entry) => isCashOut(entry.type))
    .reduce((sum, entry) => sum + moneyNumber(entry.amount), 0);

  const todayCollected = cashEntries
    .filter((entry) => isToday(entry.date) && isCashIn(entry.type))
    .reduce((sum, entry) => sum + moneyNumber(entry.amount), 0);

  const pendingCollections = customers.reduce((sum, customer) => sum + moneyNumber(customer.pendingBalance), 0);
  const creditGiven = customers.reduce((sum, customer) => sum + moneyNumber(customer.creditBalance), 0);

  const monthIncome = cashEntries
    .filter((entry) => isThisMonth(entry.date) && isCashIn(entry.type))
    .reduce((sum, entry) => sum + moneyNumber(entry.amount), 0);

  const monthExpenses = cashEntries
    .filter((entry) => isThisMonth(entry.date) && isCashOut(entry.type))
    .reduce((sum, entry) => sum + moneyNumber(entry.amount), 0);

  if (availableCashValue) availableCashValue.textContent = formatCurrency(cashIn - cashOut);
  if (todayCollectedValue) todayCollectedValue.textContent = formatCurrency(todayCollected);
  if (pendingCollectionValue) pendingCollectionValue.textContent = formatCurrency(pendingCollections);
  if (creditGivenValue) creditGivenValue.textContent = formatCurrency(creditGiven);

  if (monthlyIncomeValue) monthlyIncomeValue.textContent = formatCurrency(monthIncome);
  if (monthlyExpenseValue) monthlyExpenseValue.textContent = formatCurrency(monthExpenses);
  if (netCashValue) netCashValue.textContent = formatCurrency(monthIncome - monthExpenses);
}

function renderCashEntries() {
  if (!cashEntryList) return;

  const filteredEntries = getFilteredCashEntries();
  const query = cashSearchInput ? cashSearchInput.value.trim() : "";

  if (cashListCount && !query) {
    cashListCount.textContent = activeCashTypeFilter === "All"
      ? `${filteredEntries.length} entries`
      : `${filteredEntries.length} ${activeCashTypeFilter}`;
  }

  if (filteredEntries.length === 0) {
    cashEntryList.innerHTML = `
      <div class="section-card glass round-lg empty-state">
        No cash entries found.
      </div>
    `;
    return;
  }

  cashEntryList.innerHTML = filteredEntries.map((entry) => `
    <div class="cash-entry-card glass round-lg">
      <div class="cash-entry-top">
        <div>
          <div class="cash-entry-title">${escapeHtml(entry.customer || "General")}</div>
          <div class="cash-entry-sub">${escapeHtml(entry.date)} • ${escapeHtml(entry.method)}</div>
        </div>
        <span class="cash-badge ${cashTypeClass(entry.type)}">${escapeHtml(entry.type)}</span>
      </div>

      <div class="cash-entry-info">
        <div><i class="bi bi-cash"></i> Amount: <strong class="cash-entry-amount ${isCashIn(entry.type) ? "in" : "out"}">${formatCurrency(entry.amount)}</strong></div>
        <div><i class="bi bi-credit-card"></i> Method: <span class="cash-method-pill">${escapeHtml(entry.method)}</span></div>
      </div>

      <div class="cash-entry-note">${escapeHtml(entry.note || "No note.")}</div>

      <div class="cash-entry-actions">
        <button data-edit-cash="${entry.id}">
          <i class="bi bi-pencil-square"></i> Edit
        </button>
        <button data-delete-cash="${entry.id}">
          <i class="bi bi-trash"></i> Delete
        </button>
        <button data-view-cash="${entry.id}">
          <i class="bi bi-eye"></i> View
        </button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll("[data-edit-cash]").forEach((button) => {
    button.addEventListener("click", () => renderCashEntryForm(button.getAttribute("data-edit-cash")));
  });

  document.querySelectorAll("[data-delete-cash]").forEach((button) => {
    button.addEventListener("click", () => deleteCashEntry(button.getAttribute("data-delete-cash")));
  });

  document.querySelectorAll("[data-view-cash]").forEach((button) => {
    button.addEventListener("click", () => renderCashDetail(button.getAttribute("data-view-cash")));
  });
}

function createCashOverlay() {
  if (document.getElementById("cashOverlay")) return;

  const overlay = document.createElement("div");
  overlay.id = "cashOverlay";
  overlay.className = "cash-overlay hidden";
  overlay.innerHTML = `
    <div class="cash-panel glass">
      <div id="cashPanelContent"></div>
    </div>
  `;

  document.body.appendChild(overlay);
}

function openCashOverlay() {
  createCashOverlay();
  document.getElementById("cashOverlay").classList.remove("hidden");
}

function closeCashOverlay() {
  const overlay = document.getElementById("cashOverlay");
  if (overlay) overlay.classList.add("hidden");
}

function renderCashEntryForm(entryId = null) {
  openCashOverlay();

  const isNewEntry = !entryId;
  const entry = cashEntries.find((item) => item.id === entryId) || {
    id: `CASH-${String(Date.now()).slice(-5)}`,
    type: "Income",
    customer: "",
    amount: "",
    date: new Date().toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    }),
    method: "Cash",
    note: ""
  };

  const content = document.getElementById("cashPanelContent");

  content.innerHTML = `
    <div class="cash-panel-head">
      <div>
        <div class="cash-panel-title">${isNewEntry ? "Add Cash Entry" : "Edit Cash Entry"}</div>
        <div class="cash-panel-sub">Record income, expense, advance, collection or credit</div>
      </div>
      <button class="panel-close-btn" id="closeCashPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <form class="cash-edit-form" id="cashEntryForm">
      <label>
        Type
        <select name="type">
          ${["Income", "Expense", "Advance", "Collection", "Credit"].map((type) => `
            <option value="${type}" ${entry.type === type ? "selected" : ""}>${type}</option>
          `).join("")}
        </select>
      </label>

      <label>
        Customer / Source
        <input name="customer" value="${escapeHtml(entry.customer)}" placeholder="Cafe Aroma / Artline Printing" required />
      </label>

      <div class="form-grid-2">
        <label>
          Amount
          <input name="amount" type="number" value="${escapeHtml(entry.amount)}" required />
        </label>

        <label>
          Date
          <input name="date" value="${escapeHtml(entry.date)}" required />
        </label>
      </div>

      <label>
        Payment Method
        <select name="method">
          ${["Cash", "Bank", "Online", "Credit"].map((method) => `
            <option value="${method}" ${entry.method === method ? "selected" : ""}>${method}</option>
          `).join("")}
        </select>
      </label>

      <label>
        Note
        <textarea name="note">${escapeHtml(entry.note)}</textarea>
      </label>

      <button class="panel-save-btn" type="submit">
        <i class="bi bi-check2-circle"></i> Save Cash Entry
      </button>
    </form>
  `;

  document.getElementById("closeCashPanel").addEventListener("click", closeCashOverlay);

  document.getElementById("cashEntryForm").addEventListener("submit", (event) => {
    event.preventDefault();

    const form = new FormData(event.target);

    const updatedEntry = {
      id: entry.id,
      type: form.get("type"),
      customer: form.get("customer"),
      amount: form.get("amount"),
      date: form.get("date"),
      method: form.get("method"),
      note: form.get("note")
    };

    if (isNewEntry) {
      cashEntries.unshift(updatedEntry);
    } else {
      cashEntries = cashEntries.map((item) => item.id === entry.id ? updatedEntry : item);
    }

    saveCashEntries();
    updateCashSummary();
    renderCashEntries();
    renderCashDetail(updatedEntry.id);
  });
}

function renderCashDetail(entryId) {
  openCashOverlay();

  const entry = cashEntries.find((item) => item.id === entryId);
  if (!entry) return;

  const content = document.getElementById("cashPanelContent");

  content.innerHTML = `
    <div class="cash-panel-head">
      <div>
        <div class="cash-panel-title">${escapeHtml(entry.type)}</div>
        <div class="cash-panel-sub">${escapeHtml(entry.date)} • ${escapeHtml(entry.method)}</div>
      </div>
      <button class="panel-close-btn" id="closeCashPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="cash-panel-head">
      <button class="panel-back-btn" id="editCashEntryBtn">
        <i class="bi bi-pencil-square"></i> Edit
      </button>
      <button class="panel-edit-btn" id="closeCashPanelAlt">
        <i class="bi bi-check2"></i> Done
      </button>
    </div>

    <div class="cash-detail-grid">
      <div class="cash-detail-row">
        <div class="detail-label">Customer / Source</div>
        <div class="detail-value">${escapeHtml(entry.customer || "General")}</div>
      </div>

      <div class="cash-detail-row">
        <div class="detail-label">Amount</div>
        <div class="detail-value">${formatCurrency(entry.amount)}</div>
      </div>

      <div class="cash-detail-row">
        <div class="detail-label">Type</div>
        <div class="detail-value">${escapeHtml(entry.type)}</div>
      </div>

      <div class="cash-detail-row">
        <div class="detail-label">Payment Method</div>
        <div class="detail-value">${escapeHtml(entry.method)}</div>
      </div>

      <div class="cash-detail-row">
        <div class="detail-label">Note</div>
        <div class="detail-value">${escapeHtml(entry.note || "No note.")}</div>
      </div>
    </div>
  `;

  document.getElementById("closeCashPanel").addEventListener("click", closeCashOverlay);
  document.getElementById("closeCashPanelAlt").addEventListener("click", closeCashOverlay);
  document.getElementById("editCashEntryBtn").addEventListener("click", () => renderCashEntryForm(entryId));
}

function deleteCashEntry(entryId) {
  const confirmed = window.confirm("Delete this cash entry?");
  if (!confirmed) return;

  cashEntries = cashEntries.filter((entry) => entry.id !== entryId);
  saveCashEntries();
  updateCashSummary();
  renderCashEntries();
}

/* INIT */

if (lightBtn && darkBtn) {
  lightBtn.addEventListener("click", () => applyTheme("light"));
  darkBtn.addEventListener("click", () => applyTheme("dark"));
}

const quotationComingSoonBtn = document.getElementById("quotationComingSoonBtn");
if (quotationComingSoonBtn) {
  quotationComingSoonBtn.addEventListener("click", () => {
    window.alert("Quotation tools are coming soon. No quotation was created.");
  });
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    const tab = item.getAttribute("data-tab");
    switchTab(tab);
  });
});

document.querySelectorAll("[data-open-tab]").forEach((item) => {
  item.addEventListener("click", () => {
    const tab = item.getAttribute("data-open-tab");
    switchTab(tab);
  });
});

document.querySelectorAll(".summary-card").forEach((card) => {
  card.addEventListener("click", () => {
    renderLeadList(card.getAttribute("data-summary-filter"));
  });
});

document.querySelectorAll(".filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".filter-chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeLeadStatusFilter = chip.getAttribute("data-status-filter");
    renderLeadPipeline();
  });
});

if (leadSearchInput) {
  leadSearchInput.addEventListener("input", renderLeadPipeline);
}

const addLeadBtn = document.getElementById("addLeadBtn");
if (addLeadBtn) {
  addLeadBtn.addEventListener("click", () => renderLeadEdit(null, "all"));
}

document.querySelectorAll(".customer-summary-card").forEach((card) => {
  card.addEventListener("click", () => {
    activeCustomerFilter = card.getAttribute("data-customer-filter");
    renderCustomerList();
    renderCustomerCompactList(activeCustomerFilter);
  });
});

if (customerSearchInput) {
  customerSearchInput.addEventListener("input", renderCustomerList);
}

const addCustomerBtn = document.getElementById("addCustomerBtn");
if (addCustomerBtn) {
  addCustomerBtn.addEventListener("click", renderClosedLeadSelector);
}

document.querySelectorAll(".cash-filter-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    document.querySelectorAll(".cash-filter-chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
    activeCashTypeFilter = chip.getAttribute("data-cash-type");
    renderCashEntries();
  });
});

document.querySelectorAll(".cash-summary-card").forEach((card) => {
  card.addEventListener("click", () => {
    const filter = card.getAttribute("data-cash-filter");

    if (filter === "all") activeCashTypeFilter = "All";
    if (filter === "today") activeCashTypeFilter = "Collection";
    if (filter === "pending") activeCashTypeFilter = "All";
    if (filter === "credit") activeCashTypeFilter = "Credit";

    document.querySelectorAll(".cash-filter-chip").forEach((item) => {
      item.classList.toggle("active", item.getAttribute("data-cash-type") === activeCashTypeFilter);
    });

    renderCashEntries();
  });
});

if (cashSearchInput) {
  cashSearchInput.addEventListener("input", renderCashEntries);
}

const addCashEntryBtn = document.getElementById("addCashEntryBtn");
if (addCashEntryBtn) {
  addCashEntryBtn.addEventListener("click", () => renderCashEntryForm(null));
}

applyTheme(savedTheme);
switchTab(savedTab);

updateLeadSummary();
renderLeadPipeline();

updateCustomerSummary();
renderCustomerList();

updateCashSummary();
renderCashEntries();
updateDashboardSummary();
