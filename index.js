require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

// Seguridad y middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Endpoint de salud para validación rápida
app.get('/status', (req, res) => {
  logger.info('🔍 Verificación de estado');
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware de autenticación simple para rutas /alexa
app.use('/alexa', (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    logger.warn('❌ Intento de acceso sin token válido');
    return res.status(403).json({ error: 'Acceso denegado: token inválido o faltante.' });
  }

  next();
});

// Endpoint POST /alexa
app.post('/alexa', async (req, res) => {
  try {
    const mensaje = req.body?.request?.intent?.slots?.mensaje?.value;

    if (!mensaje) {
      logger.warn('⚠️ Solicitud sin mensaje válido');
      return res.status(400).json({ error: 'Falta el mensaje en la solicitud' });
    }

    logger.info(`✅ Pregunta recibida: "${mensaje}"`);

    const respuesta = `Tu backend está funcionando correctamente. Preguntaste: ${mensaje}`;

    return res.json({
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: {
          type: 'PlainText',
          text: respuesta,
        },
      },
    });
  } catch (err) {
    logger.error(`❌ Error interno: ${err.stack || err.message}`);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

// Arranque del servidor
app.listen(PORT, () => {
  logger.info(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});