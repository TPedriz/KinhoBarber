const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const planRoutes = require('./src/routes/planRoutes');
const subscriptionRoutes = require('./src/routes/subscriptionRoutes');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.json({ message: 'API Kinho Barber v1.0' }));

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));


// ===== ARQUIVO: src/lib/prisma.js =====
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
module.exports = prisma;
