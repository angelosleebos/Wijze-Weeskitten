# Security Fixes - Adoptie Systeem

## Datum: 20 november 2025

## Overzicht Geïmplementeerde Fixes

Deze update bevat kritieke security fixes voor de adoptie-aanvraag functionaliteit, settings API en e-mail templates.

---

## 🔴 Fix 1: Rate Limiting op GET /api/adoption-requests

### Probleem
Het publieke endpoint `GET /api/adoption-requests?email=xxx` had geen rate limiting, waardoor:
- **Email enumeration** mogelijk was (aanvaller kan testen welke e-mails adoptieaanvragen hebben)
- **Privacy-gevoelige data** gestolen kon worden (adressen, telefoonnummers, motivaties)
- **Brute-force attacks** op e-mailadressen geen beperking hadden

### Oplossing
✅ **Rate limiting toegevoegd**: 5 verzoeken per minuut per IP-adres
✅ **HTTP 429 response** bij overschrijding
✅ **Rate limit headers** toegevoegd (`X-RateLimit-Remaining`, `X-RateLimit-Reset`)

**Code**:
```typescript
const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
const rateLimitKey = `adoption-requests-get:${clientIp}`;
const rateLimitResult = checkRateLimit(rateLimitKey, { maxAttempts: 5, windowMs: 60000 });

if (!rateLimitResult.allowed) {
  return NextResponse.json(
    { error: 'Te veel verzoeken. Probeer het later opnieuw.' },
    { status: 429, headers: getRateLimitHeaders(rateLimitResult) }
  );
}
```

### Impact
- ✅ Voorkomt email enumeration attacks
- ✅ Beschermt privacy van aanvragers
- ✅ Minimale impact op legitieme gebruikers (5 requests/min is ruim voldoende)

---

## 🔴 Fix 2: HTML Escaping in E-mail Templates

### Probleem
User input werd **direct** in HTML e-mail templates geplaatst zonder escaping:
```typescript
<p><strong>Aanvrager:</strong> ${name}</p>
<p>${motivation}</p>
```

Hierdoor kon een aanvaller:
- **XSS injecteren** in e-mails naar admin
- **Phishing links** versturen
- **HTML structuur breken** en layout manipuleren

**Voorbeeld aanval**:
```
name: <script>alert('XSS')</script>
motivation: <img src=x onerror="malicious_code()">
```

### Oplossing
✅ **HTML escape functie** geïmplementeerd (`/lib/html-escape.ts`)
✅ **Alle user input** wordt escaped in e-mail templates
✅ **Whitelist approach**: Alleen veilige HTML tags toegestaan

**Code**:
```typescript
// Nieuwe utility functie
export function escapeHtml(text: string | null | undefined): string {
  if (!text) return '';
  return String(text).replace(/[&<>"'/]/g, (char) => HTML_ESCAPE_MAP[char]);
}

// Gebruik in e-mail templates
<p><strong>Aanvrager:</strong> ${escapeHtml(name)}</p>
<p>${escapeHtml(motivation)}</p>
```

### Impact
- ✅ Voorkomt XSS attacks in e-mails
- ✅ Beschermt admin tegen phishing
- ✅ Geen functionele impact (user-facing content blijft hetzelfde)

---

## 🔴 Fix 3: reCAPTCHA Verplicht met Fallback Rate Limiting

### Probleem
reCAPTCHA verificatie was **optioneel**:
```typescript
if (settings.recaptcha_secret_key && recaptcha_token) {
  // verificatie
}
// Als niet geconfigureerd -> GEEN bescherming!
```

Aanvaller kon:
- **Token weglaten** uit POST request
- **Formulier spammen** zonder reCAPTCHA
- **Onbeperkt aanvragen** indienen

### Oplossing
✅ **Twee-laags bescherming**:
1. **Als reCAPTCHA geconfigureerd**: Token is verplicht, verificatie moet slagen
2. **Als NIET geconfigureerd**: Fallback naar agressieve rate limiting (3 aanvragen/uur per IP)

**Code**:
```typescript
if (settings.recaptcha_secret_key) {
  // reCAPTCHA is configured - verify token
  if (!recaptcha_token) {
    return NextResponse.json(
      { error: 'Spam verificatie vereist.' },
      { status: 400 }
    );
  }
  
  const result = await verifyRecaptcha(recaptcha_token, settings.recaptcha_secret_key);
  if (!result.success) {
    return NextResponse.json(
      { error: 'Spam verificatie mislukt.' },
      { status: 400 }
    );
  }
} else {
  // Fallback: Rate limiting (3 requests per hour per IP)
  const rateLimitResult = checkRateLimit(rateLimitKey, { 
    maxAttempts: 3, 
    windowMs: 3600000 
  });
  
  if (!rateLimitResult.allowed) {
    return NextResponse.json(
      { error: 'Te veel aanvragen. Probeer het over een uur opnieuw.' },
      { status: 429 }
    );
  }
}
```

### Impact
- ✅ Voorkomt spam zelfs zonder reCAPTCHA configuratie
- ✅ Beschermt tegen bot attacks
- ⚠️ Fallback rate limit (3/uur) is agressief - **configureer reCAPTCHA voor productie**

---

## 🔴 Fix 4: Settings API - Sensitive Data Exposure

### Probleem
`GET /api/settings` was **publiek toegankelijk** en returneerde **alle** settings, inclusief:
- `smtp_pass` - SMTP wachtwoord (plain-text!)
- `smtp_user` - SMTP gebruikersnaam
- `recaptcha_secret_key` - reCAPTCHA secret key

**Impact**: Iedereen kon credentials stelen!

### Oplossing
✅ **Publieke API filtert gevoelige keys**:
```typescript
const SENSITIVE_KEYS = [
  'smtp_pass',
  'smtp_user', 
  'recaptcha_secret_key'
];

result.rows.forEach(row => {
  if (!SENSITIVE_KEYS.includes(row.key)) {
    settings[row.key] = row.value;
  }
});
```

✅ **Nieuw admin endpoint**: `/api/settings/admin` (authenticated)
- Returneert ALLE settings
- Vereist JWT authenticatie
- Alleen toegankelijk voor admin

✅ **Admin panel gebruikt authenticated endpoint**:
```typescript
// Was: const res = await fetch('/api/settings');
// Nu:
const res = await authenticatedFetch('/api/settings/admin');
```

### Impact
- ✅ Voorkomt credential leakage
- ✅ Publieke API nog steeds bruikbaar voor non-sensitive data
- ✅ Admin panel blijft volledig functioneel

---

## Gewijzigde Bestanden

### Nieuwe bestanden:
- `/lib/html-escape.ts` - HTML escaping utility
- `/app/api/settings/admin/route.ts` - Authenticated settings endpoint
- `/docs/SECURITY_FIXES_ADOPTION.md` - Deze documentatie

### Gewijzigde bestanden:
- `/app/api/adoption-requests/route.ts` - Rate limiting + HTML escaping + reCAPTCHA mandatory
- `/app/api/settings/route.ts` - Filter sensitive keys
- `/app/admin/instellingen/page.tsx` - Use authenticated endpoint

---

## Testing

### Test Rate Limiting (GET endpoint)
```bash
# Spam het endpoint (moet na 5x geblokkeerd worden)
for i in {1..10}; do
  curl "http://localhost:3000/api/adoption-requests?email=test@example.com"
done

# Verwacht: 5x HTTP 200, daarna HTTP 429
```

### Test HTML Escaping
```bash
# Submit aanvraag met XSS payload
curl -X POST http://localhost:3000/api/adoption-requests \
  -H "Content-Type: application/json" \
  -d '{
    "cat_id": 1,
    "name": "<script>alert(\"XSS\")</script>",
    "email": "test@example.com",
    "motivation": "<img src=x onerror=alert(1)>"
  }'

# Check Mailhog (localhost:8026)
# Verwacht: Escaped HTML in e-mail (geen XSS execution)
```

### Test reCAPTCHA Mandatory
```bash
# Submit aanvraag ZONDER recaptcha_token (met reCAPTCHA geconfigureerd)
curl -X POST http://localhost:3000/api/adoption-requests \
  -H "Content-Type: application/json" \
  -d '{
    "cat_id": 1,
    "name": "Test",
    "email": "test@example.com",
    "motivation": "Test"
  }'

# Verwacht: HTTP 400 "Spam verificatie vereist"
```

### Test Settings API
```bash
# Public endpoint - moet GEEN gevoelige keys bevatten
curl http://localhost:3000/api/settings | jq '.settings | keys'

# Verwacht: smtp_pass, smtp_user, recaptcha_secret_key zijn NIET in output

# Admin endpoint - moet authenticatie vereisen
curl http://localhost:3000/api/settings/admin

# Verwacht: HTTP 401 Unauthorized
```

---

## Resterende Security Concerns

### 🟡 Medium Prioriteit

#### 1. Credentials Plain-text in Database
**Probleem**: SMTP wachtwoorden en reCAPTCHA secret keys worden **onversleuteld** opgeslagen.

**Aanbeveling**:
- Encrypteer gevoelige settings met AES-256
- Gebruik environment variables als alternatief
- Overweeg Azure Key Vault / AWS Secrets Manager voor productie

#### 2. In-Memory Rate Limiter
**Probleem**: Rate limit state wordt gereset bij server restart en werkt niet in multi-instance setup.

**Aanbeveling**:
- Migreer naar Redis rate limiter voor productie
- Implementeer distributed rate limiting
- Overweeg Cloudflare Rate Limiting voor extra laag

### 🟢 Lage Prioriteit

#### 3. IP-based Rate Limiting Bypass
**Probleem**: Aanvaller met rotating IP's kan rate limits omzeilen.

**Aanbeveling**:
- Combineer IP + User-Agent + Fingerprinting
- CAPTCHA challenge na X failed attempts
- Honeypot fields voor bot detectie

#### 4. Email Validation Strengheid
**Huidige validatie** in `mailer.ts`:
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
```

**Aanbeveling**:
- Gebruik RFC 5322 compliant validator
- Check disposable email domains
- Implement email verification (confirmation link)

---

## Migratie Checklist

Voor bestaande deployments:

- [ ] Update codebase naar laatste versie
- [ ] Test rate limiting in development
- [ ] Test HTML escaping in e-mails (check Mailhog)
- [ ] **Configureer reCAPTCHA voor productie** (fallback rate limit is agressief!)
- [ ] Update environment variables indien nodig
- [ ] Monitor rate limit logs voor false positives
- [ ] Overweeg credentials encryptie voor productie

---

## Support & Vragen

Voor vragen over deze security fixes:
- Check `/docs/RECAPTCHA_ANALYTICS_EMAIL.md` voor setup instructies
- Check `/docs/SECURITY_EMAIL.md` voor algemene e-mail security
- Test alles lokaal met Docker + Mailhog voordat je naar productie gaat

**Belangrijk**: Configureer reCAPTCHA voor productie! De fallback rate limiting (3/uur) is te restrictief voor echte gebruikers.
