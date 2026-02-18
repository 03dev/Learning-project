import express, { Request, Response } from 'express';
import authRoutes from './routes/auth.routes'
import noteRoutes from './routes/note.routes';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error.middleware';


const app = express();

dotenv.config();
app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send("Server is running");
});

app.use('/auth', authRoutes);
app.use('/api', noteRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 