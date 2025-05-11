import express, { Application } from 'express';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config();

import connectDB from './config/db';

import userRoute from './routes/userRoutes';
import authRoute from './routes/authRoutes';
import projectRoute from './routes/projectRoutes';
import uploadRoute from './routes/uploadRoutes';

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000');

connectDB();                                //Connect to the database
app.use(express.json({ extended: true, limit: '50mb' }));  //Init body-parser middleware
app.use(cors());

//Define Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/project', projectRoute);
app.use('/api/upload', uploadRoute);

app.listen(PORT, () => {
    console.log(`Server is connected at port ${PORT}`);
});
