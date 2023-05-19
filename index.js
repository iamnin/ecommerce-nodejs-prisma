import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthRoute from "./routes/AuthRoute.js";
import ProductRoute from "./routes/ProductRoute.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(ProductRoute);
app.use(AuthRoute)

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});