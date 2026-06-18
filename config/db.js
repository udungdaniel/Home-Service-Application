const mongoose = require('mongoose');

const connectDB = async () => {
    try {

        if (!process.env.MONGODB_URI) {
            throw new Error(
                'MONGODB_URI environment variable is missing'
            );
        }

        const conn = await mongoose.connect(
            process.env.MONGODB_URI
        );

        console.log(
            `MongoDB Connected: ${conn.connection.name}`
        );

        mongoose.connection.on('error', (err) => {
            console.error(
                'MongoDB Runtime Error:',
                err.message
            );
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB Disconnected');
        });

    } catch (error) {

        console.error(
            'MongoDB Connection Error:',
            error.message
        );

        if (process.env.NODE_ENV !== 'test') {
    process.exit(1);
}
    }
};

module.exports = connectDB;