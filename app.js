const body = document.body;
const lightBtn = document.getElementById("lightBtn");
const darkBtn = document.getElementById("darkBtn");
const pageHeading = document.getElementById("pageHeading");
const pageSubtitle = document.getElementById("pageSubtitle");

const savedTheme = localStorage.getItem("pureTheme") || "dark";
const savedTab = localStorage.getItem("pureActiveTab") || "dashboard";

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

  screens.forEach((screen) => {
    screen.classList.remove("active-screen");
  });

  navItems.forEach((item) => {
    item.classList.remove("active");
  });

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

applyTheme(savedTheme);
switchTab(savedTab);
