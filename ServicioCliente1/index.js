const express = require('express');
const axios = require('axios');
const amqp = require('amqplib');

// Crear una aplicación Express
const app = express();
app.use(express.json());

const ADMIN_DOCS_URL = 'http://localhost:3000';
const RABBITMQ_URL = 'amqp://ServicioCliente1:ServicioCliente1@localhost';
const QUEUE_NAME = 'document_queue';
let documents = [];  // Almacenar documentos enviados

// Conectar a RabbitMQ
async function conectarRabbitMQ() {
  const conn = await amqp.connect(RABBITMQ_URL);
  const channel = await conn.createChannel();
  await channel.assertQueue(QUEUE_NAME, { durable: true });
  return channel;
}

// Función para enviar documentos
const sendDocuments = async (docs) => {
  try {
    const channel = await conectarRabbitMQ();
    docs.forEach(doc => {
      channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(doc)), { persistent: true });
    });
    console.log('Documentos enviados a la cola');
  } catch (error) {
    console.error('Error enviando documentos:', error);
  }
};

// Función para consultar el estado de los documentos
const checkStatus = async () => {
  try {
    for (const doc of documents) {
      const response = await axios.get(`${ADMIN_DOCS_URL}/check_status/${doc.id}`);
      console.log(`Documento ${doc.id}: ${response.data.status}`);
    }
  } catch (error) {
    console.error('Error consultando estado:', error);
  }
};

// Simulación de envío de documentos cada 2 minutos
setInterval(() => {
  const newDocs = Array.from({ length: 50 }, (_, i) => ({ id: `doc_${Date.now()}_${i}` }));
  documents.push(...newDocs);
  sendDocuments(newDocs);
}, 120000);

// Simulación de consulta de estado cada 2 minutos
setInterval(checkStatus, 120000);

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`ServicioCliente1 corriendo en el puerto ${PORT}`);
});
