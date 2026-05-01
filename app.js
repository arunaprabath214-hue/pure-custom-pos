const body = document.body;
const lightBtn = document.getElementById("lightBtn");
const darkBtn = document.getElementById("darkBtn");
const todayDate = document.getElementById("todayDate");

const savedTheme = localStorage.getItem("pureTheme") || "dark";

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

if (lightBtn && darkBtn) {
  lightBtn.addEventListener("click", () => applyTheme("light"));
  darkBtn.addEventListener("click", () => applyTheme("dark"));
}

if (todayDate) {
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });

  todayDate.textContent = formattedDate;
}

applyTheme(savedTheme);
