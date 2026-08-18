require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const cookieParser = require('cookie-parser');



app.use(cors({
  origin: 'http://localhost:3000',          // l'origine exacte du frontend Nuxt
  credentials: true                         // autorise l'envoi/réception des cookies
}));

app.use(express.json());
app.use(cookieParser());                    // <-- à déplacer AVANT les routes (voir point 3)
connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('JWT Auth API running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
