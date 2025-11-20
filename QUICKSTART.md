# Quick Start Guide 🚀

## Snel aan de slag met Docker

### 1. Installeer Docker
- Download Docker Desktop: https://www.docker.com/products/docker-desktop
- Start Docker Desktop

### 2. Start de applicatie

**BELANGRIJK:** Voordat je start, controleer je `.env` bestand:
- JWT_SECRET moet een sterke random string zijn (genereer met `openssl rand -base64 32`)
- MOLLIE_API_KEY moet geldig zijn

```bash
# Navigeer naar project folder
cd website-kattenstichting

# Start alle services (database + web)
npm run docker:up

# Of gebruik direct docker-compose
docker-compose up -d
```

De applicatie start nu op http://localhost:3000

### 3. Database setup (eerste keer)

De database wordt automatisch aangemaakt met het schema. Voeg nu een admin gebruiker toe:

```bash
# Maak admin gebruiker aan (met wachtwoord validatie)
npm run admin:create

# Of direct via docker
docker-compose exec web npm run admin:create
```

Volg de prompts om gebruikersnaam, email en wachtwoord in te voeren.

**Wachtwoord eisen:**
- Minimaal 12 karakters
- Minimaal 1 hoofdletter
- Minimaal 1 cijfer
- Minimaal 1 speciaal karakter (!@#$%^&*)

### 4. (Optioneel) Seed database met voorbeelddata

```bash
npm run db:seed

# Of via docker
docker-compose exec web npm run db:seed
```

### 5. Login op CMS

Ga naar http://localhost:3000/admin en log in met de admin credentials die je hebt aangemaakt.

## Pagina's

- **Home**: http://localhost:3000
- **Katten**: http://localhost:3000/katten
- **Blog**: http://localhost:3000/blog
- **Donatie**: http://localhost:3000/donatie
- **Contact**: http://localhost:3000/contact
- **Admin CMS**: http://localhost:3000/admin

## Handige Commands

```bash
# Stop alle services
npm run docker:down

# Bekijk logs
npm run docker:logs

# Rebuild images
npm run docker:build

# Stop en verwijder alles (inclusief data!)
docker-compose down -v
```

## Development zonder Docker

```bash
# Installeer dependencies
npm install

# Start PostgreSQL (moet apart draaien)
# Pas DATABASE_URL aan in .env

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Maak admin aan
npm run admin:create

# Start development server
npm run dev
```

## Mollie iDEAL Setup (voor donaties)

1. Registreer gratis bij Mollie: https://www.mollie.com
2. Haal je TEST API key op in het dashboard
3. Voeg toe aan `.env`:
   ```
   MOLLIE_API_KEY=test_jouw_api_key_hier
   ```
4. Herstart de applicatie

## Problemen?

### Port 3000 al in gebruik

```bash
# Stop andere services op poort 3000
# Of pas de poort aan in docker-compose.yml
```

### Database connectie errors

```bash
# Check of database container draait
docker-compose ps

# Bekijk database logs
docker-compose logs db
```

### Permissions errors

```bash
# Stop containers
docker-compose down

# Verwijder volumes
docker volume rm website-kattenstichting_postgres_data

# Start opnieuw
docker-compose up -d
```

## Volgende Stappen

1. **Content toevoegen**: Log in op http://localhost:3000/admin
2. **Katten toevoegen**: Ga naar "Katten Beheren" in admin panel
3. **Blog schrijven**: Ga naar "Blog Beheren"
4. **Vrijwilligers toevoegen**: Ga naar "Vrijwilligers Beheren"
5. **Instellingen aanpassen**: Ga naar "Instellingen"

## Documentatie

- `README.md` - Volledige documentatie
- `DEPLOYMENT.md` - Productie deployment guide
- `.env.example` - Environment variabelen

## Support

Bij vragen of problemen, check de logs:
```bash
docker-compose logs -f
```
