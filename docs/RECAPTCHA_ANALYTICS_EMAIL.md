# reCAPTCHA en Google Analytics Integratie

## Overzicht

De website heeft ondersteuning voor:
- **reCAPTCHA v3**: Onzichtbare spam bescherming op adoptieformulieren
- **Google Analytics 4**: Website tracking en analyses

Beide features zijn optioneel en volledig configureerbaar via het admin panel.

## reCAPTCHA v3 Instellen

### 1. Google reCAPTCHA Account

1. Ga naar [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Klik op "+" om een nieuwe site te registreren
3. Vul in:
   - **Label**: Wijze Weeskitten (of je eigen site naam)
   - **reCAPTCHA type**: reCAPTCHA v3
   - **Domains**: Voeg je domein toe (bijv. `wijzeweeskitten.nl`, `www.wijzeweeskitten.nl`)
4. Accepteer de voorwaarden en klik "Submit"
5. Kopieer de **Site Key** en **Secret Key**

### 2. Keys Instellen in Admin Panel

1. Log in op het admin panel: `/admin/login`
2. Ga naar Instellingen: `/admin/instellingen`
3. Scroll naar "reCAPTCHA v3 Spam Bescherming"
4. Plak de keys:
   - **reCAPTCHA Site Key**: Publieke key voor frontend
   - **reCAPTCHA Secret Key**: Geheime key voor server-side verificatie
5. Klik "Opslaan"

### 3. Hoe het Werkt

**Frontend (AdoptionForm.tsx)**:
- reCAPTCHA v3 laadt automatisch als site key aanwezig is
- Bij formulier submit wordt een token gegenereerd met action `adoption_request`
- Token wordt meegestuurd naar de API

**Backend (route.ts)**:
- API controleert of reCAPTCHA geconfigureerd is (`recaptcha_secret_key` bestaat)
- Token wordt geverifieerd bij Google's API endpoint
- reCAPTCHA v3 retourneert een score tussen 0.0 (bot) en 1.0 (mens)
- Scores >= 0.5 worden geaccepteerd
- Bij lagere scores wordt het formulier afgewezen

**Technische Details**:
```typescript
// Frontend: Token genereren
const token = await grecaptcha.execute(siteKey, { 
  action: 'adoption_request' 
});

// Backend: Token verifiëren
const result = await verifyRecaptcha(token, secretKey);
// result.success: boolean
// result.score: number (0.0-1.0)
```

### 4. Testing

**Development**:
- reCAPTCHA werkt ook op localhost
- Gebruik test keys voor volledige functionaliteit
- Productie keys werken alleen op geregistreerde domeinen

**Monitoring**:
- reCAPTCHA scores worden gelogd in console
- Check server logs voor score trends
- Pas threshold aan indien nodig (standaard 0.5)

## Google Analytics 4 Instellen

### 1. Google Analytics Account

1. Ga naar [Google Analytics](https://analytics.google.com/)
2. Klik "Admin" (tandwiel icoon linksonder)
3. Maak een nieuwe **Property** aan:
   - Property name: Wijze Weeskitten
   - Reporting time zone: Netherlands
   - Currency: Euro
4. Klik "Next" en vul bedrijfsgegevens in
5. In het nieuwe property, ga naar **Data Streams**
6. Klik "Add stream" → "Web"
7. Vul in:
   - Website URL: https://wijzeweeskitten.nl
   - Stream name: Website
8. Klik "Create stream"
9. Kopieer het **Measurement ID** (format: `G-XXXXXXXXXX`)

### 2. Measurement ID Instellen

1. Log in op het admin panel: `/admin/login`
2. Ga naar Instellingen: `/admin/instellingen`
3. Scroll naar "Google Analytics 4 Tracking"
4. Plak het Measurement ID (bijv. `G-12345ABCDE`)
5. Klik "Opslaan"

### 3. Hoe het Werkt

**Implementatie (layout.tsx)**:
```tsx
{settings.google_analytics_id && (
  <>
    <script 
      async 
      src={`https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`}
    />
    <script dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.google_analytics_id}');
      `
    }} />
  </>
)}
```

**Wat wordt getrackt**:
- Page views (automatisch)
- User sessions
- Traffic sources
- User demographics
- Bounce rate
- Engagement metrics

**Custom Events** (optioneel toe te voegen):
```javascript
gtag('event', 'adoption_request', {
  'event_category': 'engagement',
  'event_label': 'cat_name'
});
```

### 4. Privacy & AVG/GDPR

**Let op**: Bij gebruik van Google Analytics moet je:

1. **Cookiemelding tonen**:
   - Informeer gebruikers over cookies
   - Vraag toestemming voor analytics cookies
   - Implementeer cookie banner (bijv. CookieConsent)

2. **Privacy Policy updaten**:
   - Vermeld gebruik van Google Analytics
   - Leg uit welke data verzameld wordt
   - Link naar Google's privacy policy

3. **IP Anonimisering** (optioneel):
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  'anonymize_ip': true
});
```

4. **Opt-out optie bieden**:
```javascript
// Gebruiker kan analytics uitschakelen
window['ga-disable-G-XXXXXXXXXX'] = true;
```

## Adoptie E-mail Notificaties

### Hoe het Werkt

Wanneer iemand een adoptieaanvraag indient:

1. **Admin ontvangt**:
   - Notificatie e-mail naar `contact_email` uit instellingen
   - Bevat alle aanvraagdetails
   - Link naar admin panel
   - Referentienummer

2. **Aanvrager ontvangt**:
   - Bevestigingsmail
   - Informatie over het proces
   - Verwachte responstijd (2-3 werkdagen)
   - Referentienummer voor tracking

### E-mail Templates

**Admin notificatie**:
- Kattennaam en details
- Aanvrager contactgegevens
- Woonsituatie (tuin, huisdieren, kinderen)
- Motivatie
- Link naar admin panel

**Aanvrager bevestiging**:
- Bedankbericht
- Processtappen
- Verwachtingen
- Contactgegevens stichting

### Testing

1. Zorg dat SMTP correct ingesteld is (zie SMTP sectie in instellingen)
2. Submit een test adoptieaanvraag
3. Check Mailhog: http://localhost:8026
4. Verwacht 2 e-mails:
   - Admin notificatie
   - Aanvrager bevestiging

## Environment Variabelen (Optioneel)

Als alternatief voor database configuratie kunnen keys via `.env`:

```bash
# reCAPTCHA
RECAPTCHA_SITE_KEY=6LdxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxL
RECAPTCHA_SECRET_KEY=6LdxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxL

# Google Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

Admin panel instellingen hebben voorrang boven env variabelen.

## Troubleshooting

### reCAPTCHA werkt niet

**Probleem**: "Spam verificatie mislukt"

**Oplossingen**:
1. Check of site key correct is in admin panel
2. Verifieer domein geregistreerd bij Google reCAPTCHA
3. Test met browser console open (check for JS errors)
4. Zorg dat `https://www.google.com/recaptcha/` niet geblokkeerd is

**Probleem**: Badge blijft zichtbaar

reCAPTCHA v3 is onzichtbaar, maar toont klein badge rechtsonder:
```css
.grecaptcha-badge { visibility: hidden; }
```
Voeg toe aan `globals.css` indien gewenst (met vermelding in privacy policy).

### Google Analytics data niet zichtbaar

**Probleem**: Geen pageviews in dashboard

**Oplossingen**:
1. Wacht 24-48 uur (data processing delay)
2. Check Measurement ID formaat: `G-XXXXXXXXXX`
3. Gebruik "Realtime" view in GA voor directe feedback
4. Test met browser dev tools → Network tab (check gtag requests)
5. Installeer "Google Analytics Debugger" Chrome extension

### E-mails komen niet aan

**Probleem**: Geen e-mail na adoptieaanvraag

**Oplossingen**:
1. Check SMTP instellingen in admin panel
2. Test SMTP connectie via admin panel
3. Check Mailhog (development): http://localhost:8026
4. Bekijk server logs: `docker compose logs web`
5. Check spam folder (productie)

## Database Schema

Nieuwe settings toegevoegd:

```sql
INSERT INTO site_settings (key, value) VALUES 
  ('recaptcha_site_key', ''),
  ('recaptcha_secret_key', ''),
  ('google_analytics_id', '');
```

Migratie bestand: `/database/migrations/add_recaptcha_and_analytics.sql`

## Code Referenties

**reCAPTCHA**:
- Frontend: `/components/AdoptionForm.tsx`
- Backend: `/app/api/adoption-requests/route.ts`
- Verificatie: `/lib/recaptcha.ts`
- Scripts: `/app/layout.tsx`

**Google Analytics**:
- Implementatie: `/app/layout.tsx`
- Settings: `/lib/settings.ts`

**E-mail Notificaties**:
- API handler: `/app/api/adoption-requests/route.ts`
- Mailer: `/lib/mailer.ts`
- Templates: Inline HTML in API route

**Admin Panel**:
- Settings page: `/app/admin/instellingen/page.tsx`
- Forms voor beide features
- Test functionaliteit

## Prestatie Impact

**reCAPTCHA v3**:
- Script size: ~20KB (gzipped)
- Load time: ~100-200ms
- Async geladen, blokkeert geen render
- Minimale impact op form submit (<1s)

**Google Analytics**:
- Script size: ~45KB (gzipped)
- Load time: ~200-300ms
- Async geladen, blokkeert geen render
- Background tracking, geen UX impact

## Security Overwegingen

### reCAPTCHA
-  Secret key alleen server-side gebruikt
-  Tokens single-use (expire na 2 minuten)
-  Score-based verificatie (threshold aanpasbaar)
-  Rate limiting aanbevolen voor extra bescherming

### Google Analytics
-  Measurement ID publiek (niet geheim)
-  Geen PII (Personally Identifiable Information) verzonden
-  Cookie consent vereist voor EU compliance
-  Privacy policy moet GA gebruik vermelden

### E-mail Beveiliging
-  Rate limiting: 10 e-mails/uur per ontvanger
-  Input sanitization voor XSS preventie
-  TLS validatie in productie
-  Header injection preventie
-  SMTP credentials in database (overweeg encryptie)

Zie `/docs/SECURITY_EMAIL.md` voor uitgebreide e-mail security documentatie.

## Support & Documentatie

- [reCAPTCHA v3 Documentation](https://developers.google.com/recaptcha/docs/v3)
- [Google Analytics 4 Documentation](https://support.google.com/analytics/answer/10089681)
- [nodemailer Documentation](https://nodemailer.com/)
