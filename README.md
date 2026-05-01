# Pure Custom Creation Staff POS

A mobile-first POS/CRM MVP for Pure Custom Creation. Designed for GitHub Pages hosting and optional Supabase connection later.

## Included
- Leads management
- Quotation builder with logo PDF export
- Customer conversion after advance payment
- Customer label stock tracking
- Invoice/bill generation with PDF export
- Supplier purchase records
- Expenses
- Monthly dashboard, P/L snapshot, cash turnover, product supply average
- Bank statement CSV upload preview
- Light/Dark mode
- PWA manifest for iPhone home screen

## Run locally
Open `index.html` in a browser.

## Host on GitHub Pages
1. Create a GitHub repository.
2. Upload these files.
3. Go to Settings → Pages.
4. Select branch `main` and folder `/root`.
5. Open the Pages URL on iPhone → Share → Add to Home Screen.

## Supabase note
This version uses browser localStorage for MVP testing. Later, replace the `db` functions in `app.js` with Supabase CRUD calls.
