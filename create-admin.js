// Simple script to create admin user
const { Client } = require('pg');
const bcrypt = require('bcrypt');

// Load environment variables
require('dotenv').config();

async function createAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Hash password
    const hashedPassword = await bcrypt.hash('Admin@123', 12);

    // Check if ADMIN role exists
    const roleResult = await client.query(
      `SELECT id FROM "roles" WHERE name = 'ADMIN' LIMIT 1`
    );

    if (roleResult.rows.length === 0) {
      console.error('ADMIN role not found in database');
      return;
    }

    const adminRole = 'ADMIN';

    // Create or update admin user
    const query = `
      INSERT INTO "users" (username, fullname, email, phone, date_of_birth, password, role, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      ON CONFLICT (username) 
      DO UPDATE SET 
        password = $6,
        role = $7,
        status = $8,
        updated_at = NOW()
      RETURNING id, username, fullname, email, role;
    `;

    const values = [
      'admin',
      'Administrator',
      'admin@example.com',
      '0123456789',
      '1990-01-01',
      hashedPassword,
      adminRole,
      'ACTIVE'
    ];

    const result = await client.query(query, values);
    console.log(' Admin user created/updated successfully:');
    console.log(result.rows[0]);
    console.log('\nLogin credentials:');
    console.log('Username: admin');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdmin();
