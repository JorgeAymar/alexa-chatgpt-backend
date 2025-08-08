
require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());

// Límite de peticiones
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minuto
  max: 10,
  message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde.'
});
app.use(limiter);

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Alexa ChatGPT Backend funcionando');
});

// Ruta para recibir solicitudes desde Alexa
app.post('/alexa', async (req, res) => {
  try {
    const mensaje = req.body?.request?.intent?.slots?.mensaje?.value;
    if (!mensaje) {
      return res.json({
        version: "1.0",
        response: {
          shouldEndSession: true,
          outputSpeech: {
            type: "PlainText",
            text: "No entendí tu mensaje. ¿Puedes repetirlo?"
          }
        }
      });
    }

    const respuesta = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: mensaje }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const texto = respuesta.data.choices[0].message.content;

    res.json({
      version: "1.0",
      response: {
        shouldEndSession: true,
        outputSpeech: {
          type: "PlainText",
          text: texto
        }
      }
    });
  } catch (error) {
    console.error('Error al responder a Alexa:', error.message);
    res.status(500).json({
      version: "1.0",
      response: {
        shouldEndSession: true,
        outputSpeech: {
          type: "PlainText",
          text: "Lo siento, hubo un problema al procesar tu solicitud."
        }
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
