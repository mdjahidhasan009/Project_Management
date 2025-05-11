import mongoose from 'mongoose';

const connectDB = async () => {
    const dbUrl: string = process.env.MONGOURL || "";
    const mongooseConnectOptionObj: mongoose.ConnectionOptions = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    }

    try {
        await mongoose.connect(dbUrl, mongooseConnectOptionObj);
        console.info('MongoDB database connected');
    } catch (e) {
        if(e instanceof Error) {
            console.error(e.message);
        } else {
            console.error('Unknown Error')
            console.error(e);
        }
    }
}

export default connectDB;
