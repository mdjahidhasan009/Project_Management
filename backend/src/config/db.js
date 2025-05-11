const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGOURL, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB database connected');
    } catch (e) {
        console.error(e.message);
    }
}

module.exports = connectDB;
