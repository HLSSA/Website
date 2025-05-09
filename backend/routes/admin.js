// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const db = require('../hlssa.db');
const fs = require('fs');

const SECRET = "your_jwt_secret";

// Image upload config
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Middleware to protect admin routes
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);
  try {
    jwt.verify(token.split(' ')[1], SECRET);
    next();
  } catch {
    res.sendStatus(403);
  }
}

// Admin login (fixed admin account, adjust as needed)
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = bcrypt.hashSync("admin123", 10); // Change in prod

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD)) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// CRUD APIs for each entity

// Coaches
router.post('/coaches', verifyToken, (req, res) => {
  const { name, role, phone_number, description } = req.body;
  db.run(`INSERT INTO coaches (name, role, phone_number, description) VALUES (?, ?, ?, ?)`,
    [name, role, phone_number, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

router.get('/coaches', (req, res) => {
  db.all(`SELECT * FROM coaches`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Partners
router.post('/partners', verifyToken, (req, res) => {
  const { image_url, name, description } = req.body;
  db.run(`INSERT INTO partners (image_url, name, description) VALUES (?, ?, ?)`,
    [image_url, name, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

router.get('/partners', (req, res) => {
  db.all(`SELECT * FROM partners`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// About (only one entry expected)
router.put('/about', verifyToken, (req, res) => {
  const { company_name, location, est_year, email, contact } = req.body;
  db.run(`UPDATE about SET company_name = ?, location = ?, est_year = ?, email = ?, contact = ?`,
    [company_name, location, est_year, email, contact],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'About updated' });
    });
});

router.get('/about', (req, res) => {
  db.get(`SELECT * FROM about`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

// Achievements
router.post('/achievements', verifyToken, (req, res) => {
  const { title, image_url, video, category, description } = req.body;
  db.run(`INSERT INTO achievements (title, image_url, video, category, description) VALUES (?, ?, ?, ?, ?)`,
    [title, image_url, video, category, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

router.get('/achievements', (req, res) => {
  db.all(`SELECT * FROM achievements`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Tournaments
router.post('/tournaments', verifyToken, (req, res) => {
  const { tournament_name, image_url, description } = req.body;
  db.run(`INSERT INTO tournaments (tournament_name, image_url, description) VALUES (?, ?, ?)`,
    [tournament_name, image_url, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

router.get('/tournaments', (req, res) => {
  db.all(`SELECT * FROM tournaments`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Testimonials
router.post('/testimonials', verifyToken, (req, res) => {
  const { testimonial_name, role, description } = req.body;
  db.run(`INSERT INTO testimonials (testimonial_name, role, description) VALUES (?, ?, ?)`,
    [testimonial_name, role, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

router.get('/testimonials', (req, res) => {
  db.all(`SELECT * FROM testimonials`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Upload endpoint (local file, optional)
router.post('/upload', verifyToken, upload.single('image'), (req, res) => {
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
  res.json({ message: 'File uploaded', imagePath });
});

module.exports = router;
