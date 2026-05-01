const body = document.body;
const lightBtn = document.getElementById("lightBtn");
const darkBtn = document.getElementById("darkBtn");
const pageHeading = document.getElementById("pageHeading");
const pageSubtitle = document.getElementById("pageSubtitle");

const savedTheme = localStorage.getItem("pureTheme") || "dark";
const savedTab = localStorage.getItem("pureActiveTab") || "dashboard";

const defaultLeads = [
  {
    id: "lead-001",
    businessName: "Cuppa Café",
    contactPerson: "Kasun Perera",
    phone: "077 123 4567",
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
    phone: "071 987 6543",
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
    phone: "076 222 8899",
    address: "Nuwara Eliya",
    businessType: "Hotel",
    status: "New",
    followUp: "Today",
    notes: "Interested in recurring 500ml supply for room service branding."
  }
];

let leads = JSON.parse(localStorage.getItem("pureLeads")) || defaultLeads;

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

/* LEADS OVERLAY */

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

function renderLeadList() {
  openLeadOverlay();

  const content = document.getElementById("leadPanelContent");

  content.innerHTML = `
    <div class="lead-panel-head">
      <div>
        <div class="lead-panel-title">All Leads</div>
        <div class="lead-panel-sub">Tap a lead to view full details</div>
      </div>
      <button class="panel-close-btn" id="closeLeadPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <div class="compact-lead-list">
      ${leads.map((lead) => `
        <button class="compact-lead-item" data-lead-id="${lead.id}">
          <div>
            <div class="compact-lead-name">${lead.businessName}</div>
            <div class="compact-lead-address">${lead.address}</div>
          </div>
          <i class="bi bi-chevron-right"></i>
        </button>
      `).join("")}
    </div>
  `;

  document.getElementById("closeLeadPanel").addEventListener("click", closeLeadOverlay);

  document.querySelectorAll(".compact-lead-item").forEach((item) => {
    item.addEventListener("click", () => {
      renderLeadDetail(item.getAttribute("data-lead-id"));
    });
  });
}

function renderLeadDetail(leadId) {
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
  document.getElementById("backToLeadList").addEventListener("click", renderLeadList);
  document.getElementById("editLeadBtn").addEventListener("click", () => renderLeadEdit(leadId));
}

function renderLeadEdit(leadId) {
  const lead = leads.find((item) => item.id === leadId);
  if (!lead) return;

  const content = document.getElementById("leadPanelContent");

  content.innerHTML = `
    <div class="lead-panel-head">
      <div>
        <div class="lead-panel-title">Edit Lead</div>
        <div class="lead-panel-sub">${lead.businessName}</div>
      </div>
      <button class="panel-close-btn" id="closeLeadPanel">
        <i class="bi bi-x-lg"></i>
      </button>
    </div>

    <form class="lead-edit-form" id="leadEditForm">
      <label>
        Business Name
        <input name="businessName" value="${lead.businessName}" />
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

    leads = leads.map((item) => {
      if (item.id !== leadId) return item;

      return {
        ...item,
        businessName: form.get("businessName"),
        contactPerson: form.get("contactPerson"),
        phone: form.get("phone"),
        address: form.get("address"),
        businessType: form.get("businessType"),
        status: form.get("status"),
        followUp: form.get("followUp"),
        notes: form.get("notes")
      };
    });

    saveLeads();
    updateLeadSummary();
    renderLeadDetail(leadId);
  });
}

function updateLeadSummary() {
  const totalLeadsValue = document.querySelector("#leadsScreen .lead-summary-grid .mini-card:first-child .mini-value");
  if (totalLeadsValue) totalLeadsValue.textContent = String(leads.length).padStart(2, "0");
}

/* INIT */

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

const totalLeadsCard = document.querySelector("#leadsScreen .lead-summary-grid .mini-card:first-child");
if (totalLeadsCard) {
  totalLeadsCard.classList.add("clickable-card");
  totalLeadsCard.addEventListener("click", renderLeadList);
}

applyTheme(savedTheme);
switchTab(savedTab);
updateLeadSummary();
