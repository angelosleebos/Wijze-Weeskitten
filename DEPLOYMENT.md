# Deployment Guide - Kattenstichting Website

## Productie Deployment

### 1. Server Vereisten

- Docker & Docker Compose
- PostgreSQL 16 (of gebruik de Docker PostgreSQL container)
- Node.js 20+ (voor builds zonder Docker)
- Nginx of andere reverse proxy (aanbevolen)
- SSL certificaat (Let's Encrypt aanbevolen)

### 2. Environment Setup

1. Maak productie `.env` bestand aan:
```bash
# Genereer een sterke JWT secret
openssl rand -base64 32

# Maak .env file
cat > .env << 'EOF'
DATABASE_URL=postgresql://user:password@localhost:5432/kattenstichting_prod
MOLLIE_API_KEY=live_your_real_mollie_key
JWT_SECRET=paste_the_generated_secret_here
NEXT_PUBLIC_API_URL=https://yourdomain.com
NODE_ENV=production
EOF
```

**KRITIEKE SECURITY PUNTEN:**
- JWT_SECRET MOET minstens 32 karakters random string zijn
- Gebruik LIVE Mollie key, niet test key
- Database wachtwoord moet sterk zijn (min. 16 karakters)
- Bewaar `.env` NOOIT in git of publieke locaties
- Gebruik environment secrets in productie (Azure Key Vault, AWS Secrets Manager, etc.)

2. Zorg dat Mollie webhook correct is geconfigureerd:
   - URL: `https://yourdomain.com/api/donations/webhook`
   - Methode: POST
   - Events: payment.created, payment.paid, payment.failed

### 3. Database Setup

```bash
# Maak database aan
createdb kattenstichting_prod

# Run migrations
npm run db:migrate

# Seed met initial data (optioneel)
npm run db:seed

# Maak admin gebruiker aan
npm run admin:create
```

### 4. Docker Productie Deployment

```bash
# Build production image
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### 5. Nginx Reverse Proxy

Voorbeeld Nginx configuratie:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 6. SSL Certificaat (Let's Encrypt)

```bash
# Installeer certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Verkrijg certificaat
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal is standaard ingeschakeld
sudo certbot renew --dry-run
```

### 7. Monitoring & Backups

#### Database Backups

```bash
# Maak backup script aan
cat > /usr/local/bin/backup-db.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
pg_dump -U kattenstichting kattenstichting_prod > /backups/kattenstichting_$TIMESTAMP.sql
# Bewaar alleen laatste 30 dagen
find /backups -name "kattenstichting_*.sql" -mtime +30 -delete
EOF

chmod +x /usr/local/bin/backup-db.sh

# Voeg toe aan crontab (dagelijks om 2:00 AM)
crontab -e
0 2 * * * /usr/local/bin/backup-db.sh
```

#### Application Monitoring

```bash
# Check logs
docker-compose logs -f web

# Monitor database
docker-compose exec db psql -U kattenstichting -d kattenstichting_prod -c "SELECT * FROM donations ORDER BY created_at DESC LIMIT 10;"
```

### 8. Updates Deployen

```bash
# Pull nieuwe code
git pull origin main

# Rebuild en restart
docker-compose -f docker-compose.prod.yml up -d --build

# Of zonder Docker
npm install
npm run build
pm2 restart kattenstichting
```

### 9. Performance Optimalisatie

1. **Next.js Image Optimization**
   - Images worden automatisch geoptimaliseerd
   - Zorg dat `domains` in `next.config.js` correct zijn

2. **Database Indexen**
   - Al aanwezig in schema.sql
   - Monitor query performance met `EXPLAIN ANALYZE`

3. **Caching**
   - Next.js gebruikt automatisch ISR (Incremental Static Regeneration)
   - Overweeg Redis voor session storage

### 10. Security Checklist

- [ ] SSL certificaat geïnstalleerd en geldig
- [ ] Environment variabelen veilig opgeslagen (niet in git!)
- [ ] Database wachtwoorden sterk en uniek (min. 16 karakters)
- [ ] JWT_SECRET is een sterke random string (min. 32 chars, gebruik `openssl rand -base64 32`)
- [ ] Admin wachtwoord voldoet aan eisen (min. 12 chars, hoofdletter, cijfer, speciaal karakter)
- [ ] Mollie API key is LIVE key (niet test)
- [ ] Firewall geconfigureerd (alleen 80, 443, 22 open)
- [ ] Database backups draaien en getest
- [ ] Regular security updates gepland
- [ ] API endpoints beschermd met JWT authenticatie
- [ ] Rate limiting geïmplementeerd op login endpoint (optioneel maar aanbevolen)
- [ ] HTTPS redirect werkt correct
- [ ] Database heeft geen publieke toegang
- [ ] Admin panel alleen toegankelijk via HTTPS

## Mollie iDEAL Setup

1. **Account Aanmaken**
   - Ga naar https://www.mollie.com
   - Registreer bedrijfsaccount
   - Verifieer identiteit (KVK vereist)

2. **API Keys**
   - Test key voor development
   - Live key voor productie
   - Gebruik verschillende keys per omgeving

3. **Webhook Configuratie**
   - Mollie dashboard → Developers → Webhooks
   - URL: `https://yourdomain.com/api/donations/webhook`
   - Test webhook voordat je live gaat

4. **Payment Methods**
   - Activeer iDEAL in dashboard
   - Configureer andere betaalmethoden indien gewenst

## Troubleshooting

### Database Connectie Problemen

```bash
# Test database connectie
docker-compose exec db psql -U kattenstichting -d kattenstichting_prod -c "SELECT 1;"

# Check logs
docker-compose logs db
```

### Next.js Build Errors

```bash
# Clear build cache
rm -rf .next

# Rebuild
npm run build
```

### Mollie Webhook Niet Werkt

1. Check of webhook URL correct is in Mollie dashboard
2. Verify SSL certificaat is geldig
3. Test met Mollie's webhook tester
4. Check application logs

## Support

Voor vragen of problemen:
- Email: support@kattenstichting.nl
- Check logs: `docker-compose logs -f`
- Database status: `docker-compose exec db pg_isready`
