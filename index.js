require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/alexa', (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    logger.warn(`❌ Intento de acceso sin token válido`);
    return res.status(403).json({ error: 'Acceso denegado: token inválido o faltante.' });
  }

  next();
});

app.post('/alexa', async (req, res) => {
  try {
    const mensaje = req.body?.request?.intent?.slots?.mensaje?.value;

    if (!mensaje) {
      logger.warn(`⚠️ Solicitud sin mensaje válido`);
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
          text: respuesta
        }
      }
    });
  } catch (err) {
    logger.error(`❌ Error interno: ${err.message}`);
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  logger.info(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});