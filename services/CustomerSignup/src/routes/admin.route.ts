



import { Router } from "express";
import handlers from "../controllers/admin.controller";

const router = Router();

// 🔹 Customer routes
router.post("/dashboard", handlers.adminDashboard);
router.post("/revenue-dashboard", handlers.revenueDashboard);
router.post("/revenue-by-vendor-dashboard", handlers.revenueByVendorDashboard);
router.post("/user-dashboard", handlers.userDashboard);
router.post("/user-tickets-by-status", handlers.getUserTicketsByStatus);


export default router;
