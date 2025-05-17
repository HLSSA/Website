// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db'); 
const SECRET = process.env.JWT_SECRET || 'dfghjmngfdsdfvb';
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_PRESET;
const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUDNAME;

// Middleware to verify admin token
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

// Admin login
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = bcrypt.hashSync('admin123', 10); // Only hashed once

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && bcrypt.compareSync(password, ADMIN_PASSWORD)) {
    const token = jwt.sign({ username }, SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }
  res.status(401).json({ message: 'Invalid credentials' });
});

// === UTIL: Cloudinary Upload ===
const uploadToCloudinary = async (file, type = 'image') => {
  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
  const FormData = (await import('form-data')).default;
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  data.append('cloudname', CLOUDINARY_CLOUD_NAME);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${type}/upload`, {
    method: 'POST',
    body: data,
  });
  return res.json();
};

// ==========================
// INSERT APIs (ADMIN only)
// ==========================

router.post('/coaches', verifyToken, (req, res) => {
  const { name, role, phone_number, description } = req.body;
  db.run(`INSERT INTO coaches (name, role, phone_number, description) VALUES (?, ?, ?, ?)`,
    [name, role, phone_number, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
      res.send("Coach Created");
    });
});

router.post('/partners', verifyToken, async (req, res) => {
  const { name, description, imageBase64 } = req.body;
  try {
    const uploadRes = await uploadToCloudinary(imageBase64);
    const imageUrl = "https://sreenidideccanfc.com/wp-content/uploads/2022/04/SDFC-Logo-01-4.png" //uploadRes.secure_url;
    db.run(`INSERT INTO partners (image_url, name, description) VALUES (?, ?, ?)`,
      [imageUrl, name, description],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
        res.send("Partner Created");
      });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err });
  }
});

router.put('/about', verifyToken, (req, res) => {
  const { company_name, location, est_year, email, contact } = req.body;
  db.run(`UPDATE about SET company_name = ?, location = ?, est_year = ?, email = ?, contact = ?`,
    [company_name, location, est_year, email, contact],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: 'About updated' });
    });
});

router.post('/achievements', verifyToken, async (req, res) => {
  const { title, imageBase64, videoBase64, category, description } = req.body;
  try {
    const imageUpload = imageBase64 ? await uploadToCloudinary(imageBase64) : null;
    const videoUpload = videoBase64 ? await uploadToCloudinary(videoBase64, 'video') : null;
    const image_url = imageUpload?.secure_url || null;
    const video_url = videoUpload?.secure_url || null;

    db.run(`INSERT INTO achievements (title, image_url, video, category, description) VALUES (?, ?, ?, ?, ?)`,
      [title, image_url, video_url, category, description],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
      });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err });
  }
});

router.post('/tournaments', verifyToken, async (req, res) => {
  const { tournament_name, description, imageBase64 } = req.body;
  try {
    const uploadRes = await uploadToCloudinary(imageBase64);
    const image_url = uploadRes.secure_url;
    db.run(`INSERT INTO tournaments (tournament_name, image_url, description) VALUES (?, ?, ?)`,
      [tournament_name, image_url, description],
      function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID });
      });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed', details: err });
  }
});

router.post('/testimonials', verifyToken, (req, res) => {
  const { testimonial_name, role, description } = req.body;
  db.run(`INSERT INTO testimonials (testimonial_name, role, description) VALUES (?, ?, ?)`,
    [testimonial_name, role, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
});

// ==========================
// PUBLIC GET APIs (for /)
// ==========================
router.get('/coaches', (req, res) => {
  db.all(`SELECT * FROM coaches`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/partners', (req, res) => {
  db.all(`SELECT * FROM partners`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/about', (req, res) => {
  db.get(`SELECT * FROM about`, [], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(row);
  });
});

router.get('/achievements', (req, res) => {
  db.all(`SELECT * FROM achievements`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/tournaments', (req, res) => {
  db.all(`SELECT * FROM tournaments`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/testimonials', (req, res) => {
  db.all(`SELECT * FROM testimonials`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
