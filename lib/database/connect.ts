import mongoose from 'mongoose';

const MONGODBURI = process.env.MONGODB_URL!;

const connectToDatabase = async () => {
    if (mongoose?.connection?.readyState === 1) {
        // Already connected
        return;
    }

    try {
        await mongoose.connect(MONGODBURI);
        console.log('Connected to MongoDB Atlas');
    } catch (error) {
        console.error('Error connecting to MongoDB Atlas:', error);
        // Remove process.exit(1) to prevent disrupting the application
        throw new Error('Database connection failed');
    }
};

export default connectToDatabase;