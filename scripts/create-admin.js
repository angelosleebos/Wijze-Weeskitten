const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function createAdmin() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Vraag om gebruikersinformatie
    const username = await new Promise((resolve) => {
      rl.question('Gebruikersnaam: ', resolve);
    });

    const email = await new Promise((resolve) => {
      rl.question('E-mail: ', resolve);
    });

    const password = await new Promise((resolve) => {
      rl.question('Wachtwoord: ', (answer) => {
        resolve(answer);
      });
    });

    // Hash wachtwoord
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Voeg admin toe aan database
    const result = await pool.query(
      'INSERT INTO admins (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, password_hash]
    );

    console.log('\n✅ Admin gebruiker aangemaakt:');
    console.log(result.rows[0]);
    console.log('\nJe kunt nu inloggen op http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Fout bij aanmaken admin:', error.message);
  } finally {
    rl.close();
    await pool.end();
  }
}

createAdmin();
