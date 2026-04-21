const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validar contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        message: 'La contraseña debe tener 8-20 caracteres, una mayúscula, una minúscula y un número' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id',
      [username, email, hashedPassword]
    );

    res.status(200).json({ 
      status: 'Success', 
      message: 'Usuario creado correctamente' 
    });
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ message: 'El usuario o email ya existe' });
    } else {
      res.status(500).json({ message: 'Error al crear usuario' });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT id, username, password FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      expiration: new Date(Date.now() + 24 * 3600000).toISOString(),
      userid: user.id,
      username: user.username
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;