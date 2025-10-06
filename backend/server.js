require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
// Database connection
let pool;

async function initializeDatabase() {
  try {
    // Primero crear la base de datos si no existe
    const tempPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    await tempPool.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'motostecniya'}`);
    
    // Ahora crear el pool principal con la base de datos seleccionada
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'motostecniya',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // Crear todas las tablas necesarias
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tblcliente (
        Id INT PRIMARY KEY AUTO_INCREMENT,
        Nombre VARCHAR(100) NOT NULL,
        Apellido VARCHAR(100) NOT NULL,
        Telefono VARCHAR(20),
        Correo VARCHAR(100) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL,
        FechaRegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tblmecanicoaux (
        Cedula INT PRIMARY KEY,
        Nombre VARCHAR(100) NOT NULL,
        Apellido VARCHAR(100) NOT NULL,
        Telefono VARCHAR(20),
        Correo VARCHAR(100) UNIQUE NOT NULL,
        Password VARCHAR(255) NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS tblcitas (
        Id INT PRIMARY KEY AUTO_INCREMENT,
        ClienteId INT,
        Fecha DATE,
        Hora TIME,
        Servicio VARCHAR(100),
        Estado VARCHAR(20),
        FOREIGN KEY (ClienteId) REFERENCES tblcliente(Id)
      )
    `);

    console.log('Base de datos inicializada correctamente');
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error);
    process.exit(1);
  }
}

// Inicializar la base de datos antes de iniciar el servidor
initializeDatabase();

// Registro de clientes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, contrasena, nombre, apellido, telefono } = req.body;

    // Verificar si el correo ya existe
    const [existingUsers] = await pool.query(
      'SELECT * FROM tblclientes WHERE Correo = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar nuevo cliente
    const [result] = await pool.query(
      'INSERT INTO tblcliente (Nombre, Apellido, Telefono, Correo, Password) VALUES (?, ?, ?, ?, ?)',
      [nombre, apellido, telefono, email, hashedPassword]
    );
    
    console.log('Cliente registrado:', { id: result.insertId, email, nombre, apellido });

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: result.insertId,
        email: email,
        type: 'cliente'
      },
      process.env.JWT_SECRET || 'tu_secret_key_temporal',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertId,
        email,
        nombre,
        apellido,
        type: 'cliente'
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Intento de login:', req.body);
    const { email, contrasena } = req.body;
    
    if (!email || !contrasena) {
      console.log('Faltan credenciales:', { email, contrasena });
      return res.status(400).json({ message: 'Email y contraseña son requeridos' });
    }
    
    // Verificar si es un mecánico
    const [mecanicos] = await pool.query(
      'SELECT * FROM tblmecanicoaux WHERE Correo = ?',
      [email]
    );

    let user = mecanicos[0];
    let userType = 'mecanico';
    console.log('Resultado búsqueda mecánico:', user);

    // Si no es mecánico, verificar si es cliente
    if (!user) {
      const [clientes] = await pool.query(
        'SELECT * FROM tblcliente WHERE Correo = ?',
        [email]
      );
      user = clientes[0];
      userType = 'cliente';
      console.log('Resultado búsqueda cliente:', user);
    }

    if (!user) {
      console.log('Usuario no encontrado:', email);
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log('Usuario encontrado:', { ...user, Password: '***' });

    // Verificar contraseña
    const validPassword = await bcrypt.compare(contrasena, user.Password);
    console.log('Validación de contraseña:', validPassword);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { 
        id: user.Id || user.Cedula,
        email: user.Correo,
        type: userType
      },
      process.env.JWT_SECRET || 'tu_secret_key_temporal',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.Id || user.Cedula,
        email: user.Correo,
        nombre: user.Nombre,
        apellido: user.Apellido,
        type: userType
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secret_key_temporal');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Ruta protegida de ejemplo
app.get('/api/perfil', authMiddleware, async (req, res) => {
  try {
    const { id, type } = req.user;
    let userData;

    if (type === 'mecanico') {
      const [mecanicos] = await pool.query(
        'SELECT Cedula, Nombre, Apellido, Telefono, Correo FROM tblmecanicoaux WHERE Cedula = ?',
        [id]
      );
      userData = mecanicos[0];
    } else {
      const [clientes] = await pool.query(
        'SELECT Id, Nombre, Apellido, Telefono, Correo FROM tblclientes WHERE Id = ?',
        [id]
      );
      userData = clientes[0];
    }

    if (!userData) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(userData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Endpoint para refrescar el token
app.post('/api/auth/refresh', authMiddleware, (req, res) => {
  try {
    const { id, email, type } = req.user;
    
    // Generar nuevo token
    const newToken = jwt.sign(
      { id, email, type },
      process.env.JWT_SECRET || 'tu_secret_key_temporal',
      { expiresIn: '24h' }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al refrescar el token' });
  }
});

// Endpoint para obtener las citas del usuario
app.get('/api/citas', authMiddleware, async (req, res) => {
  try {
    const { id, type } = req.user;
    const [citas] = await pool.query(
      'SELECT * FROM tblcitas WHERE ClienteId = ? ORDER BY Fecha ASC',
      [id]
    );
    
    res.json(citas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las citas' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});