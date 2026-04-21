const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Listar todos los intereses
router.get('/Listado', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM interests ORDER BY nombre');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar intereses' });
  }
});

// Obtener interés por ID
router.get('/Obtener/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT id, nombre FROM interests WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Interés no encontrado' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener interés' });
  }
});

// Crear nuevo interés
router.post('/Crear', authMiddleware, async (req, res) => {
  const { nombre } = req.body;
  
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ message: 'El nombre del interés es obligatorio' });
  }
  
  try {
    const result = await pool.query(
      'INSERT INTO interests (nombre) VALUES ($1) RETURNING id, nombre',
      [nombre.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ message: 'Ya existe un interés con ese nombre' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error al crear interés' });
    }
  }
});

// Actualizar interés
router.put('/Actualizar/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ message: 'El nombre del interés es obligatorio' });
  }
  
  try {
    const result = await pool.query(
      'UPDATE interests SET nombre = $1 WHERE id = $2 RETURNING id, nombre',
      [nombre.trim(), id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Interés no encontrado' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      res.status(400).json({ message: 'Ya existe un interés con ese nombre' });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar interés' });
    }
  }
});

// Eliminar interés (solo si no está siendo usado)
router.delete('/Eliminar/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  try {
    // Verificar si hay clientes usando este interés
    const checkResult = await pool.query(
      'SELECT COUNT(*) FROM clients WHERE interesesFK = $1',
      [id]
    );
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      return res.status(400).json({ 
        message: 'No se puede eliminar el interés porque está siendo usado por uno o más clientes' 
      });
    }
    
    const result = await pool.query('DELETE FROM interests WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Interés no encontrado' });
    }
    
    res.json({ message: 'Interés eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar interés' });
  }
});

module.exports = router;