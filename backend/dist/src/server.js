"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file before importing local modules as they may depend on env variables
dotenv_1.default.config();
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '5000');
if (isNaN(PORT) || PORT < 0 || PORT > 65535) {
    console.error('❌ Invalid PORT number. Using default: 5000');
    process.exit(1);
}
const corsOptions = {
    origin: ((_a = process.env.ALLOWED_ORIGINS) === null || _a === void 0 ? void 0 : _a.split(',')) || '*',
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(express_1.default.json({ limit: '50mb' })); //Init body-parser middleware
app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
app.use((0, cors_1.default)(corsOptions));
app.use((req, res, next) => {
    console.log(`📥 ${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
app.get('/health', (_, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});
//Define Routes
app.use('/api/user', userRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/project', projectRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
        method: req.method
    });
});
app.use((err, _, res, __) => {
    console.error('❌ Global error:', err.stack);
    const isDevelopment = process.env.NODE_ENV === 'development';
    res.status(500).json(Object.assign({ error: 'Internal server error', message: isDevelopment ? err.message : 'Something went wrong' }, (isDevelopment && { stack: err.stack })));
});
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isDevelopment = process.env.NODE_ENV === 'development';
        yield (0, db_1.default)();
        const server = app.listen(PORT, () => {
            console.log('🚀 Server started successfully');
            console.log(`📡 Server is running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            isDevelopment !== null && isDevelopment !== void 0 ? isDevelopment : console.log(`🔗 URL: http://localhost:${PORT}`);
        });
        const gracefulShutdown = (signal) => __awaiter(void 0, void 0, void 0, function* () {
            console.log(`\n${signal} received. Starting graceful shutdown...`);
            server.close(() => {
                console.log('✅ HTTP server closed');
                process.exit(0);
            });
            setTimeout(() => {
                console.error('❌ Could not close connections in time, forcefully shutting down');
                process.exit(1);
            }, 10000);
        });
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
            gracefulShutdown('UNHANDLED_REJECTION');
        });
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            console.error('❌ Uncaught Exception:', error);
            gracefulShutdown('UNCAUGHT_EXCEPTION');
        });
    }
    catch (error) {
        console.error('❌ Error starting server:', error);
        process.exit(1);
    }
});
startServer();
