require('dotenv').config({ path: './server/.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', productRoutes);

const PORT = process.env.PORT || 5001; // CHANGED PORT TO 5001

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));