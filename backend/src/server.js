const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');

const userRoute = require('./routes/userRoutes');
const authRoute = require('./routes/authRoutes');
const projectRoute = require('./routes/projectRoutes');
const uploadRoute = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

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
