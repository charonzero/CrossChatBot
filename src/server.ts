import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import messagingRoutes from './routes/messagingRoutes';

try {
  dotenv.config();
} catch (error) {
  console.error('Error loading .env file:', error);
}

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use('/api', messagingRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
