const { Pool } = require('pg');
require('dotenv').config();

//const pool = new Pool({
//  user: process.env.DB_USER || 'postgres',
//  host: process.env.DB_HOST || 'localhost',
//  database: process.env.DB_NAME || 'clientes_db',
//  password: process.env.DB_PASSWORD || 'postgres',
//  port: process.env.DB_PORT || 5432,
//});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DB_URL,
  ssl: {
    rejectUnauthorized: false // Railway requiere SSL
  }
});

const initDB = async () => {
  try {
    await pool.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    // Tabla de usuarios
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabla de intereses
    await pool.query(`
      CREATE TABLE IF NOT EXISTS interests (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insertar intereses por defecto si no existen
    await pool.query(`
      INSERT INTO interests (nombre) VALUES 
      ('Tecnología'), 
      ('Deportes'), 
      ('Música'), 
      ('Arte'), 
      ('Viajes'),
      ('Lectura'),
      ('Cine'),
      ('Gastronomía'),
      ('Fotografía'),
      ('Jardinería')
      ON CONFLICT (id) DO NOTHING
    `);

    // Tabla de clientes - CORREGIDA
    await pool.query(`
      CREATE TABLE IF NOT EXISTS clients (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        identification VARCHAR(20) NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        apellidos VARCHAR(100) NOT NULL,
        telefonoCelular VARCHAR(20),
        otroTelefono VARCHAR(20),
        direccion VARCHAR(200),
        fnAcimiento DATE,
        fAficion DATE,
        sexo CHAR(1) CHECK (sexo IN ('M', 'F')),
        resenaPersonal TEXT,
        imagen TEXT,
        interesesFK UUID REFERENCES interests(id) ON DELETE SET NULL,
        usuarioId UUID REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Base de datos inicializada correctamente');
  } catch (error) {
    console.error('❌ Error inicializando BD:', error);
  }
};

initDB();

module.exports = pool;