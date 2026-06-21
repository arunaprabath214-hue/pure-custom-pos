(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
  const money = (v) => Number(String(v ?? 0).replace(/,/g, "")) || 0;
  const rs = (v) => `Rs. ${money(v).toLocaleString("en-LK")}`;
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" })[c]);
  const wa = (phone) => {
    const d = String(phone || "").replace(/\D/g, "");
    if (d.startsWith("94")) return d;
    if (d.startsWith("0")) return `94${d.slice(1)}`;
    if (d.length === 9) return `94${d}`;
    return d;
  };
  const parseDate = (d) => {
    if (!d) return null;
    const x = new Date(d);
    return Number.isNaN(x.getTime()) ? null : x;
  };
  const thisMonth = (d) => {
    const x = parseDate(d), n = new Date();
    return !!x && x.getFullYear() === n.getFullYear() && x.getMonth() === n.getMonth();
  };
  const isToday = (d) => {
    const x = parseDate(d), n = new Date();
    return !!x && x.toDateString() === n.toDateString();
  };
  const stockTotal = c => money(c.stock500) + money(c.stock1000) + money(c.stock1500);
  const cashInTypes = ["Income", "Advance", "Collection"];
  const cashOutTypes = ["Expense", "Credit"];

  const defaults = {
    leads: [
      {id:"LEAD-001", businessName:"Cuppa Café", contactPerson:"Kasun Perera", phone:"0771234567", whatsapp:"94771234567", address:"Kandy", businessType:"Café", status:"Closed", followUp:todayISO(), notes:"Closed lead. Ready to convert into official customer."},
      {id:"LEAD-002", businessName:"Royal Event House", contactPerson:"Nadeesha Silva", phone:"0719876543", whatsapp:"94719876543", address:"Colombo", businessType:"Event", status:"Quotation Sent", followUp:todayISO(), notes:"Wants 1500ml bottles for wedding event."},
      {id:"LEAD-003", businessName:"Hilltop Hotel", contactPerson:"Manager", phone:"0762228899", whatsapp:"94762228899", address:"Nuwara Eliya", businessType:"Hotel", status:"Closed", followUp:todayISO(), notes:"Recurring 500ml supply for room service branding."},
      {id:"LEAD-004", businessName:"Green Table Restaurant", contactPerson:"Amila", phone:"0754455667", whatsapp:"94754455667", address:"Peradeniya", businessType:"Restaurant", status:"Contacted", followUp:todayISO(), notes:"Asked 500ml bottle price with normal label."}
    ],
    customers: [
      {id:"CUS-001", leadId:"LEAD-001", businessName:"Cafe Aroma", brandName:"Cafe Aroma", contactPerson:"Tharindu", phone:"0771882985", whatsapp:"94771882985", address:"Kandy", advanceDate:"2026-04-20", advanceAmount:"15000", pendingBalance:"12500", creditBalance:"3000", lastOrderDate:"2026-04-12", lastContactedDate:"2026-04-26", stock500:"860", stock1000:"420", stock1500:"140", normal500:"50", normal1000:"80", normal1500:"100", afterAdvance500:"47", afterAdvance1000:"75.5", afterAdvance1500:"95.5", notes:"Regular 500ml supply.", orderHistory:[{date:"2026-04-12", item:"500ml custom bottles", quantity:"500", total:"25000", paid:"12500", pending:"12500", note:"Partial payment."}]},
      {id:"CUS-002", leadId:"LEAD-003", businessName:"Hilltop Hotel", brandName:"Hilltop Hotel", contactPerson:"Manager", phone:"0762228899", whatsapp:"94762228899", address:"Nuwara Eliya", advanceDate:"2026-04-12", advanceAmount:"30000", pendingBalance:"0", creditBalance:"0", lastOrderDate:"2026-04-03", lastContactedDate:"2026-04-10", stock500:"320", stock1000:"90", stock1500:"60", normal500:"50", normal1000:"80", normal1500:"100", afterAdvance500:"47", afterAdvance1000:"75.5", afterAdvance1500:"95.5", notes:"Hotel customer. Current label stock is low.", orderHistory:[]}
    ],
    cashEntries: [
      {id:"CASH-001", type:"Advance", customer:"Cafe Aroma", amount:"15000", date:"2026-04-20", method:"Bank", note:"Advance payment received."},
      {id:"CASH-002", type:"Collection", customer:"Cafe Aroma", amount:"12500", date:"2026-04-12", method:"Cash", note:"Partial payment collected."},
      {id:"CASH-003", type:"Expense", customer:"Artline Printing", amount:"8500", date:"2026-04-11", method:"Cash", note:"Label printing payment."}
    ],
    bills: [], suppliers: [], purchases: [], expenses: [], bankRows: [],
    products: [
      {size:"500ml", cost:"35", normalPrice:"50", afterAdvancePrice:"47"},
      {size:"1000ml", cost:"58", normalPrice:"80", afterAdvancePrice:"75.5"},
      {size:"1500ml", cost:"75", normalPrice:"100", afterAdvancePrice:"95.5"}
    ],
    settings: {businessName:"Pure Custom Creation", phone:"077 188 2985", address:"Kandy, Sri Lanka", invoiceFooter:"Thank you for your business. Please settle pending balances on time."}
  };

  const keyMap = {
    leads:"pureLeads", customers:"pureCustomers", cashEntries:"pureCashEntries", bills:"pureBills", suppliers:"pureSuppliers", purchases:"purePurchases", products:"pureProducts", expenses:"pureExpenses", bankRows:"pureBankRows", settings:"pureSettings"
  };
  const load = (name) => {
    try { return JSON.parse(localStorage.getItem(keyMap[name])) ?? structuredClone(defaults[name]); }
    catch { return structuredClone(defaults[name]); }
  };
  const saveOne = (name) => localStorage.setItem(keyMap[name], JSON.stringify(state[name]));
  const saveAll = () => Object.keys(keyMap).forEach(saveOne);
  const state = Object.fromEntries(Object.keys(keyMap).map(k => [k, load(k)]));
  state.leads = state.leads.map(l => ({whatsapp: wa(l.whatsapp || l.phone), ...l}));
  state.customers = state.customers.map(c => ({whatsapp: wa(c.whatsapp || c.phone), orderHistory: c.orderHistory || [], ...c}));

  let activeTab = localStorage.getItem("pureActiveTab") || "dashboard";
  let leadFilter = "All", customerFilter = "all", cashFilter = "All", currentTool = "menu", invoicePreviewId = null;

  const screens = {
    dashboard: $("#dashboardScreen"), leads: $("#leadsScreen"), customers: $("#customersScreen"), cash: $("#cashScreen"), more: $("#moreScreen")
  };
  const headings = {
    dashboard:["Dashboard","Today’s Business Snapshot"], leads:["Leads","Track prospects & follow-ups"], customers:["Customers","Manage official customer accounts"], cash:["Cash Balance","Track cash movements & collections"], more:["More","Business tools, reports & settings"]
  };

  function toast(msg){
    const old = $(".toast"); if(old) old.remove();
    const el = document.createElement("div"); el.className = "toast"; el.textContent = msg; document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function openOverlay(title, html, onReady){
    $("#overlayContent").innerHTML = `<div class="panel-head"><div class="panel-title">${esc(title)}</div><button class="close-btn" type="button" data-close><i class="bi bi-x-lg"></i></button></div>${html}`;
    $("#appOverlay").classList.remove("hidden");
    $("#overlayContent [data-close]").addEventListener("click", closeOverlay);
    if (onReady) onReady($("#overlayContent"));
  }
  function closeOverlay(){ $("#appOverlay").classList.add("hidden"); $("#overlayContent").innerHTML = ""; }

  function switchTab(tab){
    activeTab = tab in screens ? tab : "dashboard";
    $$(".tab-screen").forEach(s => s.classList.remove("active-screen"));
    screens[activeTab].classList.add("active-screen");
    $$(".nav-item").forEach(n => n.classList.toggle("active", n.dataset.tab === activeTab));
    $("#pageHeading").textContent = headings[activeTab][0];
    $("#pageSubtitle").textContent = headings[activeTab][1];
    localStorage.setItem("pureActiveTab", activeTab);
    render(); window.scrollTo({top:0, behavior:"smooth"});
  }

  function row(label, value){ return `<div class="info-cell"><div class="info-label">${esc(label)}</div><div class="info-value">${esc(value)}</div></div>`; }
  function kpi(label, value){ return `<div class="kpi"><div class="kpi-label">${esc(label)}</div><div class="kpi-value">${esc(value)}</div></div>`; }
  function formField(name, label, value="", type="text", attrs=""){
    return `<div class="field"><label for="${name}">${esc(label)}</label><input id="${name}" name="${name}" type="${type}" value="${esc(value)}" ${attrs}></div>`;
  }
  function selectField(name, label, value, options, attrs=""){
    return `<div class="field"><label for="${name}">${esc(label)}</label><select id="${name}" name="${name}" ${attrs}>${options.map(o => `<option value="${esc(o)}" ${String(o)===String(value)?"selected":""}>${esc(o)}</option>`).join("")}</select></div>`;
  }
  function textField(name, label, value=""){
    return `<div class="field"><label for="${name}">${esc(label)}</label><textarea id="${name}" name="${name}">${esc(value)}</textarea></div>`;
  }
  const formValues = (form) => Object.fromEntries(new FormData(form).entries());

  function dashboardStats(){
    const todayRevenue = state.cashEntries.filter(e => isToday(e.date) && cashInTypes.includes(e.type)).reduce((s,e)=>s+money(e.amount),0);
    const pending = state.customers.reduce((s,c)=>s+money(c.pendingBalance),0) + state.bills.reduce((s,b)=>s+money(b.pending),0);
    const activeLeads = state.leads.filter(l => !["Closed","Lost"].includes(l.status)).length;
    const followups = state.customers.filter(c => !thisMonth(c.lastOrderDate)).length;
    const lowStock = state.customers.filter(c => stockTotal(c) < 500).length;
    const cashIn = state.cashEntries.filter(e=>cashInTypes.includes(e.type)).reduce((s,e)=>s+money(e.amount),0);
    const cashOut = state.cashEntries.filter(e=>cashOutTypes.includes(e.type)).reduce((s,e)=>s+money(e.amount),0);
    const exp = state.expenses.reduce((s,e)=>s+money(e.amount),0);
    return {todayRevenue,pending,activeLeads,followups,lowStock,cash:cashIn-cashOut-exp};
  }
  function renderDashboard(){
    const d = dashboardStats();
    screens.dashboard.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card glass round-lg"><div class="icon-wrap"><i class="bi bi-graph-up-arrow"></i></div><div class="card-label">Today Revenue</div><div class="card-value">${rs(d.todayRevenue)}</div><div class="card-meta">From today cash-in entries</div></div>
        <div class="stat-card glass round-lg"><div class="icon-wrap"><i class="bi bi-credit-card-2-front"></i></div><div class="card-label">Pending Payments</div><div class="card-value">${rs(d.pending)}</div><div class="card-meta">Customer and bill balances</div></div>
        <div class="stat-card glass round-lg"><div class="icon-wrap"><i class="bi bi-bag-check"></i></div><div class="card-label">Active / Follow-ups</div><div class="card-value">${d.activeLeads + d.followups}</div><div class="card-meta">${d.activeLeads} active leads • ${d.followups} follow-ups</div></div>
        <div class="stat-card glass round-lg"><div class="icon-wrap"><i class="bi bi-tags"></i></div><div class="card-label">Label Stock Alerts</div><div class="card-value">${d.lowStock}</div><div class="card-meta">Customers below 500 labels</div></div>
      </div>
      <div class="wide-card glass round-lg"><div><div class="icon-wrap"><i class="bi bi-wallet2"></i></div><div class="card-label">Cash Balance</div><div class="card-value">${rs(d.cash)}</div><div class="card-meta">Cash-in minus expenses and credit</div></div><div class="wallet-emoji"><i class="bi bi-wallet-fill"></i></div></div>
      <div class="section-head"><h3>Quick Actions</h3></div>
      <div class="actions-grid">
        <button class="action-card glass round-lg" data-go="leads"><div class="icon-wrap"><i class="bi bi-person-plus"></i></div><p>New Lead</p></button>
        <button class="action-card glass round-lg" data-tool="bills"><div class="icon-wrap"><i class="bi bi-receipt-cutoff"></i></div><p>Create<br>Invoice</p></button>
        <button class="action-card glass round-lg" data-go="customers"><div class="icon-wrap"><i class="bi bi-person-vcard"></i></div><p>Add<br>Customer</p></button>
        <button class="action-card glass round-lg" data-tool="expenses"><div class="icon-wrap"><i class="bi bi-wallet"></i></div><p>Add<br>Expense</p></button>
      </div>
      <div class="section-head"><h3>Monthly Insights</h3><span>${new Date().toLocaleDateString("en-GB",{month:"long",year:"numeric"})}</span></div>
      <div class="section-card glass round-lg">${monthlyRows()}</div>
      <div class="section-head"><h3>Recent Activity</h3><span>Latest</span></div>
      <div class="section-card glass round-lg">${recentRows()}</div>`;
    $$('[data-go]', screens.dashboard).forEach(b=>b.onclick=()=>switchTab(b.dataset.go));
    $$('[data-tool]', screens.dashboard).forEach(b=>b.onclick=()=>openTool(b.dataset.tool));
  }
  function monthlyRows(){
    const rev = state.cashEntries.filter(e=>cashInTypes.includes(e.type) && thisMonth(e.date)).reduce((s,e)=>s+money(e.amount),0);
    const exp = [...state.cashEntries.filter(e=>cashOutTypes.includes(e.type) && thisMonth(e.date)), ...state.expenses.filter(e=>thisMonth(e.date))].reduce((s,e)=>s+money(e.amount),0);
    const profit = rev-exp;
    return [["Revenue",rs(rev),"bi-cash-coin"],["Expenses",rs(exp),"bi-wallet"],["Profit",rs(profit),"bi-bar-chart-line"],["Bills",String(state.bills.length),"bi-receipt"]].map(r=>`<div class="record-top" style="padding:10px 0;border-bottom:1px solid var(--panel-border)"><div style="display:flex;gap:10px;align-items:center"><div class="list-icon"><i class="bi ${r[2]}"></i></div><b>${r[0]}</b></div><b>${r[1]}</b></div>`).join("");
  }
  function recentRows(){
    const items = [...state.bills.map(b=>({t:`Bill ${b.id} saved`,s:b.customerName,d:b.date,i:"bi-receipt"})), ...state.cashEntries.map(c=>({t:`${c.type}: ${rs(c.amount)}`,s:c.customer,d:c.date,i:"bi-cash"}))].sort((a,b)=>String(b.d).localeCompare(String(a.d))).slice(0,5);
    if(!items.length) return `<div class="empty-state">No recent activity yet.</div>`;
    return items.map(x=>`<div class="record-top" style="padding:10px 0;border-bottom:1px solid var(--panel-border)"><div style="display:flex;gap:10px"><div class="list-icon"><i class="bi ${x.i}"></i></div><div><b>${esc(x.t)}</b><div class="record-sub">${esc(x.s)}</div></div></div><span class="record-sub">${esc(x.d)}</span></div>`).join("");
  }

  function leadBadge(status){
    const cls = status === "Closed" ? "good" : status === "Lost" ? "danger" : status === "Quotation Sent" ? "warn" : "";
    return `<span class="badge ${cls}">${esc(status)}</span>`;
  }
  function renderLeads(){
    const q = String($("#leadSearchInput")?.value || "").toLowerCase();
    const statuses = ["All","New","Contacted","Quotation Sent","Negotiating","Closed","Lost"];
    let data = [...state.leads];
    if(q) data = data.filter(l => Object.values(l).join(" ").toLowerCase().includes(q));
    else if(leadFilter !== "All") data = data.filter(l=>l.status===leadFilter);
    screens.leads.innerHTML = `
      <button class="top-add glass" id="addLeadBtn"><i class="bi bi-plus-lg"></i> Add New Lead</button>
      <div class="summary-grid">
        ${summaryCard("Total Leads", state.leads.length, "bi-people", "All")}
        ${summaryCard("New Leads", state.leads.filter(l=>l.status==="New").length, "bi-stars", "New")}
        ${summaryCard("Follow-Ups", state.leads.filter(l=>l.followUp).length, "bi-calendar-check", "All")}
        ${summaryCard("Quotations", state.leads.filter(l=>l.status==="Quotation Sent").length, "bi-file-earmark-text", "Quotation Sent")}
      </div>
      <div class="search-card glass round-lg"><i class="bi bi-search"></i><input id="leadSearchInput" value="${esc(q)}" placeholder="Search name, phone, location..." autocomplete="off"></div>
      <div class="section-head"><h3>Lead Pipeline</h3><span>${data.length} leads</span></div>
      <div class="filter-row">${statuses.map(s=>`<button class="filter-chip ${leadFilter===s?'active':''}" data-lead-filter="${s}">${s}</button>`).join("")}</div>
      <div class="list-stack">${data.length ? data.map(leadCard).join("") : `<div class="empty-state section-card glass round-lg">No leads found.</div>`}</div>`;
    $("#addLeadBtn").onclick = () => leadForm();
    $("#leadSearchInput").oninput = renderLeads;
    $$('[data-lead-filter]').forEach(b=>b.onclick=()=>{leadFilter=b.dataset.leadFilter;renderLeads();});
    $$('[data-edit-lead]').forEach(b=>b.onclick=()=>leadForm(b.dataset.editLead));
    $$('[data-close-lead]').forEach(b=>b.onclick=()=>{const l=state.leads.find(x=>x.id===b.dataset.closeLead); if(l){l.status="Closed"; saveOne("leads"); renderAll();}});
  }
  function summaryCard(label,value,icon,filter){return `<button class="mini-card glass round-lg" data-lead-filter="${filter}"><div class="mini-icon"><i class="bi ${icon}"></i></div><div><div class="mini-value">${value}</div><div class="mini-label">${label}</div></div></button>`;}
  function leadCard(l){return `<div class="record-card glass round-lg"><div class="record-top"><div><div class="record-title">${esc(l.businessName)}</div><div class="record-sub">${esc(l.contactPerson)} • ${esc(l.address)} • ${esc(l.phone)}</div></div>${leadBadge(l.status)}</div><div class="record-grid">${row("Type",l.businessType)}${row("Follow-up",l.followUp||"-")}</div><div class="record-sub" style="margin-top:10px">${esc(l.notes||"")}</div><div class="record-actions"><a class="small-btn" href="tel:${esc(l.phone)}">Call</a><a class="small-btn" href="https://wa.me/${wa(l.whatsapp||l.phone)}" target="_blank">WhatsApp</a><button class="small-btn" data-edit-lead="${l.id}">Edit</button><button class="primary-btn" data-close-lead="${l.id}">Mark Closed</button></div></div>`;}
  function leadForm(id){
    const l = state.leads.find(x=>x.id===id) || {id:uid("LEAD"), status:"New", followUp:todayISO()};
    openOverlay(id?"Edit Lead":"Add Lead", `<form id="leadForm" class="form-grid">
      ${formField("businessName","Business Name",l.businessName)}${formField("contactPerson","Contact Person",l.contactPerson)}
      <div class="two-col">${formField("phone","Phone",l.phone)}${formField("whatsapp","WhatsApp",l.whatsapp||wa(l.phone))}</div>
      ${formField("address","Address",l.address)}${formField("businessType","Business Type",l.businessType)}
      ${selectField("status","Status",l.status,["New","Contacted","Quotation Sent","Negotiating","Closed","Lost"])}${formField("followUp","Follow-up Date",l.followUp,"date")}${textField("notes","Notes",l.notes)}
      <div class="form-actions"><button class="ghost-btn" type="button" data-close>Cancel</button><button class="primary-btn" type="submit">Save Lead</button></div></form>`, root=>{
      $("#leadForm",root).onsubmit = e => {e.preventDefault(); const v=formValues(e.target); Object.assign(l,v,{whatsapp:wa(v.whatsapp||v.phone)}); if(!id) state.leads.unshift(l); saveOne("leads"); closeOverlay(); renderAll(); toast("Lead saved");};
      $$('[data-close]',root).forEach(b=>b.onclick=closeOverlay);
    });
  }

  function renderCustomers(){
    const q = String($("#customerSearchInput")?.value || "").toLowerCase();
    let data = [...state.customers];
    if(q) data = data.filter(c=>Object.values(c).join(" ").toLowerCase().includes(q));
    if(customerFilter==="followup") data=data.filter(c=>!thisMonth(c.lastOrderDate));
    if(customerFilter==="lowStock") data=data.filter(c=>stockTotal(c)<500);
    if(customerFilter==="pending") data=data.filter(c=>money(c.pendingBalance)>0);
    screens.customers.innerHTML = `<button class="top-add glass" id="addCustomerBtn"><i class="bi bi-plus-lg"></i> Add Customer From Closed Lead</button><div class="summary-grid">
      ${custSummary("Total Customers",state.customers.length,"bi-people","all")}${custSummary("Follow-up",state.customers.filter(c=>!thisMonth(c.lastOrderDate)).length,"bi-calendar-heart","followup")}${custSummary("Low Stock",state.customers.filter(c=>stockTotal(c)<500).length,"bi-tags","lowStock")}${custSummary("Pending Pay",rs(state.customers.reduce((s,c)=>s+money(c.pendingBalance),0)),"bi-credit-card","pending")}
      </div><div class="search-card glass round-lg"><i class="bi bi-search"></i><input id="customerSearchInput" value="${esc(q)}" placeholder="Search customer, phone, location..." autocomplete="off"></div><div class="section-head"><h3>Customer Accounts</h3><span>${data.length} customers</span></div><div class="list-stack">${data.length?data.map(customerCard).join(""):`<div class="empty-state section-card glass round-lg">No customers found.</div>`}</div>`;
    $("#addCustomerBtn").onclick = () => chooseClosedLead();
    $("#customerSearchInput").oninput = renderCustomers;
    $$('[data-customer-filter]').forEach(b=>b.onclick=()=>{customerFilter=b.dataset.customerFilter;renderCustomers();});
    $$('[data-view-customer]').forEach(b=>b.onclick=()=>customerDetail(b.dataset.viewCustomer));
    $$('[data-edit-customer]').forEach(b=>b.onclick=()=>customerForm(null,b.dataset.editCustomer));
    $$('[data-remind-customer]').forEach(b=>b.onclick=()=>sendReminder(b.dataset.remindCustomer));
  }
  function custSummary(label,value,icon,filter){return `<button class="mini-card glass round-lg" data-customer-filter="${filter}"><div class="mini-icon"><i class="bi ${icon}"></i></div><div><div class="mini-value pending-value">${value}</div><div class="mini-label">${label}</div></div></button>`;}
  function customerBadge(c){ if(money(c.pendingBalance)>0) return `<span class="badge danger">Pending Pay</span>`; if(stockTotal(c)<500) return `<span class="badge warn">Low Stock</span>`; if(!thisMonth(c.lastOrderDate)) return `<span class="badge">Follow-up</span>`; return `<span class="badge good">Active</span>`; }
  function customerCard(c){return `<div class="record-card glass round-lg"><div class="record-top"><div><div class="record-title">${esc(c.brandName||c.businessName)}</div><div class="record-sub">${esc(c.contactPerson)} • ${esc(c.address)} • ${esc(c.phone)}</div></div>${customerBadge(c)}</div><div class="record-grid">${row("Labels",stockTotal(c))}${row("Pending",rs(c.pendingBalance))}${row("Credit",rs(c.creditBalance))}${row("Last Order",c.lastOrderDate||"-")}</div><div class="record-actions"><button class="small-btn" data-view-customer="${c.id}">Details</button><button class="small-btn" data-edit-customer="${c.id}">Edit</button><button class="primary-btn" data-remind-customer="${c.id}">WhatsApp Reminder</button></div></div>`;}
  function chooseClosedLead(){
    const closed = state.leads.filter(l=>l.status==="Closed" && !state.customers.some(c=>c.leadId===l.id));
    openOverlay("Choose Closed Lead", closed.length ? `<div class="list-stack">${closed.map(l=>`<button class="record-card glass round-lg" data-pick-lead="${l.id}"><div class="record-title">${esc(l.businessName)}</div><div class="record-sub">${esc(l.contactPerson)} • ${esc(l.phone)}</div></button>`).join("")}</div>` : `<div class="empty-state">No new closed leads available.</div>`, root=>{
      $$('[data-pick-lead]',root).forEach(b=>b.onclick=()=>customerForm(b.dataset.pickLead));
    });
  }
  function customerForm(leadId, customerId){
    const lead = state.leads.find(l=>l.id===leadId) || {};
    const c = state.customers.find(x=>x.id===customerId) || {id:uid("CUS"), leadId:lead.id, businessName:lead.businessName||"", brandName:lead.businessName||"", contactPerson:lead.contactPerson||"", phone:lead.phone||"", whatsapp:lead.whatsapp||wa(lead.phone), address:lead.address||"", advanceDate:todayISO(), advanceAmount:"0", pendingBalance:"0", creditBalance:"0", lastOrderDate:"", lastContactedDate:todayISO(), stock500:"0", stock1000:"0", stock1500:"0", normal500:"50", normal1000:"80", normal1500:"100", afterAdvance500:"47", afterAdvance1000:"75.5", afterAdvance1500:"95.5", notes:"", orderHistory:[]};
    openOverlay(customerId?"Edit Customer":"Create Customer", `<form id="customerForm" class="form-grid">${formField("businessName","Business Name",c.businessName)}${formField("brandName","Brand Name",c.brandName)}${formField("contactPerson","Contact Person",c.contactPerson)}<div class="two-col">${formField("phone","Phone",c.phone)}${formField("whatsapp","WhatsApp",c.whatsapp)}</div>${formField("address","Address",c.address)}<div class="two-col">${formField("advanceAmount","Advance Amount",c.advanceAmount,"number")}${formField("pendingBalance","Pending Balance",c.pendingBalance,"number")}</div><div class="two-col">${formField("creditBalance","Credit Balance",c.creditBalance,"number")}${formField("lastOrderDate","Last Order Date",c.lastOrderDate,"date")}</div><div class="two-col">${formField("stock500","500ml Labels",c.stock500,"number")}${formField("stock1000","1000ml Labels",c.stock1000,"number")}</div>${formField("stock1500","1500ml Labels",c.stock1500,"number")}<div class="two-col">${formField("afterAdvance500","500ml Price",c.afterAdvance500,"number","step='0.01'")}${formField("afterAdvance1000","1000ml Price",c.afterAdvance1000,"number","step='0.01'")}</div>${formField("afterAdvance1500","1500ml Price",c.afterAdvance1500,"number","step='0.01'")}${textField("notes","Notes",c.notes)}<div class="form-actions"><button class="ghost-btn" type="button" data-close>Cancel</button><button class="primary-btn" type="submit">Save Customer</button></div></form>`, root=>{
      $("#customerForm",root).onsubmit = e => {e.preventDefault(); Object.assign(c, formValues(e.target), {whatsapp:wa(e.target.whatsapp.value)}); if(!customerId) state.customers.unshift(c); saveOne("customers"); closeOverlay(); renderAll(); toast("Customer saved");};
      $$('[data-close]',root).forEach(b=>b.onclick=closeOverlay);
    });
  }
  function customerDetail(id){
    const c=state.customers.find(x=>x.id===id); if(!c) return;
    openOverlay(c.brandName || c.businessName, `<div class="record-grid">${row("Phone",c.phone)}${row("Address",c.address)}${row("Pending",rs(c.pendingBalance))}${row("Credit",rs(c.creditBalance))}${row("500ml",c.stock500)}${row("1000ml",c.stock1000)}${row("1500ml",c.stock1500)}${row("Last Order",c.lastOrderDate||"-")}</div><div class="section-head"><h3>Order History</h3></div><div class="list-stack">${(c.orderHistory||[]).length?c.orderHistory.map(o=>`<div class="record-card glass round-lg"><b>${esc(o.date)} • ${esc(o.item)}</b><div class="record-sub">Qty ${esc(o.quantity)} • Total ${rs(o.total)} • Paid ${rs(o.paid)} • Pending ${rs(o.pending)}</div></div>`).join(""):`<div class="empty-state">No order history yet.</div>`}</div><div class="form-actions"><button class="primary-btn" data-remind-customer="${c.id}">WhatsApp Reminder</button><button class="ghost-btn" data-close>Done</button></div>`, root=>{$('[data-remind-customer]',root).onclick=()=>sendReminder(c.id); $$('[data-close]',root).forEach(b=>b.onclick=closeOverlay);});
  }
  function sendReminder(id){
    const c=state.customers.find(x=>x.id===id); if(!c) return;
    const msg = `Hello ${c.contactPerson || c.businessName}, this is Pure Custom Creation. Pending: ${rs(c.pendingBalance)}, credit: ${rs(c.creditBalance)}, remaining label stock: ${stockTotal(c)}. Please contact us for the next order/update.`;
    window.open(`https://wa.me/${wa(c.whatsapp||c.phone)}?text=${encodeURIComponent(msg)}`, "_blank");
  }

  function renderCash(){
    const q=String($("#cashSearchInput")?.value||"").toLowerCase();
    let data=[...state.cashEntries];
    if(cashFilter!=="All") data=data.filter(e=>e.type===cashFilter || (cashFilter==="Today"&&isToday(e.date)));
    if(q) data=data.filter(e=>Object.values(e).join(" ").toLowerCase().includes(q));
    const cashIn=state.cashEntries.filter(e=>cashInTypes.includes(e.type)).reduce((s,e)=>s+money(e.amount),0);
    const cashOut=state.cashEntries.filter(e=>cashOutTypes.includes(e.type)).reduce((s,e)=>s+money(e.amount),0) + state.expenses.reduce((s,e)=>s+money(e.amount),0);
    const today=state.cashEntries.filter(e=>isToday(e.date)&&cashInTypes.includes(e.type)).reduce((s,e)=>s+money(e.amount),0);
    screens.cash.innerHTML = `<button class="top-add glass" id="addCashEntryBtn"><i class="bi bi-plus-lg"></i> Add Cash Entry</button><div class="summary-grid">${cashMini("Available Cash",rs(cashIn-cashOut),"bi-wallet2")}${cashMini("Today Collected",rs(today),"bi-cash-coin")}${cashMini("Pending Collections",rs(state.customers.reduce((s,c)=>s+money(c.pendingBalance),0)),"bi-hourglass")}${cashMini("Credit Given",rs(state.customers.reduce((s,c)=>s+money(c.creditBalance),0)),"bi-arrow-left-right")}</div><div class="search-card glass round-lg"><i class="bi bi-search"></i><input id="cashSearchInput" value="${esc(q)}" placeholder="Search cash entries, customer, note..." autocomplete="off"></div><div class="section-head"><h3>Cash Entries</h3><span>${data.length} entries</span></div><div class="filter-row">${["All","Today","Income","Expense","Advance","Collection","Credit"].map(t=>`<button class="filter-chip ${cashFilter===t?'active':''}" data-cash-filter="${t}">${t}</button>`).join("")}</div><div class="section-card glass round-lg"><div class="record-grid">${row("Monthly Income",rs(state.cashEntries.filter(e=>cashInTypes.includes(e.type)&&thisMonth(e.date)).reduce((s,e)=>s+money(e.amount),0)))}${row("Monthly Expenses",rs(cashOut))}${row("Net Cash",rs(cashIn-cashOut))}${row("Records",state.cashEntries.length)}</div></div><div class="list-stack" style="margin-top:12px">${data.length?data.map(cashCard).join(""):`<div class="empty-state section-card glass round-lg">No cash entries found.</div>`}</div>`;
    $("#addCashEntryBtn").onclick=()=>cashForm(); $("#cashSearchInput").oninput=renderCash; $$('[data-cash-filter]').forEach(b=>b.onclick=()=>{cashFilter=b.dataset.cashFilter;renderCash();}); $$('[data-edit-cash]').forEach(b=>b.onclick=()=>cashForm(b.dataset.editCash)); $$('[data-delete-cash]').forEach(b=>b.onclick=()=>{if(confirm("Delete this cash entry?")){state.cashEntries=state.cashEntries.filter(e=>e.id!==b.dataset.deleteCash); saveOne("cashEntries"); renderAll();}});
  }
  function cashMini(label,value,icon){return `<div class="mini-card glass round-lg"><div class="mini-icon"><i class="bi ${icon}"></i></div><div><div class="mini-value pending-value">${value}</div><div class="mini-label">${label}</div></div></div>`;}
  function cashCard(e){const cls=cashInTypes.includes(e.type)?"good":cashOutTypes.includes(e.type)?"danger":"";return `<div class="record-card glass round-lg"><div class="record-top"><div><div class="record-title">${esc(e.customer||"Cash Entry")}</div><div class="record-sub">${esc(e.date)} • ${esc(e.method)} • ${esc(e.note||"")}</div></div><span class="badge ${cls}">${esc(e.type)} • ${rs(e.amount)}</span></div><div class="record-actions"><button class="small-btn" data-edit-cash="${e.id}">Edit</button><button class="danger-btn" data-delete-cash="${e.id}">Delete</button></div></div>`;}
  function cashForm(id, preset={}){const e=state.cashEntries.find(x=>x.id===id)||{id:uid("CASH"),type:"Income",customer:"",amount:"",date:todayISO(),method:"Cash",note:"",...preset};openOverlay(id?"Edit Cash Entry":"Add Cash Entry",`<form id="cashForm" class="form-grid">${selectField("type","Type",e.type,["Income","Expense","Advance","Collection","Credit"])}${formField("customer","Customer / Source",e.customer)}<div class="two-col">${formField("amount","Amount",e.amount,"number","step='0.01'")}${formField("date","Date",e.date,"date")}</div>${selectField("method","Method",e.method,["Cash","Bank","Online","Credit"])}${textField("note","Note",e.note)}<div class="form-actions"><button class="ghost-btn" type="button" data-close>Cancel</button><button class="primary-btn" type="submit">Save Entry</button></div></form>`,root=>{$("#cashForm",root).onsubmit=ev=>{ev.preventDefault();Object.assign(e,formValues(ev.target));if(!id)state.cashEntries.unshift(e);saveOne("cashEntries");closeOverlay();renderAll();toast("Cash entry saved");};$$('[data-close]',root).forEach(b=>b.onclick=closeOverlay);});}

  function renderMore(){
    if(currentTool!=="menu") return renderTool(currentTool);
    const groups = [
      ["Business Operations", [["bills","Bills / Invoices","Create bills, preview invoice and print.","bi-receipt-cutoff"],["suppliers","Suppliers","Supplier contacts and purchases.","bi-truck"],["products","Products & Prices","Bottle sizes, costs, margins.","bi-box-seam"],["expenses","Expenses","Salary, delivery, phone, other costs.","bi-wallet"]]],
      ["Reports & Data", [["reports","Monthly Reports","Profit/loss, pending and stock alerts.","bi-bar-chart-line"],["bank","Bank CSV Import","Paste bank rows for reconciliation.","bi-bank"],["backup","Backup / Restore","Export, restore, reset or clear data.","bi-cloud-arrow-down"]]],
      ["System", [["settings","Settings","Business details and invoice footer.","bi-gear"],["about","About App","Version and module notes.","bi-info-circle"]]]
    ];
    screens.more.innerHTML = `<div class="more-hero glass round-lg"><div class="more-hero-icon"><i class="bi bi-grid-3x3-gap-fill"></i></div><div><h3>POS Toolkit</h3><p>Pure Custom Creation business control room.</p></div></div>${groups.map(g=>`<div class="more-group-title">${g[0]}</div><div class="more-grid">${g[1].map(t=>toolCard(...t)).join("")}</div>`).join("")}`;
    $$('[data-open-tool]').forEach(b=>b.onclick=()=>openTool(b.dataset.openTool));
  }
  function toolCard(key,title,sub,icon){return `<button class="tool-card glass" data-open-tool="${key}"><div class="tool-icon"><i class="bi ${icon}"></i></div><div><div class="tool-title">${title}</div><div class="tool-sub">${sub}</div></div><i class="bi bi-chevron-right"></i></button>`;}
  function openTool(key){ currentTool=key; switchTab("more"); }
  function renderTool(key){
    const map={bills:toolBills,suppliers:toolSuppliers,products:toolProducts,expenses:toolExpenses,reports:toolReports,bank:toolBank,backup:toolBackup,settings:toolSettings,about:toolAbout};
    screens.more.innerHTML = `<div class="module-head"><div><div class="module-title">${toolTitle(key)}</div><div class="module-sub">${toolSub(key)}</div></div><button class="ghost-btn" id="backToMore"><i class="bi bi-arrow-left"></i> Menu</button></div>${map[key]?map[key]():toolAbout()}`;
    $("#backToMore").onclick=()=>{currentTool="menu";renderMore();};
    bindTool(key);
  }
  function toolTitle(k){return ({bills:"Bills / Invoices",suppliers:"Suppliers",products:"Products & Prices",expenses:"Expenses",reports:"Monthly Reports",bank:"Bank CSV Import",backup:"Backup / Restore",settings:"Settings",about:"About App"})[k]||"More";}
  function toolSub(k){return ({bills:"Create customer bills and print invoices",suppliers:"Supplier contacts and purchase expenses",products:"Bottle pricing and margins",expenses:"Operational expenses",reports:"Monthly business snapshot",bank:"Paste CSV rows from bank statement",backup:"Protect or reset browser data",settings:"Business and invoice details",about:"Pure Custom Creation POS"})[k]||"";}

  function toolBills(){const paid=state.bills.reduce((s,b)=>s+money(b.paid),0), pend=state.bills.reduce((s,b)=>s+money(b.pending),0);return `<div class="kpi-grid">${kpi("Bills",state.bills.length)}${kpi("Paid",rs(paid))}${kpi("Pending",rs(pend))}${kpi("Total",rs(paid+pend))}</div><button class="top-add glass" id="newBillBtn"><i class="bi bi-plus-lg"></i> Create New Bill</button><div class="list-stack">${state.bills.length?state.bills.map(billCard).join(""):`<div class="empty-state section-card glass round-lg">No bills yet.</div>`}</div>`;}
  function billCard(b){return `<div class="record-card glass round-lg"><div class="record-top"><div><div class="record-title">${esc(b.id)} • ${esc(b.customerName)}</div><div class="record-sub">${esc(b.date)} • ${esc(b.size)} • Qty ${esc(b.quantity)}</div></div><span class="badge ${money(b.pending)>0?'danger':'good'}">${money(b.pending)>0?'Pending':'Paid'}</span></div><div class="record-grid">${row("Total",rs(b.total))}${row("Paid",rs(b.paid))}${row("Pending",rs(b.pending))}${row("Unit",rs(b.unitPrice))}</div><div class="record-actions"><button class="small-btn" data-preview-bill="${b.id}">Preview</button><button class="primary-btn" data-print-bill="${b.id}">Print</button></div></div>`;}
  function bindTool(key){
    if(key==="bills"){ $("#newBillBtn")?.addEventListener("click",()=>billForm()); $$('[data-preview-bill]').forEach(b=>b.onclick=()=>invoicePreview(b.dataset.previewBill)); $$('[data-print-bill]').forEach(b=>b.onclick=()=>invoicePreview(b.dataset.printBill,true)); }
    if(key==="suppliers"){ $("#newSupplierBtn")?.addEventListener("click",()=>supplierForm()); $("#newPurchaseBtn")?.addEventListener("click",()=>purchaseForm()); }
    if(key==="products"){ $("#productsForm")?.addEventListener("submit",saveProducts); }
    if(key==="expenses"){ $("#newExpenseBtn")?.addEventListener("click",()=>expenseForm()); }
    if(key==="bank"){ $("#importBankBtn")?.addEventListener("click",importBankRows); }
    if(key==="backup"){ $("#exportBtn")?.addEventListener("click",exportData); $("#restoreBtn")?.addEventListener("click",restoreData); $("#resetBtn")?.addEventListener("click",resetDemo); $("#clearBtn")?.addEventListener("click",clearAll); }
    if(key==="settings"){ $("#settingsForm")?.addEventListener("submit",saveSettings); }
  }
  function billForm(){
    const customerOptions = state.customers.map(c=>`<option value="${c.id}">${esc(c.brandName||c.businessName)}</option>`).join("");
    if(!customerOptions){toast("Create a customer first");return;}
    openOverlay("Create Bill", `<form id="billForm" class="form-grid"><div class="field"><label>Customer</label><select name="customerId" id="billCustomer">${customerOptions}</select></div>${selectField("size","Bottle Size","500ml",["500ml","1000ml","1500ml"])}<div class="two-col">${formField("quantity","Quantity","100","number")}${formField("unitPrice","Unit Price","","number","step='0.01'")}</div><div class="two-col">${formField("paid","Paid Amount","0","number","step='0.01'")}${formField("date","Date",todayISO(),"date")}</div>${selectField("method","Payment Method","Cash",["Cash","Bank","Online","Credit"])}${textField("note","Note","")}<div class="section-card glass round-lg"><div class="record-grid">${row("Total","<span id='billTotalText'>Rs. 0</span>")}${row("Pending","<span id='billPendingText'>Rs. 0</span>")}</div></div><div class="form-actions"><button class="ghost-btn" type="button" data-close>Cancel</button><button class="primary-btn" type="submit">Save Bill</button></div></form>`, root=>{
      const form=$("#billForm",root); const update=()=>{const c=state.customers.find(x=>x.id===form.customerId.value);const size=form.size.value;const field=`afterAdvance${size.replace('ml','')}`;if(document.activeElement!==form.unitPrice) form.unitPrice.value = c ? money(c[field]||0) : 0; const total=money(form.quantity.value)*money(form.unitPrice.value); $("#billTotalText",root).textContent=rs(total); $("#billPendingText",root).textContent=rs(total-money(form.paid.value));};
      form.customerId.onchange=update; form.size.onchange=update; form.quantity.oninput=update; form.unitPrice.oninput=update; form.paid.oninput=update; update();
      form.onsubmit=e=>{e.preventDefault();saveBill(formValues(form));}; $$('[data-close]',root).forEach(b=>b.onclick=closeOverlay);
    });
  }
  function saveBill(v){
    const c=state.customers.find(x=>x.id===v.customerId); if(!c) return;
    const total=money(v.quantity)*money(v.unitPrice), pending=Math.max(0,total-money(v.paid));
    const bill={id:uid("INV"), customerId:c.id, customerName:c.brandName||c.businessName, date:v.date, size:v.size, quantity:v.quantity, unitPrice:v.unitPrice, total:String(total), paid:v.paid, pending:String(pending), method:v.method, note:v.note};
    state.bills.unshift(bill);
    const stockField = `stock${v.size.replace("ml","")}`; c[stockField]=String(Math.max(0,money(c[stockField])-money(v.quantity))); c.pendingBalance=String(money(c.pendingBalance)+pending); c.lastOrderDate=v.date; c.orderHistory=c.orderHistory||[]; c.orderHistory.unshift({date:v.date,item:`${v.size} custom bottles`,quantity:v.quantity,total:String(total),paid:v.paid,pending:String(pending),note:v.note});
    if(money(v.paid)>0) state.cashEntries.unshift({id:uid("CASH"),type:"Collection",customer:c.brandName||c.businessName,amount:v.paid,date:v.date,method:v.method,note:`Payment for ${bill.id}`});
    saveAll(); closeOverlay(); currentTool="bills"; renderAll(); toast("Bill saved"); invoicePreview(bill.id);
  }
  function invoicePreview(id, print=false){
    const b=state.bills.find(x=>x.id===id); if(!b)return; const s=state.settings;
    invoicePreviewId=id;
    openOverlay("Invoice Preview", `<div class="invoice-preview"><h2>${esc(s.businessName)}</h2><p>${esc(s.address)}<br>${esc(s.phone)}</p><div class="invoice-row"><b>Invoice</b><span>${esc(b.id)}</span></div><div class="invoice-row"><b>Date</b><span>${esc(b.date)}</span></div><div class="invoice-row"><b>Customer</b><span>${esc(b.customerName)}</span></div><div class="invoice-row"><span>${esc(b.size)} custom bottles × ${esc(b.quantity)}</span><b>${rs(b.total)}</b></div><div class="invoice-row"><span>Paid</span><b>${rs(b.paid)}</b></div><div class="invoice-row"><span>Pending</span><b>${rs(b.pending)}</b></div><p style="font-size:12px;margin-top:14px">${esc(s.invoiceFooter)}</p></div><div class="form-actions no-print"><button class="primary-btn" id="printInvoiceBtn">Print</button><button class="ghost-btn" data-close>Done</button></div>`, root=>{$("#printInvoiceBtn",root).onclick=()=>window.print(); $$('[data-close]',root).forEach(x=>x.onclick=closeOverlay); if(print)setTimeout(()=>window.print(),200);});
  }

  function toolSuppliers(){return `<div class="form-actions"><button class="primary-btn" id="newSupplierBtn">Add Supplier</button><button class="ghost-btn" id="newPurchaseBtn">Record Purchase</button></div><div class="section-head"><h3>Suppliers</h3><span>${state.suppliers.length}</span></div><div class="list-stack">${state.suppliers.length?state.suppliers.map(s=>`<div class="record-card glass round-lg"><div class="record-title">${esc(s.name)}</div><div class="record-sub">${esc(s.phone)} • ${esc(s.category)} • ${esc(s.address)}</div></div>`).join(""):`<div class="empty-state section-card glass round-lg">No suppliers yet.</div>`}</div><div class="section-head"><h3>Purchases</h3><span>${state.purchases.length}</span></div><div class="list-stack">${state.purchases.map(p=>`<div class="record-card glass round-lg"><div class="record-top"><div><b>${esc(p.supplier)}</b><div class="record-sub">${esc(p.date)} • ${esc(p.note)}</div></div><span class="badge danger">${rs(p.amount)}</span></div></div>`).join("")}</div>`;}
  function supplierForm(){openOverlay("Add Supplier",`<form id="supplierForm" class="form-grid">${formField("name","Supplier Name")}${formField("phone","Phone")}${formField("category","Category","Bottle / Printing / Delivery")}${formField("address","Address")}${textField("note","Note")}<div class="form-actions"><button class="ghost-btn" type="button" data-close>Cancel</button><button class="primary-btn">Save Supplier</button></div></form>`,root=>{$("#supplierForm",root).onsubmit=e=>{e.preventDefault();state.suppliers.unshift({id:uid("SUP"),...formValues(e.target)});saveOne("suppliers");closeOverlay();renderAll();};$$('[data-close]',root).forEach(b=>b.onclick=closeOverlay);});}
  function purchaseForm(){openOverlay("Record Supplier Purchase",`<form id="purchaseForm" class="form-grid">${formField("supplier","Supplier")}${formField("amount","Amount","","number","step='0.01'")}${formField("date","Date",todayISO(),"date")}${textField("note","Purchase Note")}<div class="form-actions"><button class="ghost-btn" type="button" data-close>Cancel</button><button class="primary-btn">Save Purchase</button></div></form>`,root=>{$("#purchaseForm",root).onsubmit=e=>{e.preventDefault();const p={id:uid("PUR"),...formValues(e.target)};state.purchases.unshift(p);state.cashEntries.unshift({id:uid("CASH"),type:"Expense",customer:p.supplier,amount:p.amount,date:p.date,method:"Cash",note:`Supplier purchase: ${p.note}`});saveAll();closeOverlay();renderAll();};$$('[data-close]',root).forEach(b=>b.onclick=closeOverlay);});}

  function toolProducts(){return `<form id="productsForm" class="form-grid">${state.products.map((p,i)=>`<div class="section-card glass round-lg"><b>${esc(p.size)}</b><div class="two-col">${formField(`cost${i}`,"Cost",p.cost,"number","step='0.01'")}${formField(`normal${i}`,"Normal Price",p.normalPrice,"number","step='0.01'")}</div>${formField(`advance${i}`,"After Advance Price",p.afterAdvancePrice,"number","step='0.01'")}<div class="record-sub">Margin: ${rs(money(p.afterAdvancePrice)-money(p.cost))}</div></div>`).join("")}<button class="primary-btn">Save Product Prices</button></form>`;}
  function saveProducts(e){e.preventDefault();state.products=state.products.map((p,i)=>({...p,cost:e.target[`cost${i}`].value,normalPrice:e.target[`normal${i}`].value,afterAdvancePrice:e.target[`advance${i}`].value}));saveOne("products");toast("Prices saved");renderAll();}

  function toolExpenses(){const total=state.expenses.reduce((s,e)=>s+money(e.amount),0);return `<div class="kpi-grid">${kpi("Expense Records",state.expenses.length)}${kpi("Total Expenses",rs(total))}</div><button class="top-add glass" id="newExpenseBtn"><i class="bi bi-plus-lg"></i> Add Expense</button><div class="list-stack">${state.expenses.length?state.expenses.map(e=>`<div class="record-card glass round-lg"><div class="record-top"><div><b>${esc(e.category)}</b><div class="record-sub">${esc(e.date)} • ${esc(e.note)}</div></div><span class="badge danger">${rs(e.amount)}</span></div></div>`).join(""):`<div class="empty-state section-card glass round-lg">No expenses yet.</div>`}</div>`;}
  function expenseForm(){openOverlay("Add Expense",`<form id="expenseForm" class="form-grid">${selectField("category","Category","Delivery",["Delivery","Salary","Phone Bill","Electricity","Printing","Transport","Other"])}${formField("amount","Amount","","number","step='0.01'")}${formField("date","Date",todayISO(),"date")}${textField("note","Note")}<div class="form-actions"><button class="ghost-btn" type="button" data-close>Cancel</button><button class="primary-btn">Save Expense</button></div></form>`,root=>{$("#expenseForm",root).onsubmit=e=>{e.preventDefault();const ex={id:uid("EXP"),...formValues(e.target)};state.expenses.unshift(ex);state.cashEntries.unshift({id:uid("CASH"),type:"Expense",customer:ex.category,amount:ex.amount,date:ex.date,method:"Cash",note:ex.note});saveAll();closeOverlay();renderAll();};$$('[data-close]',root).forEach(b=>b.onclick=closeOverlay);});}

  function toolReports(){const rev=state.cashEntries.filter(e=>cashInTypes.includes(e.type)&&thisMonth(e.date)).reduce((s,e)=>s+money(e.amount),0);const exp=state.cashEntries.filter(e=>cashOutTypes.includes(e.type)&&thisMonth(e.date)).reduce((s,e)=>s+money(e.amount),0)+state.expenses.filter(e=>thisMonth(e.date)).reduce((s,e)=>s+money(e.amount),0);return `<div class="kpi-grid">${kpi("Income",rs(rev))}${kpi("Expenses",rs(exp))}${kpi("Profit / Loss",rs(rev-exp))}${kpi("Pending",rs(state.customers.reduce((s,c)=>s+money(c.pendingBalance),0)))}</div><div class="section-card glass round-lg"><div class="record-grid">${row("Customers",state.customers.length)}${row("Low Stock",state.customers.filter(c=>stockTotal(c)<500).length)}${row("Bills",state.bills.length)}${row("Suppliers",state.suppliers.length)}</div></div>`;}

  function toolBank(){return `<div class="section-card glass round-lg"><div class="field"><label>Paste CSV rows: date, description, amount</label><textarea id="bankCsv" class="csv-box" placeholder="2026-06-21, Customer deposit, 15000"></textarea></div><button class="primary-btn" id="importBankBtn">Import CSV Rows</button></div><div class="section-head"><h3>Imported Bank Rows</h3><span>${state.bankRows.length}</span></div><div class="list-stack">${state.bankRows.map(r=>`<div class="record-card glass round-lg"><div class="record-top"><div><b>${esc(r.description)}</b><div class="record-sub">${esc(r.date)}</div></div><span class="badge">${rs(r.amount)}</span></div></div>`).join("")}</div>`;}
  function importBankRows(){const text=$("#bankCsv").value.trim();if(!text)return;const rows=text.split(/\n+/).map(line=>{const [date,description,amount]=line.split(",").map(x=>x.trim());return{id:uid("BANK"),date,description,amount};}).filter(r=>r.date&&r.amount);state.bankRows.unshift(...rows);saveOne("bankRows");toast(`${rows.length} bank rows imported`);renderAll();}

  function toolBackup(){return `<div class="list-stack"><button class="tool-card glass" id="exportBtn"><div class="tool-icon"><i class="bi bi-download"></i></div><div><div class="tool-title">Export Backup JSON</div><div class="tool-sub">Download all local POS data.</div></div></button><div class="section-card glass round-lg"><div class="field"><label>Restore JSON</label><textarea id="restoreJson" class="csv-box" placeholder="Paste backup JSON here"></textarea></div><button class="primary-btn" id="restoreBtn">Restore Data</button></div><button class="tool-card glass" id="resetBtn"><div class="tool-icon"><i class="bi bi-arrow-clockwise"></i></div><div><div class="tool-title">Reset Demo Data</div><div class="tool-sub">Return to default sample data.</div></div></button><button class="tool-card glass" id="clearBtn"><div class="tool-icon"><i class="bi bi-trash"></i></div><div><div class="tool-title">Clear All Data</div><div class="tool-sub">Delete all local records.</div></div></button></div>`;}
  function exportData(){const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`pure-pos-backup-${todayISO()}.json`;a.click();URL.revokeObjectURL(a.href);}
  function restoreData(){try{const data=JSON.parse($("#restoreJson").value);Object.keys(keyMap).forEach(k=>{if(data[k]!==undefined)state[k]=data[k];});saveAll();toast("Backup restored");currentTool="menu";renderAll();}catch{alert("Invalid backup JSON");}}
  function resetDemo(){if(!confirm("Reset demo data?"))return;Object.keys(keyMap).forEach(k=>{state[k]=structuredClone(defaults[k]);saveOne(k);});renderAll();toast("Demo data reset");}
  function clearAll(){if(!confirm("Clear ALL POS data? This cannot be undone."))return;Object.keys(keyMap).forEach(k=>{state[k]=Array.isArray(defaults[k])?[]:{};saveOne(k);});renderAll();toast("All data cleared");}

  function toolSettings(){const s=state.settings;return `<form id="settingsForm" class="form-grid">${formField("businessName","Business Name",s.businessName)}${formField("phone","Phone",s.phone)}${formField("address","Address",s.address)}${textField("invoiceFooter","Invoice Footer",s.invoiceFooter)}<button class="primary-btn">Save Settings</button></form>`;}
  function saveSettings(e){e.preventDefault();state.settings={...state.settings,...formValues(e.target)};saveOne("settings");toast("Settings saved");renderAll();}
  function toolAbout(){return `<div class="section-card glass round-lg"><h3>Pure Custom Creation POS</h3><p class="record-sub">Mobile-first localStorage POS for customized water bottle branding operations.</p><div class="record-grid">${row("Version","1.0 Toolkit")}${row("Storage","Browser localStorage")}${row("Modules","Leads, Customers, Cash, Bills, Suppliers, Products, Reports")}${row("Status","Working MVP")}</div></div>`;}

  function renderAll(){ renderDashboard(); renderLeads(); renderCustomers(); renderCash(); renderMore(); }
  function render(){ if(activeTab==="dashboard")renderDashboard(); if(activeTab==="leads")renderLeads(); if(activeTab==="customers")renderCustomers(); if(activeTab==="cash")renderCash(); if(activeTab==="more")renderMore(); }

  $$(".nav-item").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
  $("#lightBtn").onclick=()=>{document.body.classList.add("light-mode");document.body.classList.remove("dark-mode");localStorage.setItem("pureTheme","light");};
  $("#darkBtn").onclick=()=>{document.body.classList.add("dark-mode");document.body.classList.remove("light-mode");localStorage.setItem("pureTheme","dark");};
  if(localStorage.getItem("pureTheme")==="light") $("#lightBtn").click();
  renderAll(); switchTab(activeTab);
})();
