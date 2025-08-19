import express, { Application } from "express";
import serverless from "serverless-http";
import filtersController from "../controllers/filters.controller";
import { applySecurityMiddlewares } from "../middlewares/security";
import filtersRoutes from "../routes/filters.route";

class Server {
    private app: Application;

    constructor() {
        this.app = express();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandlers();
    }

    private initializeMiddlewares(): void {
        // Apply global security and parsing middlewares
        applySecurityMiddlewares(this.app);
    }

    private initializeRoutes(): void {
        // Register all filters routes
        this.app.use("/filters", filtersRoutes);
    }

    private initializeErrorHandlers(): void {
        // Handle 404 - Not Found
        this.app.use(filtersController.notfound);
    }

    public getHandler() {
        // Return serverless handler
        return serverless(this.app);
    }
}

// Export Lambda handler
const server = new Server();
export const handler = server.getHandler();
