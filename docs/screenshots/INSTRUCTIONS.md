# Website Screenshots

Deze map bevat screenshots van alle belangrijke pagina's van de website.

## Screenshots Genereren

Zorg dat de applicatie draait en voer dan uit:

```bash
npm run screenshots
```

Dit genereert automatisch screenshots van:

### Publieke Pagina's
1. `01-homepage.png` - Homepage met hero sectie
2. `02-katten-overzicht.png` - Overzicht van alle katten
3. `03-kat-detail.png` - Kat detail pagina met adoptieformulier
4. `04-blog-overzicht.png` - Blog overzicht
5. `05-contact.png` - Contact pagina met vrijwilligers
6. `06-donatie.png` - Donatie pagina met iDEAL

### Admin Pagina's
7. `07-admin-login.png` - Admin login scherm
8. `08-admin-dashboard.png` - Admin dashboard met statistieken
9. `09-admin-katten.png` - Katten beheer overzicht
10. `10-admin-blog.png` - Blog beheer overzicht
11. `11-admin-instellingen.png` - Website instellingen (SMTP, reCAPTCHA, Google Analytics)
12. `12-admin-adoptie-aanvragen.png` - Adoptie aanvragen overzicht

### Mobile Versies
13. `13-mobile-homepage.png` - Homepage op mobiel (iPhone SE)
14. `14-mobile-katten.png` - Katten overzicht op mobiel

## Vereisten

- Applicatie moet draaien op `http://localhost:3000`
- Docker containers moeten actief zijn (`docker-compose up -d`)
- Admin account moet bestaan met credentials:
  - Username: `admin`
  - Password: `Admin123!@#`

## Manual Screenshots

Als je handmatig screenshots wil maken:

1. Open de website in een browser
2. Gebruik browser DevTools voor verschillende schermformaten
3. Maak screenshots met `Cmd+Shift+4` (macOS) of `Win+Shift+S` (Windows)
4. Sla screenshots op in deze map met de juiste nummering

## Screenshot Specificaties

- **Format**: PNG
- **Desktop viewport**: 1280x720 (standaard Playwright)
- **Mobile viewport**: 375x667 (iPhone SE)
- **Type**: Full page screenshots (inclusief scroll content)
