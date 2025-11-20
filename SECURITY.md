# Security Policy

## Beveiligingsmaatregelen

Deze applicatie implementeert de volgende beveiligingsmaatregelen:

### Authenticatie & Autorisatie

- **JWT Token Authenticatie**: Alle admin API endpoints zijn beschermd met JWT tokens
- **Password Hashing**: Bcrypt met salt voor het hashen van wachtwoorden
- **Strong Password Policy**: Wachtwoorden moeten voldoen aan:
  - Minimaal 12 karakters
  - Minimaal 1 hoofdletter
  - Minimaal 1 kleine letter
  - Minimaal 1 cijfer
  - Minimaal 1 speciaal karakter (!@#$%^&*)

### API Security

- **Protected Endpoints**: Alle POST/PUT/DELETE endpoints vereisen authenticatie
- **JWT Verification**: Tokens worden geverifieerd bij elke admin API call
- **Error Handling**: Geen sensitive informatie in error messages

### Environment Variables

- **JWT_SECRET**: Moet minimaal 32 karakters random string zijn
  ```bash
  # Genereer met:
  openssl rand -base64 32
  ```
- **.env bestand**: Staat in .gitignore en wordt NOOIT gecommit naar git
- **Production Secrets**: Gebruik een secrets manager (Azure Key Vault, AWS Secrets Manager, etc.)

### Database Security

- **Prepared Statements**: Alle database queries gebruiken parameterized queries
- **Connection Pooling**: Veilige database connecties via pg Pool
- **No Direct Access**: Database alleen toegankelijk via backend API

### HTTPS & Transport Security

- **SSL/TLS Required**: Productie moet HTTPS gebruiken
- **Mollie Webhooks**: Alleen over HTTPS in productie
- **Secure Cookies**: Gebruik HTTP-only cookies in productie (toekomstige verbetering)

## Bekende Beperkingen

### Huidige Implementatie

1. **Client-side Token Storage**: Tokens worden opgeslagen in localStorage
   - **Risico**: Kwetsbaar voor XSS attacks
   - **Mitigatie**: In toekomstige versie overstappen naar HTTP-only cookies

2. **No Rate Limiting**: Login endpoint heeft geen rate limiting
   - **Risico**: Brute force attacks mogelijk
   - **Mitigatie**: Implementeer rate limiting middleware (optioneel)

3. **No CSRF Protection**: Geen CSRF tokens geïmplementeerd
   - **Risico**: Cross-site request forgery attacks
   - **Mitigatie**: Gebruik SameSite cookies en CSRF tokens in productie

## Security Checklist voor Production

### Voordat je live gaat:

#### Environment & Secrets
- [ ] `.env` bestand bevat sterke JWT_SECRET (genereer met `openssl rand -base64 32`)
- [ ] MOLLIE_API_KEY is een live key (niet test key)
- [ ] DATABASE_URL bevat sterke database credentials
- [ ] `.env` staat NIET in git repository (`git status` moet het niet tonen)
- [ ] Production secrets staan in een secrets manager

#### Admin Account
- [ ] Admin wachtwoord voldoet aan eisen (min. 12 chars, hoofdletter, cijfer, speciaal karakter)
- [ ] Admin account is aangemaakt met `npm run admin:create`
- [ ] Test admin accounts zijn verwijderd

#### Infrastructure
- [ ] SSL certificaat is geïnstalleerd en geldig
- [ ] HTTPS redirect is geconfigureerd
- [ ] Firewall staat alleen 80, 443 en 22 open
- [ ] Database heeft geen publieke toegang
- [ ] Database backups zijn geconfigureerd en getest

#### Application
- [ ] NODE_ENV is ingesteld op 'production'
- [ ] Error messages tonen geen sensitive data
- [ ] Logging is geconfigureerd (zonder wachtwoorden/tokens)
- [ ] Health checks zijn geconfigureerd
- [ ] Monitoring is actief

#### Mollie Integration
- [ ] Mollie webhook URL is correct geconfigureerd
- [ ] Webhook URL gebruikt HTTPS
- [ ] Test payments werken correct
- [ ] Live API key is actief

## Security Updates

### Dependencies

Controleer regelmatig op security vulnerabilities:

```bash
# Check voor vulnerabilities
npm audit

# Fix automatisch fixable issues
npm audit fix

# Bekijk details
npm audit --json
```

### Aanbevolen Update Interval

- **Dependencies**: Maandelijks
- **Security patches**: Onmiddellijk bij critical vulnerabilities
- **Node.js**: Bij nieuwe LTS releases
- **PostgreSQL**: Bij nieuwe stable releases

## Rapporteren van Security Issues

Als je een security vulnerability ontdekt:

1. **NIET** publiekelijk rapporteren via GitHub issues
2. Stuur een email naar: [info@wijzeweeskitten.nl](mailto:info@wijzeweeskitten.nl)
3. Include:
   - Beschrijving van de vulnerability
   - Steps to reproduce
   - Mogelijke impact
   - Suggestie voor fix (optioneel)

We reageren binnen 48 uur op security reports.

## Best Practices voor Developers

### JWT Token Handling

```typescript
// GOED: Gebruik altijd requireAuth voor protected endpoints
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    requireAuth(request); // Throws error if not authenticated
    // ... rest of code
  } catch (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
```

### Password Handling

```typescript
// GOED: Gebruik bcrypt voor password hashing
const salt = await bcrypt.genSalt(10);
const password_hash = await bcrypt.hash(password, salt);

// NOOIT: Plain text passwords opslaan
// NOOIT: Wachtwoorden loggen
// NOOIT: Wachtwoorden in error messages
```

### Database Queries

```typescript
// GOED: Gebruik parameterized queries
await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

// FOUT: String concatenation (SQL injection risk!)
// await pool.query(`SELECT * FROM users WHERE id = ${userId}`);
```

### Environment Variables

```typescript
// GOED: Check of required env vars bestaan
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET is not configured');
}

// GOED: Gebruik defaults alleen voor niet-security-critical vars
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// FOUT: Default values voor secrets
// const jwtSecret = process.env.JWT_SECRET || 'default-secret';
```

## Compliance & Privacy

### GDPR Compliance

- Donor gegevens worden opgeslagen (naam, email)
- Geen tracking cookies zonder consent
- Users kunnen data deletion aanvragen

### Data Retention

- Donations: Bewaard voor boekhouding (minimaal 7 jaar)
- Admin logs: 90 dagen
- Session tokens: 7 dagen geldigheid

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security Best Practices](https://nextjs.org/docs/going-to-production#security)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/security.html)
- [Mollie Security](https://docs.mollie.com/overview/security)

## Changelog

### 2025-01-20 - Security Improvements
-  Removed JWT secret fallback
-  Added JWT authentication middleware
-  Protected all admin API endpoints
-  Added password strength validation
-  Updated .gitignore to exclude .env files
-  Generated secure JWT_SECRET
-  Added security documentation
