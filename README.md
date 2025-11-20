# Kattenstichting Website

Een moderne website voor een kattenstichting met CMS, donatiemogelijkheid via iDEAL en meer.

## Features

- 🐱 **Katten overzicht** - Toon katten die een thuis zoeken
- 📝 **Blog** - Deel verhalen en nieuws
- 💰 **Donaties via iDEAL** - Veilig doneren met Mollie
- 👥 **Contact pagina** - Overzicht van vrijwilligers
- 🔧 **CMS** - Beheer alle content via admin panel
- 🐳 **Docker** - Volledige Docker setup met PostgreSQL 16

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL 16
- **Payments**: Mollie (iDEAL)
- **Container**: Docker & Docker Compose

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

3. Pas de environment variabelen aan in `.env`:
   - Voeg je Mollie API key toe
   - Pas JWT secret aan
   - Database credentials zijn al correct voor Docker

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

Standaard admin gebruiker aanmaken:
```bash
docker-compose exec db psql -U kattenstichting -d kattenstichting -c "INSERT INTO admins (username, email, password_hash) VALUES ('admin', 'admin@kattenstichting.nl', '\$2a\$10\$YourHashedPasswordHere');"
```

Je moet zelf een wachtwoord hashen met bcrypt en de hash invullen.

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

## Licentie

MIT

## Contact

Voor vragen: info@kattenstichting.nl
