const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db'); 
const multer = require('multer');
const { imageStorage, videoStorage } = require('../utils/cloudinary');
const upload = multer({ storage: imageStorage });

const uploadImage = multer({ storage: imageStorage });
const uploadVideo = multer({ storage: videoStorage });
const uploadMedia = multer({
  storage: multer.diskStorage({}),
}); // dummy for fallback in case of error, not used here

const SECRET = process.env.JWT_SECRET || 'dfghjmngfdsdfvb';

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
    });
});




router.post('/partners', uploadImage.single('image'), (req, res) => {
  try {
    const { name, description } = req.body;
    const file = req.file;

    // Validate required fields
    if (!name || !description || !file) {
      return res.status(400).json({ 
        message: 'Name and description are required.' 
      });
    }
    console.log("Name:", name);
    console.log("Description:", description);
    console.log("Image file buffer:", file.buffer); 

    // If no image was uploaded, return an error
    if (!imageUrl) {
      return res.status(400).json({ 
        message: 'Image is required.' 
      });
    }

    // Insert into database
    const insertQuery = `
      INSERT INTO partners (name, description, image_url, created_at) 
      VALUES (?, ?, ?, ?)
    `;
    
    db.run(
      insertQuery,
      [name, description, imageUrl, new Date().toISOString()],
      function (err) {
        if (err) {
          console.error('Database Error:', err);
          return res.status(500).json({ 
            message: 'Database error. Failed to save partner.',
            error: err.message 
          });
        }
        
        res.status(201).json({ 
          message: 'Partner added successfully!',
          partnerId: this.lastID,
          imageUrl: imageUrl
        });
      }
    );
  } catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ 
      message: 'Server error. Failed to add partner.',
      error: error.message 
    });
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

// ✅ FIXED: use fields() for both image and video
const multiUpload = multer({
  storage: multer.memoryStorage(),
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]);

router.post('/achievements', verifyToken, (req, res, next) => {
  // Chain image and video uploaders
  const handler = multer().none(); // dummy to allow fields parsing
  handler(req, res, async () => {
    const imgUpload = uploadImage.single('image');
    const vidUpload = uploadVideo.single('video');

    imgUpload(req, res, function (err) {
      if (err) return res.status(400).json({ error: 'Image upload failed' });

      vidUpload(req, res, function (err2) {
        if (err2) return res.status(400).json({ error: 'Video upload failed' });

        const { title, category, description } = req.body;
        const image_url = req.file?.path || null;
        const video_url = req.file?.path || null;

        db.run(
          `INSERT INTO achievements (title, image_url, video, category, description) VALUES (?, ?, ?, ?, ?)`,
          [title, image_url, video_url, category, description],
          function (err3) {
            if (err3) return res.status(500).json({ error: err3.message });
            res.status(201).json({ id: this.lastID });
          }
        );
      });
    });
  });
});

router.post('/tournaments', verifyToken, uploadImage.single('image'), (req, res) => {
  const { tournament_name, description } = req.body;
  const image_url = req.file?.path || null;

  db.run(`INSERT INTO tournaments (tournament_name, image_url, description) VALUES (?, ?, ?)`,
    [tournament_name, image_url, description],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ id: this.lastID });
    });
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
