const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Listado de clientes
router.post('/Listado', authMiddleware, async (req, res) => {
  const { identification, nombre, usuarioId } = req.body;
  
  try {
    let query = `
      SELECT c.id, c.identification, c.nombre, c.apellidos, 
             c.telefonoCelular, c.otroTelefono, c.direccion,
             c.fnAcimiento, c.fAficion, c.sexo, c.resenaPersonal,
             c.imagen, c.interesesFK, i.nombre as interesNombre
      FROM clients c
      LEFT JOIN interests i ON c.interesesFK = i.id
      WHERE c.usuarioId = $1
    `;
    let params = [usuarioId];
    let paramIndex = 2;

    if (identification) {
      query += ` AND c.identification ILIKE $${paramIndex}`;
      params.push(`%${identification}%`);
      paramIndex++;
    }

    if (nombre) {
      query += ` AND c.nombre ILIKE $${paramIndex}`;
      params.push(`%${nombre}%`);
      paramIndex++;
    }

    query += ' ORDER BY c.nombre ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar clientes' });
  }
});

// Obtener cliente por ID - Asegurar que devuelve todos los campos
router.get('/Obtener/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await pool.query(`
      SELECT 
        c.id, 
        c.identification, 
        c.nombre, 
        c.apellidos, 
        c.telefonoCelular,
        c.otroTelefono,
        c.direccion,
        c.fnAcimiento,
        c.fAficion,
        c.sexo,
        c.resenaPersonal,
        c.imagen,
        c.interesesFK,
        i.nombre as interesNombre
      FROM clients c
      LEFT JOIN interests i ON c.interesesFK = i.id
      WHERE c.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    
    const client = result.rows[0];
    
    // Asegurar que todos los campos existen
    const response = {
      id: client.id,
      identification: client.identification || '',
      nombre: client.nombre || '',
      apellidos: client.apellidos || '',
      telefonoCelular: client.telefonocelular || '',
      otroTelefono: client.otrotelefono || '',
      direccion: client.direccion || '',
      fnAcimiento: client.fnacimiento || null,
      fAficion: client.faficion || null,
      sexo: client.sexo || 'M',
      resenaPersonal: client.resenapersonal || '',
      imagen: client.imagen || '',
      interesesFK: client.interesesfk || '',
      interesNombre: client.interesnombre || 'No especificado'
    };
    
    console.log('Enviando cliente:', response);
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener cliente' });
  }
});

// Crear cliente
router.post('/Crear', authMiddleware, async (req, res) => {
  const {
    nombre, apellidos, identificacion, telefonoCelular, otroTelefono,
    direccion, fnAcimiento, fAficion, sexo, resenaPersonal, imagen,
    interesesFK, usuarioId
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO clients (
        nombre, apellidos, identification, telefonoCelular, otroTelefono,
        direccion, fnAcimiento, fAficion, sexo, resenaPersonal, imagen,
        interesesFK, usuarioId
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING id`,
      [
        nombre, apellidos, identificacion, telefonoCelular, otroTelefono,
        direccion, fnAcimiento, fAficion, sexo, resenaPersonal, imagen,
        interesesFK, usuarioId
      ]
    );
    
    res.status(200).json({ 
      id: result.rows[0].id, 
      message: 'Cliente creado correctamente' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear cliente: ' + error.message });
  }
});

// Actualizar cliente - CORREGIDO para incluir TODOS los campos
router.post('/Actualizar', authMiddleware, async (req, res) => {
  const {
    id, nombre, apellidos, identificacion, telefonoCelular, otroTelefono,
    direccion, fnAcimiento, fAficion, sexo, resenaPersonal, imagen,
    interesesFK, usuarioId
  } = req.body;

  console.log('Actualizando cliente:', { id, nombre, identificacion, telefonoCelular });

  try {
    const result = await pool.query(
      `UPDATE clients SET
        nombre = $1, 
        apellidos = $2, 
        identification = $3, 
        telefonoCelular = $4,
        otroTelefono = $5, 
        direccion = $6, 
        fnAcimiento = $7, 
        fAficion = $8,
        sexo = $9, 
        resenaPersonal = $10, 
        imagen = $11, 
        interesesFK = $12,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $13 AND usuarioId = $14
      RETURNING id`,
      [
        nombre, apellidos, identificacion, telefonoCelular, otroTelefono,
        direccion, fnAcimiento, fAficion, sexo, resenaPersonal, imagen,
        interesesFK, id, usuarioId
      ]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Cliente no encontrado o no autorizado' });
    }
    
    res.status(200).json({ 
      message: 'Cliente actualizado correctamente' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar cliente: ' + error.message });
  }
});

// Eliminar cliente
router.delete('/Eliminar/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  
  try {
    await pool.query('DELETE FROM clients WHERE id = $1', [id]);
    res.status(200).json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar cliente' });
  }
});

module.exports = router;