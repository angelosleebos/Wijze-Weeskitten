# SMTP E-mail Configuratie

## Overzicht

De website ondersteunt nu SMTP e-mail functionaliteit voor het verzenden van e-mails. Voor ontwikkeling en testing wordt Mailhog gebruikt.

## Mailhog (Development)

Mailhog is een e-mail testing tool die draait in Docker en alle uitgaande e-mails onderschept.

### Toegang
- **Web Interface**: http://localhost:8026
- **SMTP Server**: mailhog:1025 (binnen Docker network)

### Standaard Configuratie (Docker)
```
SMTP Host: mailhog
SMTP Port: 1025
SMTP Secure: false
SMTP User: (leeg)
SMTP Pass: (leeg)
Afzender: noreply@wijzeweeskitten.nl
```

## Admin Instellingen

Alle SMTP instellingen kunnen beheerd worden via de admin interface:

1. Login op `/admin`
2. Ga naar **Instellingen**
3. Scroll naar **SMTP E-mail Instellingen**
4. Configureer de instellingen
5. Klik op **Test Verzenden** om de configuratie te testen

## Productie Configuratie

Voor productie kun je verschillende SMTP providers gebruiken:

### Gmail (met App Password)
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Secure: false (STARTTLS)
SMTP User: jouw-email@gmail.com
SMTP Pass: [App Password - niet je normale wachtwoord]
```

**Gmail App Password aanmaken:**
1. Ga naar Google Account Security
2. Schakel 2-Factor Authentication in
3. Ga naar "App passwords"
4. Genereer een nieuw App Password voor "Mail"

### SendGrid
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP Secure: false
SMTP User: apikey
SMTP Pass: [Je SendGrid API Key]
```

### Amazon SES
```
SMTP Host: email-smtp.eu-west-1.amazonaws.com
SMTP Port: 587
SMTP Secure: false
SMTP User: [AWS SMTP Username]
SMTP Pass: [AWS SMTP Password]
```

### Mailgun
```
SMTP Host: smtp.mailgun.org
SMTP Port: 587
SMTP Secure: false
SMTP User: [Mailgun SMTP username]
SMTP Pass: [Mailgun SMTP password]
```

## Code Gebruik

```typescript
import { sendEmail } from '@/lib/mailer';

// Verzend een e-mail
await sendEmail({
  to: 'ontvanger@example.com',
  subject: 'Onderwerp',
  html: '<h1>HTML inhoud</h1>',
  text: 'Plain text fallback'
});
```

## Test E-mail API

Er is een API endpoint beschikbaar voor het testen van de e-mail configuratie:

**Endpoint**: `POST /api/email/test`

**Test Verbinding:**
```json
{
  "action": "test-connection"
}
```

**Verzend Test E-mail:**
```json
{
  "action": "send-test",
  "to": "test@example.com"
}
```

## Security Best Practices

1. **Gebruik nooit je primaire wachtwoord** - Gebruik altijd App Passwords of API keys
2. **Beveilig je credentials** - Sla SMTP wachtwoorden op in de database, niet in code
3. **Gebruik TLS/SSL** - Voor productie altijd beveiligde verbindingen gebruiken
4. **Rate limiting** - Voorkom misbruik door rate limiting toe te passen
5. **Valideer e-mail adressen** - Controleer altijd de geldigheid van e-mail adressen

## Troubleshooting

### E-mails worden niet verzonden
- Check de SMTP settings in de admin
- Gebruik de "Test Verzenden" functie
- Check Mailhog web interface (development)
- Check Docker logs: `docker logs kattenstichting-web`

### Authentication errors
- Controleer username en password
- Voor Gmail: gebruik App Password, niet je normale wachtwoord
- Check of 2FA is ingeschakeld (vereist voor Gmail App Passwords)

### Connection refused
- Check of de SMTP host en port correct zijn
- Voor Docker: gebruik `mailhog` als host, niet `localhost`
- Check firewall settings

### Self-signed certificate errors
- Voor development: rejectUnauthorized is al op false gezet
- Voor productie: gebruik een geldige SSL certificaat

## Environment Variabelen

Je kunt ook SMTP settings via environment variabelen configureren (fallback):

```env
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM=noreply@wijzeweeskitten.nl
```

**Let op:** Settings uit de database hebben voorrang boven environment variabelen.
