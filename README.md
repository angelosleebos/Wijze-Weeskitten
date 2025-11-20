# Kattenstichting Website

Een moderne website voor een kattenstichting met CMS, donatiemogelijkheid via iDEAL en meer.

## Features

- **Katten overzicht** - Toon katten die een thuis zoeken
- **Blog** - Deel verhalen en nieuws
- **Donaties via iDEAL** - Veilig doneren met Mollie
- **Contact pagina** - Overzicht van vrijwilligers
- **CMS** - Beheer alle content via admin panel
- **Docker** - Volledige Docker setup met PostgreSQL 16

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 3.3
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 16
- **Payments**: Mollie (iDEAL)
- **Container**: Docker & Docker Compose

## Security Checklist

 **Voordat je live gaat, check het volgende:**

- [ ] `.env` bevat een sterke JWT_SECRET (gebruik `openssl rand -base64 32`)
- [ ] Admin wachtwoord voldoet aan eisen (min. 12 tekens, hoofdletter, cijfer, speciaal karakter)
- [ ] MOLLIE_API_KEY is een live key (niet test key)
- [ ] DATABASE_URL bevat sterke database credentials
- [ ] `.env` staat NIET in git (check met `git status`)
- [ ] All admin API endpoints zijn beschermd met JWT authenticatie
- [ ] Firewall is correct geconfigureerd
- [ ] SSL certificaat is geïnstalleerd
- [ ] Database backups zijn geconfigureerd

## Lokaal Development

### Vereisten

- Docker & Docker Compose
- Node.js 20+ (optioneel, voor development zonder Docker)

### Setup met Docker

1. Clone de repository:
```bash
git clone <repository-url>
cd website-kattenstichting
```

2. Kopieer `.env.example` naar `.env`:
```bash
cp .env.example .env
```

3. **BELANGRIJK - Pas de environment variabelen aan in `.env`:**
   - Genereer een sterke JWT_SECRET: `openssl rand -base64 32`
   - Voeg je Mollie API key toe (krijg je van https://mollie.com)
   - Database credentials zijn al correct voor Docker
   - **LET OP: Commit `.env` NOOIT naar git!**

4. Start de applicatie:
```bash
docker-compose up -d
```

5. De applicatie is nu beschikbaar op http://localhost:3000

6. Database migrations worden automatisch uitgevoerd bij het starten.

### Setup zonder Docker

1. Installeer dependencies:
```bash
npm install
```

2. Zorg dat PostgreSQL 16 draait en maak een database aan:
```bash
createdb kattenstichting
```

3. Kopieer `.env.example` naar `.env` en pas de database URL aan.

4. Run database migrations:
```bash
npm run db:migrate
```

5. Start development server:
```bash
npm run dev
```

## Docker Commands

```bash
# Start alle services
docker-compose up -d

# Stop alle services
docker-compose down

# Bekijk logs
docker-compose logs -f

# Rebuild images
docker-compose up -d --build

# Stop en verwijder alle data
docker-compose down -v
```

## Database Schema

De database bevat de volgende tabellen:
- `admins` - CMS gebruikers
- `cats` - Katten die onderdak zoeken
- `blog_posts` - Blog artikelen
- `volunteers` - Vrijwilligers/contactpersonen
- `donations` - Donaties via iDEAL
- `site_settings` - Website configuratie

## Admin Panel

Toegang tot het CMS admin panel: http://localhost:3000/admin

### Admin gebruiker aanmaken:

```bash
# Automatisch met password validatie
npm run admin:create

# Of via Docker
docker-compose exec web npm run admin:create
```

Wachtwoord eisen:
- Minimaal 12 karakters
- Minimaal 1 hoofdletter
- Minimaal 1 kleine letter  
- Minimaal 1 cijfer
- Minimaal 1 speciaal karakter (!@#$%^&*)

## Productie Build

```bash
# Build voor productie
npm run build

# Start productie server
npm start
```

## API Endpoints

- `GET/POST /api/cats` - Katten beheren
- `GET/POST /api/blog` - Blog posts beheren
- `GET/POST /api/volunteers` - Vrijwilligers beheren
- `POST /api/donations` - Donaties aanmaken
- `POST /api/donations/webhook` - Mollie webhook
- `GET/PUT /api/settings` - Site instellingen
- `POST /api/auth/login` - Admin login

## Mollie Setup

1. Registreer bij [Mollie](https://www.mollie.com)
2. Haal je API key op (test of live)
3. Voeg de key toe aan `.env`:
```
MOLLIE_API_KEY=test_xxxxx
```
4. Configureer webhook URL in Mollie dashboard naar je productie URL

## Screenshots

📸 Bekijk screenshots van alle features in [`/docs/screenshots/README.md`](./docs/screenshots/README.md)

Belangrijkste features:
- Admin dashboard met statistieken
- Rich text editor (Tiptap) voor blog posts
- Search & filters voor katten en blog
- Adoptie aanvraag systeem
- iDEAL donaties met Mollie
- Security features (rate limiting, CSRF, XSS protection)

## Licentie

MIT

## Contact

Voor vragen: info@kattenstichting.nl
