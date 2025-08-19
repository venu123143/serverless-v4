import { Router } from "express";
import handlers from "../controllers/customer.controller";

const router = Router();

// 🔹 Customer routes
router.post("/signup", handlers.customerSignup);
router.post("/login", handlers.CustomerCareLogin);

// 🔹 Customer Care Admin routes
router.post("/admin/login", handlers.CustomerCareAdminLogin);
router.post("/admin/users", handlers.CustomerSaveUserdata);
router.get("/admin/users", handlers.CustomerUsersList);
router.delete("/admin/users/:id", handlers.deleteCustomerUser);
router.put("/admin/users/:id", handlers.UpdateCustomerUser);

// 🔹 Department-based routes
router.post("/admin/users/by-department", handlers.getUsersForDept);
router.post("/admin/managers/by-department", handlers.getManagerForDept);

export default router;
