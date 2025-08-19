import helmet from "helmet";
import cors from "cors";
import express, { Application } from "express";

export function applySecurityMiddlewares(app: Application) {
    // Security headers
    app.use(helmet());

    // CORS
    app.use(cors({ origin: "*", methods: ["GET", "POST", "PUT", "DELETE"] }));

    // JSON parser
    app.use(express.json());

    // URL-encoded parser
    app.use(express.urlencoded({ extended: true }));
}
