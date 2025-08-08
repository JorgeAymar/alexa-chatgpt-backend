// Import necessary modules
const express = require('express'); // Web framework for Node.js
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies
const axios = require('axios'); // Promise-based HTTP client for the browser and node.js
require('dotenv').config(); // Loads environment variables from a .env file

// Initialize the Express application
const app = express();
// Define the port for the server to listen on, defaulting to 3000
const port = process.env.PORT || 3000;
// Retrieve the OpenAI API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// Define a POST route for Alexa requests
app.post('/alexa', async (req, res) => {
  // Extract the intent from the Alexa request body
  const intent = req.body.request.intent;
  // Get the message from the 'mensaje' slot, or use a default message
  const mensaje = intent?.slots?.mensaje?.value || 'Hola, ¿cómo estás?';

  try {
    // Make a POST request to the OpenAI API for chat completions
    const completion = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        // Specify the GPT model to use
        model: 'gpt-4',
        // Define the messages for the conversation
        messages: [
          { role: 'system', content: 'Responde en español de forma clara y útil.' }, // System message for context
          { role: 'user', content: mensaje } // User's message from Alexa
        ]
      },
      {
        // Set authorization header with the API key
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json' // Specify content type as JSON
        }
      }
    );

    // Extract the response message from the OpenAI completion
    const respuesta = completion.data.choices[0].message.content;

    // Send the response back to Alexa in the required format
    res.json({
      version: '1.0',
      response: {
        shouldEndSession: true, // Indicate that the session should end
        outputSpeech: {
          type: 'PlainText', // Specify speech type as plain text
          text: respuesta // The text response for Alexa to speak
        }
      }
    });
  } catch (error) {
    // Log any errors that occur during the API call
    console.error(error);
    // Send an error response back to Alexa
    res.json({
      version: '1.0',
      response: {
        shouldEndSession: true,
        outputSpeech: {
          type: 'PlainText',
          text: 'Ocurrió un error al contactar con ChatGPT.' // Error message for the user
        }
      }
    });
  }
});

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Alexa ChatGPT backend escuchando en el puerto ${port}`);
});