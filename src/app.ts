import express, { Application } from 'express';
import cors from 'cors';
import router from './routes';
import errorHandler from './middlewares/errorHandler';

const app: Application = express();

// Enable CORS
app.use(cors());

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes to handle All request
app.use(router);

// Middleware for handling Error
app.use(errorHandler);

export default app;
