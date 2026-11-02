import express from 'express';
import connectDB from './src/database/connect.js';
import cors from 'cors';
import dotenv from 'dotenv';
import billRoutes from './src/modules/bills/routes.js';
import participantRoutes from './src/modules/participants/routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors({origin: 'https://even-tab-frontend.vercel.app/'}))

app.use('/api', billRoutes);
app.use('/api', participantRoutes);

app.listen(PORT, async () => {
    await connectDB();
    console.log(`Server is running`);
});