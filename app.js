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

const savedTheme = localStorage.getItem("pureTheme") || "dark";
const savedTab = localStorage.getItem("pureActiveTab") || "dashboard";

let activeLeadStatusFilter = "All";

const defaultLeads = [
  {
    id: "lead-001",
    businessName: "Cuppa Café",
    contactPerson: "Kasun Perera",
    phone: "0771234567",
    whatsapp: "94771234567",
    address: "Kandy",
    businessType: "Café",
    status: "Negotiating",
    followUp: "06 May 2026",
    notes: "Needs 500ml + 1000ml quotation with custom label design."
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
    status: "New",
    followUp: "Today",
    notes: "Interested in recurring 500ml supply for room service branding."
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

let leads = JSON.parse(localStorage.getItem("pureLeads")) || defaultLeads;

leads = leads.map((lead) => ({
  whatsapp: lead.whatsapp || toWhatsAppNumber(lead.phone || ""),
  ...lead
}));

function toWhatsAppNumber(phone) {
  const digits = String(phone).replace(/\D/g, "");

  if (digits.startsWith("94")) return digits;
  if (digits.startsWith("0")) return `94${digits.slice(1)}`;
  if (digits.length === 9) return `94${digits}`;

  return digits;
}

function cleanPhone(phone) {
  return String(phone).replace(/\s/g, "");
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

function saveLeads() {
  localStorage.setItem("pureLeads", JSON.stringify(leads));
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
    pageSubtitle.textContent = "Manage active customer accounts";
    return;
  }

  if (tab === "cash") {
    pageHeading.textContent = "Cash Balance";
    pageSubtitle.textContent = "Track available cash & collections";
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
  window.scrollTo({ top: 0, behavior: "smooth" });
}

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
          <div class="lead-name">${lead.businessName}</div>
          <div class="lead-person">${lead.contactPerson} • ${lead.address}</div>
        </div>
        <span class="status-badge ${statusClass(lead.status)}">${lead.status}</span>
      </div>

      <div class="lead-info">
        <div><i class="bi bi-telephone"></i> ${lead.phone}</div>
        <div><i class="bi bi-shop"></i> ${lead.businessType}</div>
        <div><i class="bi bi-calendar-event"></i> Follow-up: ${lead.followUp}</div>
      </div>

      <div class="lead-note">${lead.notes}</div>

      <div class="lead-actions">
        <a href="tel:${cleanPhone(lead.phone)}">
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

  overlay.addEventListener("click", (event) => {
    if (event.target.id === "leadOverlay") {
      closeLeadOverlay();
    }
  });
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
                  <div class="compact-lead-name">${lead.businessName}</div>
                  <div class="compact-lead-address">${lead.address}</div>
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
        <div class="lead-panel-title">${lead.businessName}</div>
        <div class="lead-panel-sub">${lead.address}</div>
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
        <div class="detail-value">${lead.businessName}</div>
      </div>

      <div class="lead-detail-row">
        <div class="detail-label">Contact Person</div>
        <div class="detail-value">${lead.contactPerson}</div>
      </div>

      <div class="lead-detail-row">
        <div class="detail-label">Phone Number</div>
        <div class="detail-value">${lead.phone}</div>
      </div>

      <div class="lead-detail-row">
        <div class="detail-label">WhatsApp Number</div>
        <div class="detail-value">${lead.whatsapp}</div>
      </div>

      <div class="lead-detail-row">
        <div class="detail-label">Address / Location</div>
        <div class="detail-value">${lead.address}</div>
      </div>

      <div class="lead-detail-row">
        <div class="detail-label">Business Type</div>
        <div class="detail-value">${lead.businessType}</div>
      </div>

      <div class="lead-detail-row">
        <div class="detail-label">Lead Status</div>
        <div class="detail-value">${lead.status}</div>
      </div>

      <div class="lead-detail-row">
        <div class="detail-label">Follow-up Date</div>
        <div class="detail-value">${lead.followUp}</div>
      </div>

      <div class="lead-detail-row">
        <div class="detail-label">Notes</div>
        <div class="detail-value">${lead.notes}</div>
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
        <div class="lead-panel-sub">${isNewLead ? "Create a fresh prospect record" : lead.businessName}</div>
      </div>
      <button class="panel-close-btn" id="closeLeadPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <form class="lead-edit-form" id="leadEditForm">
      <label>
        Business Name
        <input name="businessName" value="${lead.businessName}" required />
      </label>

      <label>
        Contact Person
        <input name="contactPerson" value="${lead.contactPerson}" />
      </label>

      <label>
        Phone Number
        <input name="phone" value="${lead.phone}" />
      </label>

      <label>
        WhatsApp Number
        <input name="whatsapp" value="${lead.whatsapp}" />
      </label>

      <label>
        Address / Location
        <input name="address" value="${lead.address}" />
      </label>

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

      <label>
        Follow-up Date
        <input name="followUp" value="${lead.followUp}" />
      </label>

      <label>
        Notes
        <textarea name="notes">${lead.notes}</textarea>
      </label>

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

if (lightBtn && darkBtn) {
  lightBtn.addEventListener("click", () => applyTheme("light"));
  darkBtn.addEventListener("click", () => applyTheme("dark"));
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

applyTheme(savedTheme);
switchTab(savedTab);
updateLeadSummary();
renderLeadPipeline();
