// server.ts

import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import messagingRoutes from './routes/messagingRoutes';
import { Server } from 'http';
import { initializeSocketIo } from './socketManager';  // Update the path accordingly
import connectDB from './db';  // Import connectDB from db.js

try {
  dotenv.config();
} catch (error) {
  console.error('Error loading .env file:', error);
}

connectDB();  // Call connectDB to connect to MongoDB

const app = express();
const httpServer = new Server(app);
initializeSocketIo(httpServer);

app.use(bodyParser.json());
app.use('/api', messagingRoutes);

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
