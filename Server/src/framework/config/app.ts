import express, { Express } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import morgan from "morgan";

const app: Express = express();

const CORS_ORIGIN: string = process.env.CORS_ORIGIN ?? "http://localhost:3000";

app.use(cors({
    origin: [CORS_ORIGIN],
    credentials: true
}));

//for parseing cookie data
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev")); // Loging all http requests in detail

export default app;