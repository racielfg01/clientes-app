const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto-local-2024';

// Registro
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Validaciones
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Email inválido' });
  }

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,20}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ 
      message: 'La contraseña debe tener 8-20 caracteres, una mayúscula, una minúscula y un número' 
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (id, username, email, password) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING id',
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
      console.error(error);
      res.status(500).json({ message: 'Error al crear usuario' });
    }
  }
});

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Usuario y contraseña son obligatorios' });
  }

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
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;