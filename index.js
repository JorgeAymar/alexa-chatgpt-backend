require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const AUTH_TOKEN = process.env.AUTH_TOKEN;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Middleware de autenticación simple
app.use('/alexa', (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(403).json({ error: 'Acceso denegado: token inválido o faltante.' });
  }

  next();
});

app.post('/alexa', async (req, res) => {
  try {
    const mensaje = req.body?.request?.intent?.slots?.mensaje?.value;

    if (!mensaje) {
      return res.status(400).json({ error: 'Falta el mensaje en la solicitud' });
    }

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
    return res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});