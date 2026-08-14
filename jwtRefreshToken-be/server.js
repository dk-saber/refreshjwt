require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const cookieParser = require('cookie-parser');

app.use(express.json());
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('JWT Auth API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
