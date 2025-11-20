# E-mail Security - Analyse & Maatregelen

## Geïmplementeerde Security Maatregelen

### 1. ✅ E-mail Validatie
**Probleem:** Ongevalideerde e-mail adressen kunnen leiden tot crashes of misbruik.

**Oplossing:**
```typescript
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```
- Regex validatie voor e-mail formaat
- Filter ongeldige adressen voordat verzenden
- Voorkomt header injection via malformed e-mails

### 2. ✅ Rate Limiting
**Probleem:** Onbeperkt e-mails verzenden kan leiden tot:
- Spam misbruik
- SMTP provider blokkering
- Resource exhaustion

**Oplossing:**
```typescript
const MAX_EMAILS_PER_HOUR = 10;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour
```
- Maximum 10 e-mails per uur per ontvanger
- In-memory rate limiter (voor productie: Redis aanbevolen)
- Automatische cleanup na time window

### 3. ✅ Input Sanitization
**Probleem:** Ongesaniteerde input kan leiden tot header injection attacks.

**Oplossing:**
```typescript
const sanitizedSubject = options.subject.substring(0, 200);
```
- Subject line length beperking (200 karakters)
- E-mail address sanitization
- Voorkomt newline injection in headers

### 4. ✅ TLS/SSL Certificate Validatie
**Probleem:** `rejectUnauthorized: false` staat man-in-the-middle attacks toe.

**Oplossing:**
```typescript
tls: {
  rejectUnauthorized: process.env.NODE_ENV === 'production',
}
```
- Development: self-signed certificates toegestaan (Mailhog)
- Production: strikte certificate validatie
- Voorkomt MITM attacks in productie

### 5. ✅ Connection Timeout
**Probleem:** Hangende connections kunnen resources blokkeren.

**Oplossing:**
```typescript
connectionTimeout: 10000, // 10 seconds
```
- 10 seconden timeout op SMTP connecties
- Voorkomt resource exhaustion
- Snelle failure detection

### 6. ✅ SMTP Credentials Validatie
**Probleem:** Lege of ontbrekende credentials kunnen errors veroorzaken.

**Oplossing:**
```typescript
if (!settings.smtp_host || !settings.smtp_port) {
  console.error('SMTP settings not configured');
  return false;
}
```
- Validatie van vereiste SMTP settings
- Graceful failure bij ontbrekende configuratie
- Voorkomt crashes door misconfiguratie

### 7. ✅ Header Injection Prevention
**Probleem:** Kwaadwillige headers kunnen worden geïnjecteerd via email fields.

**Oplossing:**
```typescript
headers: {
  'X-Mailer': 'Kattenstichting-Website',
}
```
- Custom header om bron te identificeren
- Nodemailer escapet automatisch headers
- Subject length limiting

## Resterende Security Concerns

### ⚠️ MEDIUM PRIORITY

#### 1. SMTP Credentials in Database
**Huidige staat:** Wachtwoorden worden plain-text opgeslagen in database.

**Risico:**
- Database breach exposeert SMTP credentials
- Admin kan alle SMTP settings zien

**Aanbeveling:**
```typescript
// Encrypt SMTP password before storing
import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.SMTP_ENCRYPTION_KEY;

function encryptPassword(password: string): string {
  const cipher = crypto.createCipher('aes-256-cbc', ENCRYPTION_KEY);
  return cipher.update(password, 'utf8', 'hex') + cipher.final('hex');
}

function decryptPassword(encrypted: string): string {
  const decipher = crypto.createDecipher('aes-256-cbc', ENCRYPTION_KEY);
  return decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
}
```

#### 2. Rate Limiter in Memory
**Huidige staat:** Rate limiting gebruikt in-memory Map.

**Risico:**
- Reset bij server restart
- Niet geschikt voor multi-instance deployment
- Geen persistentie

**Aanbeveling:**
```typescript
// Use Redis for distributed rate limiting
import Redis from 'ioredis';
const redis = new Redis();

async function checkRateLimit(email: string): Promise<boolean> {
  const key = `ratelimit:email:${email}`;
  const current = await redis.incr(key);
  
  if (current === 1) {
    await redis.expire(key, 3600); // 1 hour
  }
  
  return current <= MAX_EMAILS_PER_HOUR;
}
```

#### 3. HTML Content Sanitization
**Huidige staat:** HTML content wordt niet gesanitized.

**Risico:**
- XSS in e-mail clients die HTML renderen
- Phishing via embedded links

**Aanbeveling:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitizedHtml = DOMPurify.sanitize(options.html, {
  ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'a', 'ul', 'ol', 'li'],
  ALLOWED_ATTR: ['href'],
});
```

### ℹ️ LOW PRIORITY

#### 4. Email Logging
**Aanbeveling:** Log alle verzonden e-mails voor audit trail.

```typescript
// Log to database
await pool.query(
  'INSERT INTO email_log (to_address, subject, sent_at, success) VALUES ($1, $2, NOW(), $3)',
  [options.to, options.subject, true]
);
```

#### 5. SPF, DKIM, DMARC
**Aanbeveling:** Configureer DNS records voor betere deliverability.

```
# SPF Record
v=spf1 include:_spf.google.com ~all

# DMARC Record
v=DMARC1; p=quarantine; rua=mailto:dmarc@wijzeweeskitten.nl
```

#### 6. Bounce Handling
**Aanbeveling:** Implementeer bounce detection en automatic list cleaning.

```typescript
// Handle bounced emails
transporter.on('bounce', (info) => {
  console.log('Bounced email:', info);
  // Add to blacklist
});
```

## Security Checklist voor Productie

- [x] E-mail validatie geïmplementeerd
- [x] Rate limiting actief
- [x] TLS certificate validatie (production)
- [x] Connection timeouts ingesteld
- [x] Input sanitization (subject)
- [ ] SMTP wachtwoorden encrypten
- [ ] Redis rate limiter implementeren
- [ ] HTML content sanitizen
- [ ] E-mail logging toevoegen
- [ ] SPF/DKIM/DMARC configureren
- [ ] Bounce handling implementeren

## Best Practices

1. **Gebruik App Passwords** - Nooit normale account wachtwoorden
2. **Test met Mailhog** - Altijd testen in development
3. **Monitor Rate Limits** - Track SMTP provider limits
4. **Rotate Credentials** - Periodiek SMTP wachtwoorden verversen
5. **Audit Logs** - Bewaar logs van verzonden e-mails
6. **Error Handling** - Geen sensitive info in error messages
7. **GDPR Compliance** - E-mail adressen zijn persoonsgegevens

## Recommended Production Setup

### Gmail (Recommended for small scale)
- ✅ App Passwords support
- ✅ Built-in spam filtering
- ⚠️ 500 emails/day limit

### SendGrid (Recommended for medium scale)
- ✅ 100 emails/day free tier
- ✅ Professional deliverability
- ✅ Detailed analytics

### Amazon SES (Recommended for large scale)
- ✅ Very low cost ($0.10/1000 emails)
- ✅ High volume support
- ✅ Excellent deliverability
- ⚠️ Requires AWS account

## Incident Response

Als SMTP credentials gecompromitteerd zijn:

1. **Direct:**
   - Verander SMTP wachtwoord in provider
   - Update credentials in admin panel
   - Check email logs voor misbruik

2. **Binnen 24 uur:**
   - Review alle verzonden e-mails
   - Notificeer ontvangers bij spam
   - Rapporteer bij provider

3. **Preventie:**
   - Implementeer credential encryption
   - Enable 2FA op SMTP provider
   - Monitor voor ongewone activiteit
