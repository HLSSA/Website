require('dotenv').config();

const config = {
  // Server Configuration
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // JWT Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '30d'
  },
  
  // Supabase Configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    bucket: process.env.SUPABASE_BUCKET || 'media'
  },
  
  // CORS Configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    methods: process.env.CORS_METHODS ? process.env.CORS_METHODS.split(',') : ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS ? process.env.CORS_ALLOWED_HEADERS.split(',') : ['Content-Type', 'Authorization']
  },
  
  // File Upload Configuration
  upload: {
    limit: process.env.UPLOAD_LIMIT || '50mb'
  },
  
  // Admin Configuration
  admin: {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  }
};

// Validate required configurations
const requiredConfigs = [
  { key: 'JWT_SECRET', value: config.jwt.secret },
  { key: 'SUPABASE_URL', value: config.supabase.url },
  { key: 'SUPABASE_KEY', value: config.supabase.key }
];

for (const { key, value } of requiredConfigs) {
  if (!value) {
    console.error(`FATAL ERROR: ${key} is not defined.`);
    process.exit(1);
  }
}

module.exports = config;
