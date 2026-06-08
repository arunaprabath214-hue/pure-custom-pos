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

export {
  cashTypeClass,
  cleanPhone,
  escapeHtml,
  formatCurrency,
  getCustomerBadge,
  isCashIn,
  isCashOut,
  isThisMonth,
  isToday,
  moneyNumber,
  needsFollowUp,
  needsReminder,
  statusClass,
  toWhatsAppNumber,
  totalLabelStock
};
