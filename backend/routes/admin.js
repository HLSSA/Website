const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const supabase = require('../supabaseClient');

// Environment configuration
const SECRET = process.env.JWT_SECRET || 'supasecret';

// Set up multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// === Auth Middleware ===
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ error: 'Authorization token required' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// === Upload Utility ===
async function uploadImageToSupabase(file, folder = 'news') {
  if (!file) return null;
  
  // Sanitize the filename - remove special characters and spaces
  const sanitizedFilename = file.originalname
    .toLowerCase()
    .replace(/[^a-z0-9.]/g, '-')  // Replace special chars with hyphens
    .replace(/\-+/g, '-')         // Replace multiple hyphens with single
    .replace(/^\-|\-$/g, '');     // Remove leading/trailing hyphens
    
  const filename = `${folder}/${uuidv4()}-${sanitizedFilename}`;
  
  const { error } = await supabase.storage
    .from('media')
    .upload(filename, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error('Supabase storage error:', error);
    throw new Error(error.message);
  }

  const { data: { publicUrl } } = supabase.storage
    .from('media')
    .getPublicUrl(filename);

  return publicUrl;
}

// === Admin Login (Database + Hardcoded Fallback) ===
const HARDCODED_ADMIN_USERNAME = 'admin';
const HARDCODED_ADMIN_PASSWORD = 'admin123';

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // First, check hardcoded admin
    if (username === HARDCODED_ADMIN_USERNAME && password === HARDCODED_ADMIN_PASSWORD) {
      const token = jwt.sign({ username, type: 'hardcoded' }, SECRET, { expiresIn: '2h' });
      return res.json({ 
        token,
        message: 'Login successful (hardcoded admin)'
      });
    }

    // Then check database admins
    const { data: admin, error } = await supabase
      .from('admin')
      .select('id, username, password')
      .eq('username', username)
      .maybeSingle();

    if (error) {
      console.error('Supabase error during login:', error);
      return res.status(500).json({ error: 'Login system error' });
    }

    // If admin found in database, verify password
    if (admin && bcrypt.compareSync(password, admin.password)) {
      const token = jwt.sign({ 
        username: admin.username, 
        id: admin.id,
        type: 'database' 
      }, SECRET, { expiresIn: '2h' });
      
      return res.json({ 
        token,
        message: 'Login successful'
      });
    }

    // If no match found
    res.status(401).json({ error: 'Invalid credentials' });

  } catch (err) {
    console.error('Unexpected error during login:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === Test Routes ===
router.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

router.get('/test-auth', verifyToken, (req, res) => {
  res.json({ message: 'Authenticated API is working!', user: req.user });
});







// ====== ADMIN MANAGEMENT ROUTES ======

// GET all admins
router.get('/admins', verifyToken, async (req, res) => {
  try {
    console.log('Fetching all admins...'); // Debug log
    
    const { data, error } = await supabase
      .from('admin')
      .select('id, username')  // Don't return passwords
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error details:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch admins',
        details: error.message // Include error details for debugging
      });
    }

    console.log('Admins fetched successfully:', data); // Debug log
    res.json(data || []);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single admin by ID
router.get('/admins/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Fetching admin with ID:', id); // Debug log
    
    const { data, error } = await supabase
      .from('admin')
      .select('id, username')  // Don't return password
      .eq('id', id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Admin not found' });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch admin' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new admin
router.post('/admins', verifyToken, async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Creating new admin with username:', username); // Debug log

    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Check if username already exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admin')
      .select('username')
      .eq('username', username)
      .maybeSingle();

    if (checkError) {
      console.error('Supabase error checking existing admin:', checkError);
      return res.status(500).json({ error: 'Failed to check existing admin' });
    }

    if (existingAdmin) {
      return res.status(409).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new admin into database
    const { data, error } = await supabase
      .from('admin')
      .insert([{ 
        username, 
        password: hashedPassword
      }])
      .select('id, username')  // Don't return password
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create admin' });
    }

    console.log('Admin created successfully:', data); // Debug log
    res.status(201).json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE admin
router.delete('/admins/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Deleting admin with ID:', id); // Debug log

    // Check if admin exists
    const { data: existingAdmin, error: existError } = await supabase
      .from('admin')
      .select('id')
      .eq('id', id)
      .maybeSingle();

    if (existError) {
      console.error('Supabase error checking existing admin:', existError);
      return res.status(500).json({ error: 'Failed to check existing admin' });
    }

    if (!existingAdmin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // Prevent deletion if this is the last admin
    const { data: adminCount, error: countError } = await supabase
      .from('admin')
      .select('id');

    if (countError) {
      console.error('Supabase error counting admins:', countError);
      return res.status(500).json({ error: 'Failed to check admin count' });
    }

    if (adminCount && adminCount.length <= 1) {
      return res.status(400).json({ 
        error: 'Cannot delete the last admin. At least one admin must exist.' 
      });
    }

    // Delete admin from database
    const { error } = await supabase
      .from('admin')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete admin' });
    }

    console.log('Admin deleted successfully'); // Debug log
    res.json({ message: 'Admin deleted successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});







// ====== ABOUT MANAGEMENT ROUTES ======

router.put('/about', verifyToken, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'carousel_pics', maxCount: 20 }
]), async (req, res) => {
  try {
    const { name, location, email, contact, description } = req.body;

    if (!name || !location || !email || !contact) {
      return res.status(400).json({ error: 'Name, location, email, and contact are required' });
    }

    // First, delete all existing data to ensure only one row exists
    await supabase.from('about').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // This deletes all rows

    // Upload logo if provided
    let logoUrl = null;
    if (req.files && req.files.logo && req.files.logo[0]) {
      logoUrl = await uploadImageToSupabase(req.files.logo[0], 'about');
    }

    // Upload carousel images if provided
    let carouselPics = [];
    if (req.files && req.files.carousel_pics) {
      const uploadedCarouselPics = [];
      for (const file of req.files.carousel_pics) {
        const imageUrl = await uploadImageToSupabase(file, 'about/carousel');
        uploadedCarouselPics.push(imageUrl);
      }
      carouselPics = uploadedCarouselPics;
    }

    // Process description
    let descriptionsArray = [];
    if (description) {
      if (Array.isArray(description)) {
        descriptionsArray = description.filter(desc => desc && desc.trim());
      } else if (typeof description === 'string') {
        descriptionsArray = [description].filter(desc => desc && desc.trim());
      } else if (typeof description === 'object') {
        const descKeys = Object.keys(description).sort((a, b) => {
          const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
          const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
          return aNum - bNum;
        });
        descriptionsArray = descKeys.map(key => description[key]).filter(desc => desc && desc.trim());
      }
    }

    const aboutData = {
      name,
      location,
      email,
      contact,
      logo: logoUrl,
      description: descriptionsArray,
      carousel_pics: carouselPics
    };

    // Insert the new data
    const { data, error } = await supabase
      .from('about')
      .insert([aboutData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      message: 'About information updated successfully',
      data: data[0] || aboutData
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Alternative approach using proper upsert with existing ID
router.put('/about-alternative', verifyToken, upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'carousel_pics', maxCount: 20 }
]), async (req, res) => {
  try {
    const { name, location, email, contact, description } = req.body;

    if (!name || !location || !email || !contact) {
      return res.status(400).json({ error: 'Name, location, email, and contact are required' });
    }

    // Fetch existing about data to get the ID
    let existingId = null;
    let existingData = {};
    try {
      const { data: existing } = await supabase.from('about').select('*').single();
      if (existing) {
        existingId = existing.id;
        existingData = existing;
      }
    } catch (err) {
      console.log('No existing about data found, will create new');
    }

    // Upload logo if provided, otherwise keep existing
    let logoUrl = existingData.logo || null;
    if (req.files && req.files.logo && req.files.logo[0]) {
      logoUrl = await uploadImageToSupabase(req.files.logo[0], 'about');
    }

    // Upload carousel images if provided, otherwise keep existing
    let carouselPics = existingData.carousel_pics || [];
    if (req.files && req.files.carousel_pics) {
      const uploadedCarouselPics = [];
      for (const file of req.files.carousel_pics) {
        const imageUrl = await uploadImageToSupabase(file, 'about/carousel');
        uploadedCarouselPics.push(imageUrl);
      }
      carouselPics = uploadedCarouselPics;
    }

    // Process description
    let descriptionsArray = [];
    if (description) {
      if (Array.isArray(description)) {
        descriptionsArray = description.filter(desc => desc && desc.trim());
      } else if (typeof description === 'string') {
        descriptionsArray = [description].filter(desc => desc && desc.trim());
      } else if (typeof description === 'object') {
        const descKeys = Object.keys(description).sort((a, b) => {
          const aNum = parseInt(a.match(/\d+/)?.[0] || '0');
          const bNum = parseInt(b.match(/\d+/)?.[0] || '0');
          return aNum - bNum;
        });
        descriptionsArray = descKeys.map(key => description[key]).filter(desc => desc && desc.trim());
      }
    }

    const aboutData = {
      name,
      location,
      email,
      contact,
      logo: logoUrl,
      description: descriptionsArray,
      carousel_pics: carouselPics
    };

    // Include ID if updating existing record
    if (existingId) {
      aboutData.id = existingId;
    }

    const { data, error } = await supabase
      .from('about')
      .upsert([aboutData], { onConflict: 'id' })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      message: 'About information updated successfully',
      data: data[0] || aboutData
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get About content
router.get('/about', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.json({
          name: '',
          location: '',
          email: '',
          contact: '',
          logo: '',
          description: [],
          carousel_pics: []
        });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    const aboutData = {
      ...data,
      description: data.description || [],
      carousel_pics: data.carousel_pics || []
    };

    res.json(aboutData);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all about records (for debugging/admin purposes)
router.get('/about/all', verifyToken, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.json({
      message: 'About records retrieved successfully',
      data: data || [],
      count: data ? data.length : 0
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Clean up duplicate records (optional utility route)
router.delete('/about/cleanup', verifyToken, async (req, res) => {
  try {
    // Get all records ordered by creation date
    const { data: allRecords, error: fetchError } = await supabase
      .from('about')
      .select('*')
      .order('created_at', { ascending: false });

    if (fetchError) {
      return res.status(500).json({ error: fetchError.message });
    }

    if (!allRecords || allRecords.length <= 1) {
      return res.json({ message: 'No cleanup needed', recordsRemaining: allRecords?.length || 0 });
    }

    // Keep the most recent record, delete the rest
    const [keepRecord, ...deleteRecords] = allRecords;
    const idsToDelete = deleteRecords.map(record => record.id);

    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from('about')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        return res.status(500).json({ error: deleteError.message });
      }
    }

    res.json({
      message: 'Cleanup completed successfully',
      recordsDeleted: idsToDelete.length,
      recordsRemaining: 1,
      keptRecord: keepRecord
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// ====== COACH MANAGEMENT ROUTES ======

// GET all coaches
router.get('/coaches', async (req, res) => {
  try {
    // Fetch coaches from Supabase
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('category', 'Coach')
      .order('id', { ascending: true });
      

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch coaches' });
    }

    // Format the response data to match frontend expectations
    const coaches = data.map(coach => ({
      id: coach.id,
      name: coach.name,
      role: coach.role,
      category: coach.category,
      image: coach.image,
      is_active: coach.is_active,
      jersey_no: coach.jersey_no
    }));

    res.json(coaches);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all active coaches
router.get('/coaches/active', async (req, res) => {
  try {
    // Fetch active coaches from Supabase
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('category', 'Coach')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch coaches' });
    }

    // Format the response data to match frontend expectations
    const coaches = data.map(coach => ({
      id: coach.id,
      name: coach.name,
      role: coach.role,
      category: coach.category,
      image: coach.image,
      is_active: coach.is_active,
      jersey_no: coach.jersey_no
    }));

    res.json(coaches);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single coach by ID
router.get('/coaches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .eq('category', 'Coach')
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch coach' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    
    // Format the response data to match frontend expectations
    const coach = {
      id: data.id,
      name: data.name,
      role: data.role,
      category: data.category,
      image: data.image,
      is_active: data.is_active,
      jersey_no: data.jersey_no
    };
    
    res.json(coach);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new coach
router.post('/coaches', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, role } = req.body;

    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({ 
        error: 'Name and role are required' 
      });
    }

    let imageUrl = null;
    if (req.file) {
      // Upload image to Supabase storage
      imageUrl = await uploadImageToSupabase(req.file);
    }

    // Insert new coach into database
    const { data, error } = await supabase
      .from('coaches')
      .insert([{ 
        name, 
        role, 
        category: 'Coach',
        image: imageUrl,
        is_active: true
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create coach' });
    }

    // Format the response to match what the frontend expects
    const newCoach = {
      id: data[0].id,
      name: data[0].name,
      role: data[0].role,
      category: data[0].category,
      image: data[0].image,
      is_active: data[0].is_active,
      jersey_no: data[0].jersey_no
    };

    res.status(201).json(newCoach);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update coach
router.put('/coaches/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role } = req.body;

    // Validate required fields
    if (!name || !role) {
      return res.status(400).json({ 
        error: 'Name and role are required' 
      });
    }

    // Check if coach exists
    const { data: existingCoach, error: findError } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .eq('category', 'Coach')
      .single();

    if (findError || !existingCoach) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    // Handle image update if provided
    let imageUrl = existingCoach.image;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file);
    }

    // Update coach in database
    const { data, error } = await supabase
      .from('coaches')
      .update({ 
        name, 
        role, 
        image: imageUrl
      })
      .eq('id', id)
      .eq('category', 'Coach')
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update coach' });
    }

    // Format the response to match what the frontend expects
    const updatedCoach = {
      id: data[0].id,
      name: data[0].name,
      role: data[0].role,
      category: data[0].category,
      image: data[0].image,
      is_active: data[0].is_active
    };

    res.json(updatedCoach);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE coach (soft delete)
router.delete('/coaches/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if coach exists
    const { data: existingCoach, error: findError } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .eq('category', 'Coach')
      .single();

    if (findError || !existingCoach) {
      return res.status(404).json({ error: 'Coach not found' });
    }

    // Soft delete coach
    const { error } = await supabase
      .from('coaches')
      .update({ is_active: false })
      .eq('id', id)
      .eq('category', 'Coach');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete coach' });
    }

    // Return success message
    res.json({ message: 'Coach deleted successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});




// ====== PLAYER MANAGEMENT ROUTES ======

// GET all players
router.get('/players', async (req, res) => {
  try {
    // Fetch players from Supabase
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('category', 'Player')
      .order('id', { ascending: true });
      

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch players' });
    }

    // Format the response data to match frontend expectations
    const players = data.map(player => ({
      id: player.id,
      name: player.name,
      role: player.role,
      age: player.age,
      category: player.category,
      image: player.image,
      is_active: player.is_active,
      jersey_no: player.jersey_no
    }));

    res.json(players);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all active players
router.get('/players/active', async (req, res) => {
  try {
    // Fetch active players from Supabase
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('category', 'Player')
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch players' });
    }

    // Format the response data to match frontend expectations
    const players = data.map(player => ({
      id: player.id,
      name: player.name,
      role: player.role,
      age: player.age,
      category: player.category,
      image: player.image,
      is_active: player.is_active,
      jersey_no: player.jersey_no
    }));

    res.json(players);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET players by age category
router.get('/players/age/:ageCategory', async (req, res) => {
  try {
    const { ageCategory } = req.params;
    
    // Validate age category
    const validAgeCategories = ['under 10', 'under 12', 'under 14', 'under 16', 'under 18', 'under 21'];
    if (!validAgeCategories.includes(ageCategory)) {
      return res.status(400).json({ error: 'Invalid age category. Must be "under 10", "under 12", "under 14", "under 16", "under 18", "under 21"' });
    }

    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('category', 'Player')
      .eq('age', ageCategory)
      .eq('is_active', true)
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch players' });
    }

    // Format the response data
    const players = data.map(player => ({
      id: player.id,
      name: player.name,
      role: player.role,
      age: player.age,
      category: player.category,
      image: player.image,
      is_active: player.is_active,
      jersey_no: player.jersey_no
    }));

    res.json(players);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single player by ID
router.get('/players/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .eq('category', 'Player')
      .eq('is_active', true)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch player' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    // Format the response data
    const player = {
      id: data.id,
      name: data.name,
      role: data.role,
      age: data.age,
      category: data.category,
      image: data.image,
      is_active: data.is_active,
      jersey_no: data.jersey_no
    };
    
    res.json(player);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new player
router.post('/players', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, role, age } = req.body;

    // Validate required fields
    if (!name || !role || !age) {
      return res.status(400).json({ 
        error: 'Name, role, and age are required' 
      });
    }

    // Validate age category
    const validAgeCategories = ['under 10', 'under 12', 'under 14', 'under 16', 'under 18', 'under 21'];
    if (!validAgeCategories.includes(age)) {
      return res.status(400).json({ 
        error: 'Invalid age category. Must be "under 10", "under 12", "under 14", "under 16", "under 18", "under 21"' 
      });
    }

    let imageUrl = null;
    if (req.file) {
      // Upload image to Supabase storage
      imageUrl = await uploadImageToSupabase(req.file);
    }

    // Insert new player into database
    const { data, error } = await supabase
      .from('coaches')
      .insert([{ 
        name, 
        role, 
        age,
        category: 'Player',
        image: imageUrl,
        is_active: true,
        jersey_no: req.body.jersey_no
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create player' });
    }

    // Format the response
    const newPlayer = {
      id: data[0].id,
      name: data[0].name,
      role: data[0].role,
      age: data[0].age,
      category: data[0].category,
      image: data[0].image,
      is_active: data[0].is_active,
      jersey_no: data[0].jersey_no
    };

    res.status(201).json(newPlayer);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update player
router.put('/players/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, age } = req.body;

    // Validate required fields
    if (!name || !role || !age) {
      return res.status(400).json({ 
        error: 'Name, role, and age are required' 
      });
    }

    // Validate age category
    const validAgeCategories = ['under 10', 'under 12', 'under 14', 'under 16', 'under 18', 'under 21'];
    if (!validAgeCategories.includes(age)) {
      return res.status(400).json({ 
        error: 'Invalid age category. Must be "under 10", "under 12", "under 14", "under 16", "under 18", "under 21"' 
      });
    }

    // Check if player exists
    const { data: existingPlayer, error: findError } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .eq('category', 'Player')
      .single();

    if (findError || !existingPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Handle image update if provided
    let imageUrl = existingPlayer.image;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file);
    }

    // Update player in database
    const { data, error } = await supabase
      .from('coaches')
      .update({ 
        name, 
        role, 
        age,
        image: imageUrl,
        jersey_no: req.body.jersey_no
      })
      .eq('id', id)
      .eq('category', 'Player')
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update player' });
    }

    // Format the response
    const updatedPlayer = {
      id: data[0].id,
      name: data[0].name,
      role: data[0].role,
      age: data[0].age,
      category: data[0].category,
      image: data[0].image,
      is_active: data[0].is_active,
      jersey_no: data[0].jersey_no
    };

    res.json(updatedPlayer);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE player (soft delete)
router.delete('/players/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if player exists
    const { data: existingPlayer, error: findError } = await supabase
      .from('coaches')
      .select('*')
      .eq('id', id)
      .eq('category', 'Player')
      .single();

    if (findError || !existingPlayer) {
      return res.status(404).json({ error: 'Player not found' });
    }

    // Soft delete player
    const { error } = await supabase
      .from('coaches')
      .update({ is_active: false })
      .eq('id', id)
      .eq('category', 'Player');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete player' });
    }

    // Return success message
    res.json({ message: 'Player deleted successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});






// ====== PARTNERS MANAGEMENT ROUTES ======

// Create new partner
router.post('/partners', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description, website } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, 'partners');
    }

    const { data, error } = await supabase
      .from('partners')
      .insert([{ 
        name, 
        description, 
        image: imageUrl, 
        website_link: website 
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all partners
router.get('/partners', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get all  active partners
router.get('/partners/active', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// GET single partner by ID
router.get('/partners/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch partner' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Partner not found' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update partner
router.put('/partners/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, website } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    // Check if partner exists
    const { data: existingPartner, error: findError } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingPartner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Handle image update if provided
    let imageUrl = existingPartner.image;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, 'partners');
    }

    // Update partner in database
    const { data, error } = await supabase
      .from('partners')
      .update({
        name,
        description,
        image: imageUrl,
        website_link: website
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update partner' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE partner
router.delete('/partners/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if partner exists
    const { data: existingPartner, error: findError } = await supabase
      .from('partners')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (findError || !existingPartner) {
      return res.status(404).json({ error: 'Partner not found' });
    }

    // Delete partner from database
    const { error } = await supabase
      .from('partners')
      .delete()
      .eq('id', id)
      .eq('is_active', true);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete partner' });
    }

    // Return success message
    res.json({ message: 'Partner deleted successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// ====== ACHIEVEMENTS MANAGEMENT ROUTES ======

// GET all achievements
router.get('/achievements', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch achievements' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single achievement by ID
router.get('/achievements/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch achievement' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Achievement not found' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST create new achievement
router.post('/achievements', verifyToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];

    // Ensure at least one file is uploaded (image or video)
    if (!imageFile && !videoFile) {
      return res.status(400).json({ error: 'Either an image or video file is required' });
    }

    const imageUrl = imageFile ? await uploadImageToSupabase(imageFile, 'achievements/images') : null;
    const videoUrl = videoFile ? await uploadImageToSupabase(videoFile, 'achievements/videos') : null;

    const { data, error } = await supabase
      .from('achievements')
      .insert([{
        title,
        description,
        category,
        image: imageUrl,
        video: videoUrl
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to create achievement' });
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update achievement
router.put('/achievements/:id', verifyToken, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category } = req.body;

    // Validate required fields
    if (!title || !description || !category) {
      return res.status(400).json({ error: 'Title, description, and category are required' });
    }

    // Check if achievement exists
    const { data: existingAchievement, error: findError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingAchievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    // Handle file updates if provided
    const imageFile = req.files?.image?.[0];
    const videoFile = req.files?.video?.[0];

    let imageUrl = existingAchievement.image;
    let videoUrl = existingAchievement.video;

    if (imageFile) {
      imageUrl = await uploadImageToSupabase(imageFile, 'achievements/images');
    }
    if (videoFile) {
      videoUrl = await uploadImageToSupabase(videoFile, 'achievements/videos');
    }

    // Update achievement in database
    const { data, error } = await supabase
      .from('achievements')
      .update({
        title,
        description,
        category,
        image: imageUrl,
        video: videoUrl
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update achievement' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE achievement
router.delete('/achievements/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if achievement exists
    const { data: existingAchievement, error: findError } = await supabase
      .from('achievements')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingAchievement) {
      return res.status(404).json({ error: 'Achievement not found' });
    }

    // Delete achievement from database
    const { error } = await supabase
      .from('achievements')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete achievement' });
    }

    // Return success message
    res.json({ message: 'Achievement deleted successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ====== TESTIMONIALS MANAGEMENT ROUTES ======

// Create new testimonial
router.post('/testimonials', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, role, feedback } = req.body;
    
    if (!name || !role || !feedback) {
      return res.status(400).json({ error: 'Name, role, and feedback are required' });
    }
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, 'testimonials');
    }

    const { data, error } = await supabase
      .from('testimonials')
      .insert([{
        name,
        role,
        feedback,
        image: imageUrl
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update testimonial
router.put('/testimonials/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, feedback } = req.body;

    // Validate required fields
    if (!name || !role || !feedback) {
      return res.status(400).json({ error: 'Name, role, and feedback are required' });
    }

    // Check if testimonial exists
    const { data: existingTestimonial, error: findError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    // Handle image update if provided
    let imageUrl = existingTestimonial.image;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, 'testimonials');
    }

    // Update testimonial in database
    const { data, error } = await supabase
      .from('testimonials')
      .update({
        name,
        role,
        feedback,
        image: imageUrl
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update testimonial' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE testimonial
router.delete('/testimonials/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if testimonial exists
    const { data: existingTestimonial, error: findError } = await supabase
      .from('testimonials')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingTestimonial) {
      return res.status(404).json({ error: 'Testimonial not found' });
    }

    // Delete testimonial from database
    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete testimonial' });
    }

    // Return success message
    res.json({ message: 'Testimonial deleted successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// ====== TOURNAMENTS MANAGEMENT ROUTES ======

// Create new tournament
router.post('/tournaments', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, 'tournaments');
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert([{ 
        name, 
        description, 
        image: imageUrl
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all tournaments
router.get('/tournaments', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET single tournament by ID
router.get('/tournaments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch tournament' });
    }
    
    if (!data) {
      return res.status(404).json({ error: 'Tournament not found' });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT update tournament
router.put('/tournaments/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Validate required fields
    if (!name || !description) {
      return res.status(400).json({ error: 'Name and description are required' });
    }

    // Check if tournament exists
    const { data: existingTournament, error: findError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingTournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    // Handle image update if provided
    let imageUrl = existingTournament.image;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, 'tournaments');
    }

    // Update tournament in database
    const { data, error } = await supabase
      .from('tournaments')
      .update({
        name,
        description,
        image: imageUrl
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to update tournament' });
    }

    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE tournament
router.delete('/tournaments/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if tournament exists
    const { data: existingTournament, error: findError } = await supabase
      .from('tournaments')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !existingTournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    // Delete tournament from database
    const { error } = await supabase
      .from('tournaments')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to delete tournament' });
    }

    // Return success message
    res.json({ message: 'Tournament deleted successfully' });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// ====== MATCHES MANAGEMENT ROUTES ======

// Create new match
router.post('/matches', verifyToken, upload.single('opponent_image'), async (req, res) => {
  try {
    const { opponent_name, datetime, location, result } = req.body;
    
    if (!opponent_name || !datetime || !location) {
      return res.status(400).json({ error: 'Opponent name, datetime, and location are required' });
    }
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, 'matches');
    }

    const { data, error } = await supabase
      .from('matches')
      .insert([{
        opponent_name,
        opponent_image: imageUrl,
        datetime,
        location,
        result
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all matches
router.get('/matches', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('datetime', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get past matches
router.get('/matches/past', async (req, res) => {
  try {
    const currentDateTime = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .lt('datetime', currentDateTime) // Use 'lt' (less than) instead of 'lte' to exclude current time
      .order('datetime', { ascending: false }); // Order by most recent first for past matches
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data || []);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get upcoming matches (next 60 days)
router.get('/matches/upcoming', async (req, res) => {
  try {
    const now = new Date();
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(now.getDate() + 60);
    
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .gte('datetime', now.toISOString())
      .lte('datetime', sixtyDaysFromNow.toISOString())
      .order('datetime', { ascending: true });
    
    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single match by ID
router.get('/matches/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Match not found' });
      }
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update match
router.put('/matches/:id', verifyToken, upload.single('opponent_image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { opponent_name, datetime, location, result } = req.body;
    
    // First check if match exists
    const { data: existingMatch, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Match not found' });
      }
      return res.status(500).json({ error: fetchError.message });
    }
    
    // Prepare update object
    const updateData = {};
    if (opponent_name) updateData.opponent_name = opponent_name;
    if (datetime) updateData.datetime = datetime;
    if (location) updateData.location = location;
    if (result) updateData.result = result;
    
    // Handle image upload
    if (req.file) {
      const imageUrl = await uploadImageToSupabase(req.file, 'matches');
      updateData.opponent_image = imageUrl;
    }
    
    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data, error } = await supabase
      .from('matches')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete match
router.delete('/matches/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if match exists
    const { data: existingMatch, error: fetchError } = await supabase
      .from('matches')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'Match not found' });
      }
      return res.status(500).json({ error: fetchError.message });
    }

    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'Match deleted successfully', deletedMatch: existingMatch });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// ====== NEWS MANAGEMENT ROUTES ======

// Get all news
router.get('/news', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single news item by ID
router.get('/news/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Supabase error:', error);
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'News not found' });
      }
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new news item
router.post('/news', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, date, author, category, fullStory, article_url, featured, isactive } = req.body;
    
    if (!title || !excerpt) {
      return res.status(400).json({ error: 'Title and excerpt are required' });
    }
    
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadImageToSupabase(req.file, 'news');
    }

    const { data, error } = await supabase
      .from('news')
      .insert([{
        title,
        excerpt,
        image: imageUrl,
        date,
        author,
        category,
        fullStory,
        article_url,
        featured: featured === 'true' || featured === true,
        isactive: isactive === 'true' || isactive === true
      }])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update news item
router.put('/news/:id', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, date, author, category, fullStory, article_url, featured, isactive } = req.body;
    
    // First check if news exists
    const { data: existingNews, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'News not found' });
      }
      return res.status(500).json({ error: fetchError.message });
    }
    
    // Prepare update object
    const updateData = {};
    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (date) updateData.date = date;
    if (author) updateData.author = author;
    if (category) updateData.category = category;
    if (fullStory) updateData.fullStory = fullStory;
    if (article_url) updateData.article_url = article_url;
    if (featured !== undefined) updateData.featured = featured === 'true' || featured === true;
    if (isactive !== undefined) updateData.isactive = isactive === 'true' || isactive === true;
    
    // Handle image upload
    if (req.file) {
      const imageUrl = await uploadImageToSupabase(req.file, 'news');
      updateData.image = imageUrl;
    }
    
    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    const { data, error } = await supabase
      .from('news')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data[0]);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete news item
router.delete('/news/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    // First check if news exists
    const { data: existingNews, error: fetchError } = await supabase
      .from('news')
      .select('*')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return res.status(404).json({ error: 'News not found' });
      }
      return res.status(500).json({ error: fetchError.message });
    }

    const { error } = await supabase
      .from('news')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ message: 'News deleted successfully', deletedNews: existingNews });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get featured news
router.get('/news/featured/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('featured', true)
      .eq('isactive', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get active news
router.get('/news/active/list', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('isactive', true)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json(data);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;