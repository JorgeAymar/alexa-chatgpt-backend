# Alexa ChatGPT Backend

This project provides a backend service that connects Amazon Alexa with OpenAI's ChatGPT. It allows you to interact with ChatGPT through your Alexa-enabled devices.

## Project Structure

- `index.js`: The main Node.js application that handles Alexa requests and communicates with the OpenAI API.
- `package.json`: Defines project metadata and dependencies.
- `Dockerfile`: Docker configuration for building the application image.
- `docker-compose.yml`: Docker Compose configuration for running the application.
- `.env`: Environment variables (e.g., `OPENAI_API_KEY`).

## Getting Started

### Prerequisites

Before you begin, ensure you have:

- An AWS Account (for Alexa Skill hosting, if not using a direct VPS endpoint).
- Access to the [Alexa Developer Console](https://developer.amazon.com/alexa/console/ask).
- A Virtual Private Server (VPS) with Docker and Docker Compose installed.
- An OpenAI API Key.

### Local Development

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/JorgeAymar/alexa-chatgpt-backend.git
    cd alexa-chatgpt-backend
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Create a `.env` file:**
    Create a file named `.env` in the root directory and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```
4.  **Run the application:**
    ```bash
    npm start
    ```
    The server will start on `http://localhost:3000`.

## Deployment to a VPS

This project is set up to be easily deployed using Docker and Docker Compose.

1.  **Connect to your VPS:**
    Use SSH to connect to your VPS.
    ```bash
    ssh user@your_vps_ip
    ```
2.  **Clone the repository on your VPS:**
    ```bash
    git clone https://github.com/JorgeAymar/alexa-chatgpt-backend.git
    cd alexa-chatgpt-backend
    ```
3.  **Create the `.env` file on your VPS:**
    Inside the `alexa-chatgpt-backend` directory, create a `.env` file with your OpenAI API key:
    ```
    OPENAI_API_KEY=your_openai_api_key_here
    ```
4.  **Run the application using Docker Compose:**
    ```bash
    docker-compose up -d
    ```
    This command will build the Docker image (if not already built) and start the container in detached mode. The application will be accessible on port `3000` of your VPS.

    **Important:** Ensure that port `3000` is open in your VPS firewall settings.

## Connecting Alexa to your VPS Backend

To connect your Alexa Skill to the backend running on your VPS, you will need to configure the endpoint in the Alexa Developer Console.

1.  **Log in to the Alexa Developer Console:**
    Go to [https://developer.amazon.com/alexa/console/ask](https://developer.amazon.com/alexa/console/ask) and log in.

2.  **Navigate to your Skill:**
    Find and click on your Alexa Skill. If you haven't created one, you'll need to create a new custom skill.

3.  **Configure the Endpoint:**
    - In the left-hand navigation, click on **Endpoint**.
    - Select the **HTTPS** radio button.
    - In the "Default Region" field, enter the URL of your VPS backend. This will typically be `https://your_vps_ip:3000/alexa` (replace `your_vps_ip` with the actual IP address or domain name of your VPS).
    - For the SSL Certificate type, select "My development endpoint is a subdomain of a domain that has a wildcard certificate from a certificate authority" or "My development endpoint has a certificate from a trusted certificate authority" if you have a valid SSL certificate for your VPS. If you are just testing, you might need to use a self-signed certificate or a service like ngrok for local testing, but for a VPS, a proper SSL setup is recommended.

4.  **Save Endpoints:**
    Click the "Save Endpoints" button at the top of the page.

5.  **Build and Test:**
    - Go to the **Build** tab and click "Build Model" if you made any changes to the interaction model.
    - Go to the **Test** tab to test your Alexa Skill. You should be able to invoke your skill and have it communicate with your VPS backend.

## Security Considerations

- **HTTPS:** Always use HTTPS for your Alexa Skill endpoint. If you don't have a domain with an SSL certificate, consider using a reverse proxy like Nginx or Caddy on your VPS to handle SSL termination, or a service like Let's Encrypt to get a free SSL certificate for your domain.
- **API Key Security:** Never hardcode your OpenAI API key directly in your code. Use environment variables as demonstrated in this project.
- **Firewall:** Configure your VPS firewall to only allow necessary incoming connections (e.g., SSH, and port 3000 for your application).