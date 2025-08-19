import express from "express";
import filtersController from "../controllers/filters.controller";

const router = express.Router();

// Dashboard routes
router.post("/dashboard", filtersController.getDashboardData);
router.post("/dashboard/area-requests", filtersController.getDashboardAreaWiseRequests);
router.post("/dashboard/category-wise", filtersController.getDashboardCategoryWise);
router.post("/dashboard/franchise-complaints", filtersController.getDashboardFranchiseComplaintCount);
router.post("/dashboard/franchise-count", filtersController.getDashboardFranchiseCount);

// Area and complaints routes
router.post("/area-complaints-count", filtersController.getAreaWiseComplaintsCount);
router.post("/dropdown/district-franchisers", filtersController.getDropdownDistrictFranchisers);

// Department routes
router.post("/department/by-id", filtersController.getDepartmentByDeptID);
router.post("/departments/by-org", filtersController.getDepartmentsByOrgID);

// Designation routes
router.post("/designation/by-id", filtersController.getDesignationByDesignationID);
router.post("/designations/by-dept", filtersController.getDesignationsByDept);

export default router;
