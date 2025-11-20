# Screenshots

Plaats hier screenshots van de verschillende features van de website.

## Publieke Pagina's

### Homepage
![Homepage](./homepage.png)
*De homepage met hero sectie, featured cats en laatste blog posts*

### Katten Overzicht
![Katten pagina](./cats-overview.png)
*Overzicht van alle katten met search en filters (geslacht, leeftijd, status)*

### Kat Detail met Adoptie Modal
![Adoptie aanvraag](./adoption-modal.png)
*Adoptie aanvraag formulier met persoonlijke en huishoudelijke informatie*

### Blog Overzicht
![Blog pagina](./blog-overview.png)
*Blog posts met zoekfunctie en sortering*

### Blog Post Detail
![Blog post](./blog-detail.png)
*Individuele blog post met rich text content (met DOMPurify sanitization)*

### Contact Pagina
![Contact](./contact.png)
*Contact pagina met vrijwilligers*

### Donatie Pagina
![Donatie](./donation.png)
*Donatie formulier met iDEAL integratie (Mollie)*

## Admin Dashboard

### Admin Login
![Admin login](./admin-login.png)
*Login pagina met rate limiting (5 pogingen/minuut)*

### Dashboard
![Dashboard](./admin-dashboard.png)
*Admin dashboard met statistieken en quick actions*

### Katten Beheer
![Katten beheer](./admin-cats.png)
*CRUD operaties voor katten met image upload*

### Blog Beheer
![Blog beheer](./admin-blog.png)
*Blog beheer met Tiptap rich text editor*

### Tiptap Rich Text Editor
![Rich text editor](./tiptap-editor.png)
*WYSIWYG editor met toolbar (bold, italic, headings, lists, links, images)*

### Adoptie Aanvragen Beheer
![Adoptie beheer](./admin-adoptions.png)
*Overzicht van alle adoptie aanvragen met filtering op status*

### Adoptie Detail Modal
![Adoptie detail](./admin-adoption-detail.png)
*Gedetailleerde informatie over adoptie aanvraag met goedkeuren/afwijzen*

### Vrijwilligers Beheer
![Vrijwilligers](./admin-volunteers.png)
*Beheer van vrijwilligers contactpersonen*

### Donaties Overzicht
![Donaties](./admin-donations.png)
*Overzicht van alle donaties met Mollie payment status*

### Instellingen
![Instellingen](./admin-settings.png)
*Site instellingen (naam, beschrijving, kleuren, hero content)*

## Security Features

### Rate Limiting Response
![Rate limiting](./rate-limit.png)
*429 Too Many Requests response na 5 login pogingen*

### CSRF Token in Headers
![CSRF headers](./csrf-token.png)
*X-CSRF-Token header in authenticated requests*

### Security Headers
![Security headers](./security-headers.png)
*X-Frame-Options, X-Content-Type-Options, X-XSS-Protection headers*

## Technische Features

### Search & Filters - Cats
![Cat filters](./cat-filters.png)
*Search bar + gender/age/status filters met results count*

### Search & Filters - Blog
![Blog filters](./blog-filters.png)
*Search in title/content + sort by date*

### Email Notifications
![Email notification](./email-notification.png)
*Automatische email bevestiging na donatie (Resend)*

### Responsive Design
![Mobile view](./mobile-responsive.png)
*Mobile-friendly responsive design*

---

## Instructies voor Screenshots

Maak screenshots van:
1. Open http://localhost:3000 in browser
2. Gebruik browser developer tools (F12) voor network/header screenshots
3. Gebruik screenshot tool (macOS: Cmd+Shift+4, Windows: Snipping Tool)
4. Plaats screenshots in `/docs/screenshots/` met bovenstaande bestandsnamen
5. Update dit bestand indien nodig

**Screenshot Tips:**
- Gebruik een schone browser zonder persoonlijke data
- Zorg voor goede data in de database (seed script)
- Maak screenshots in lichte modus voor consistentie
- Gebruik 1920x1080 resolutie voor desktop screenshots
- Voor mobile: gebruik Chrome DevTools device simulator (iPhone 12 Pro)
