// db.js
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log(process.env.MONGO_URI);  // Print the MongoDB URI to the console
        const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/cross-chat-bot';

        await mongoose.connect('mongodb://127.0.0.1:27017/cross-chat-bot')
            .then(() => console.log('Database connected!'))
            .catch(err => console.log(`DB connection error: ${err.message}`));


        console.log('MongoDB connected');
    } catch (error: any) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};



export default connectDB;
