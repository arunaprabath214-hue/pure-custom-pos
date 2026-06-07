# Pure Custom Creation POS MVP Feature Status

This document records the current MVP scope as implemented in the repository. It is intended to prevent placeholder UI or future roadmap items from being mistaken for complete production features.

## Implemented features

- Mobile-first single-page POS/CRM interface using static HTML, CSS, and vanilla JavaScript.
- Bottom-tab navigation for Dashboard, Leads, Customers, Cash Balance, and More.
- Light and dark theme switching with browser persistence.
- Lead management with local creation, editing, search, status filters, follow-up summaries, and local browser persistence.
- Customer management from closed leads with customer profiles, stock values, pricing fields, payment balances, reminders, search, and local browser persistence.
- Cash entry management with income, expense, advance, collection, and credit entries, search, filtering, editing, deletion, summary totals, and local browser persistence.
- PWA manifest metadata for install-style usage on mobile devices.

## Partially implemented features

- Dashboard reporting: key values are calculated from existing local browser data, but there are no formal orders, invoices, or backend reports yet.
- Customer conversion: customers can be created from closed leads, but duplicate prevention and deeper lead/customer lifecycle tracking are not complete.
- Label stock tracking: customer stock quantities and low-stock alerts exist, but there is no inventory ledger or automatic stock movement history.
- Payment tracking: customer pending and credit balances plus cash entries exist, but cash entries are not yet strongly linked to customer IDs, orders, or invoices.
- Monthly cash summary: income, expenses, and net cash are calculated from cash entries, but there is no full profit/loss accounting model yet.

## UI placeholder only features

- More tab: present as a safe placeholder for future reports, settings, quotation tools, invoice tools, supplier records, and bank CSV tools.
- Create Quotation quick action: intentionally shows a coming-soon message and does not create fake quotations.
- Some dashboard labels mention business concepts such as orders and alerts, but they currently summarize only available MVP data.

## Not implemented yet features

- Supabase or any other backend database integration.
- Authentication, staff accounts, roles, or permissions.
- Quotation builder and quotation PDF export.
- Invoice/bill generation and invoice PDF export.
- Supplier purchase records as a dedicated module.
- Bank statement CSV upload/import/reconciliation.
- Formal product catalog, order management, production workflow, or delivery workflow.
- Audit trail, data backup/restore, multi-device sync, and server-side validation.
- Automated test suite.
