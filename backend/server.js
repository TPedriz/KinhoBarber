import express, { json } from 'express';
import cors from 'cors';
require('dotenv').config();

import authRoutes from './src/routes/authRoutes';
import planRoutes from './src/routes/planRoutes';
import subscriptionRoutes from './src/routes/subscriptionRoutes';

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(json());

app.get('/', (req, res) => res.json({ message: 'API Kinho Barber v1.0' }));

app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/subscriptions', subscriptionRoutes);

app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));

export default app; // Export the app for testing purposes
Exporta(); // Export the PORT for testing purposes    

function Exporta() {
    return { PORT };
}
