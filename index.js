import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import AuthRoute from './routes/AuthRoute.js';
import ProductRoute from './routes/ProductRoute.js';
import UserRoute from './routes/UserRoute.js';
import CategoryRoute from './routes/CategoryRoute.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(ProductRoute);
app.use(AuthRoute);
app.use(UserRoute);
app.use(CategoryRoute);

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});
