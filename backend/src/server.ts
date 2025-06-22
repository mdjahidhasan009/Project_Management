import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'http';

// Load environment variables from .env file before importing local modules as they may depend on env variables
dotenv.config();

import connectDB from './config/db';

import userRoute from './routes/userRoutes';
import authRoute from './routes/authRoutes';
import projectRoute from './routes/projectRoutes';
import uploadRoute from './routes/uploadRoutes';


const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000');
if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
    console.error('❌ Invalid PORT number. Using default: 5000');
    process.exit(1);
}

const corsOptions: cors.CorsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(express.json({ limit: '50mb' }));  //Init body-parser middleware
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors(corsOptions));

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.get('/health', (_: Request, res: Response) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

//Define Routes
app.use('/api/user', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/project', projectRoute);
app.use('/api/upload', uploadRoute);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});


app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
    console.error('❌ Global error:', err.stack);

    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(500).json({
        error: 'Internal server error',
        message: isDevelopment ? err.message : 'Something went wrong',
        ...(isDevelopment && { stack: err.stack })
    });
});

const startServer = async (): Promise<void> => {
    try {
        const isDevelopment = process.env.NODE_ENV === 'development';
        await connectDB();

        const server: Server = app.listen(PORT, () => {
            console.log('🚀 Server started successfully');
            console.log(`📡 Server is running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            isDevelopment ?? console.log(`🔗 URL: http://localhost:${PORT}`);
        });

        const gracefulShutdown = async (signal: string): Promise<void> => {
            console.log(`\n${signal} received. Starting graceful shutdown...`);

            server.close(()=> {
                console.log('✅ HTTP server closed');
                process.exit(0);
            })

            setTimeout(() => {
                console.error('❌ Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown('UNHANDLED_REJECTION');
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error: Error) => {
            console.error('❌ Uncaught Exception:', error);
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });
    } catch (error: unknown) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
};

startServer();
