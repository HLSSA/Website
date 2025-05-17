// backend/init_db.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database file path
const dbPath = path.join(__dirname, 'hlssa.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database.');
  }
});



db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS coaches (
    staff_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    phone_number TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS partners (
    partner_id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT,
    name TEXT NOT NULL,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS about (
    company_name TEXT,
    location TEXT,
    est_year TEXT,
    email TEXT,
    contact TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS achievements (
    achieve_id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    image_url TEXT,
    video_url TEXT,
    category TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tournaments (
    tournament_id INTEGER PRIMARY KEY AUTOINCREMENT,
    tournament_name TEXT NOT NULL,
    image_url TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS testimonials (
    testimonial_id INTEGER PRIMARY KEY AUTOINCREMENT,
    testimonial_name TEXT NOT NULL,
    role TEXT,
    description TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS admins (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL
  )`);

  console.log('✅ All tables created or already exist.');
});

db.close();
