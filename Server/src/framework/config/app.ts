import express, { Express } from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import morgan from "morgan";
import errorHandlerMiddleware from "../middleware/error.middleware";

// auth router
import authRouter from "../router/auth.router";

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

app.use("/auth", authRouter); // auth router

app.use(errorHandlerMiddleware); // error Handling Midlleware

export default app;