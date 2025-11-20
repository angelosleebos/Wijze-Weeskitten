const { Pool } = require('pg');

async function seedDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Seeding database met voorbeeld data...');

    // Voorbeeld katten
    await pool.query(`
      INSERT INTO cats (name, age, gender, breed, description, image_url) VALUES
      ('Mimi', 3, 'female', 'Huiskat', 'Lieve poes die graag knuffelt en speelt. Op zoek naar een rustig baasje.', '/images/cat-1.jpg'),
      ('Max', 5, 'male', 'Europees korthaar', 'Rustige kater, ideaal voor een gezin met kinderen. Heel sociaal en aanhankelijk.', '/images/cat-2.jpg'),
      ('Luna', 1, 'female', 'Cyperse kat', 'Speelse jonge poes vol energie. Roemeens katje dat een gouden mandje zoekt!', '/images/cat-3.jpg'),
      ('Simba', 2, 'male', 'Rode kater', 'Vrolijke rode kater die houdt van avontuur. Zoekt een actief gezin.', '/images/cat-4.jpg'),
      ('Bella', 4, 'female', 'Grijze cyperse', 'Rustige poes die houdt van een veilige omgeving. Perfect voor een rustig huis.', '/images/cat-5.jpg');
    `);

    // Voorbeeld blog posts
    await pool.query(`
      INSERT INTO blog_posts (title, slug, excerpt, content, image_url, published) VALUES
      ('Welkom bij het Wijze Weeskitten', 'welkom-bij-wijze-weeskitten', 
       'Kleinschalige organisatie met een groot hart voor katten in nood',
       '<p>Stichting het Wijze Weeskitten biedt op geheel eigen wijze onvoorwaardelijke hulp aan katten in noodsituaties. We zijn een kleinschalige organisatie die zich inzet voor katten die dringend hulp nodig hebben.</p><p>Op deze website vind je alle katten die momenteel onder onze hoede zijn en op zoek naar een warm thuis.</p>',
       '/images/hero-cats.jpg',
       true),
      ('Tips voor nieuwe kattenbaasjes', 'tips-voor-nieuwe-kattenbaasjes',
       'Wat moet je weten als je voor het eerst een kat adopteert?',
       '<p>Een kat adopteren is een grote stap. Zorg ervoor dat je huis kattenproof is, koop het nodige zoals kattenbak, speeltjes en krabpaal, en geef je nieuwe huisgenoot de tijd om te wennen.</p><p>Een kat heeft gemiddeld 2-3 weken nodig om zich thuis te voelen. Geef veel liefde, geduld en aandacht!</p>',
       '/images/cat-1.jpg',
       true),
      ('Katten uit Roemenië', 'katten-uit-roemenie',
       'Onze missie om Roemeense straatkatten te helpen',
       '<p>Veel van onze katten komen uit Roemenië waar ze op straat leefden. Deze lieve dieren verdienen een tweede kans op een goed leven.</p><p>We werken samen met lokale opvangcentra om deze katten naar Nederland te halen en ze te plaatsen bij liebevolle baasjes.</p>',
       '/images/cat-3.jpg',
       true);
    `);

    // Voorbeeld vrijwilligers
    await pool.query(`
      INSERT INTO volunteers (name, role, email, phone, bio) VALUES
      ('Petra van der Berg', 'Oprichtster & Coördinator', 'petra@wijzeweeskitten.nl', '06-12345678', 
       'Petra richtte de stichting op uit liefde voor katten in nood. Ze coördineert alle adopties en werkt nauw samen met opvangcentra.'),
      ('Tom Bakker', 'Vrijwilliger & Fotograaf', 'tom@wijzeweeskitten.nl', '06-87654321',
       'Tom helpt met het fotograferen van onze katten en verzorgt de social media content. Ook helpt hij bij transport van katten.');
    `);

    console.log('✅ Database succesvol gevuld met voorbeeld data!');
  } catch (error) {
    console.error('❌ Fout bij seeden database:', error);
  } finally {
    await pool.end();
  }
}

seedDatabase();
