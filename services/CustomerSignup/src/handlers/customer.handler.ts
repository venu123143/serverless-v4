import express, { Application } from "express";
import serverless from "serverless-http";
import handlers from "../controllers/customer.controller";
import { applySecurityMiddlewares } from "../middlewares/security";
import customerRoutes from "../routes/customer.route";

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
        // Register all customer routes
        this.app.use("/customer", customerRoutes);
    }

    private initializeErrorHandlers(): void {
        // Handle 404 - Not Found
        this.app.use(handlers.notfound);
    }

    public getHandler() {
        // Return serverless handler
        return serverless(this.app);
    }
}

// Export Lambda handler
const server = new Server();
export const handler = server.getHandler();
