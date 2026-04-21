const express = require('express');
const path = require('path');
const cors = require('cors');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const interestRoutes = require('./routes/interests');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/Authenticate', authRoutes);
app.use('/api/Cliente', clientRoutes);
app.use('/api/Intereses', interestRoutes);

// Servir el frontend en producción
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos del frontend
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Manejar todas las rutas no API
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV}`);
});
EOF