import express, { urlencoded } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import compression from 'compression';
import dotenv from 'dotenv';
import path from "path";

import apiRouter from "./api/v1/index.js"

const app = express()

app.use(morgan("dev"));
app.use(express.json({ limit : "50mb" }));
app.use(compression());
app.use(urlencoded({ extended: true}))
app.use(helmet({ crossOriginResourcePolicy: false }));

const corsOptions = {
    origin: ['http://localhost:5173', 'https://your-netlify-app.netlify.app', "https://darling-gaufre-29d494.netlify.app"], // allow dev & prod
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}

app.use(cors(corsOptions));
// app.options("/*", cors(corsOptions));

app.use(( req, res, next ) => {
    res.setTimeout( 360000, () => {
        res.status(504).send({ error: "Request timed out...!"})
    });
    next();
})

app.use("/api/v1", apiRouter)

app.use('/public', express.static(path.join(process.cwd(), 'public'))); 
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads'))); 

export default app;