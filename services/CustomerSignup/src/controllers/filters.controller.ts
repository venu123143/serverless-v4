import { Request, Response } from "express";
import { connectDB } from "@gotask/database";
import { Request as RequestModel } from "@gotask/database/src/models/requests.model";
import RESPONSE, { ResponseStatus } from "../utils/response";
import filtersValidation from "../validations/filters.validation";
import adminService from "../helpers/admin.service";
import { Franchise as FranchiseModel } from "@gotask/database/src/models/franchise.model";
import mongoose from "mongoose";
import { AAADepartment as DepartmentModel } from "@gotask/database/src/models/departments.model";
import { AAADesignation as DesignationModel } from "@gotask/database/src/models/designation.model";

/**
* Get dashboard data grouped by area with pagination
* @param requestBody - Contains franchise ID, date range, and pagination params
* @returns Promise<PaginatedResponse<DashboardAreaResult> | ErrorResponse>
*/
const getDashboardData = async (req: Request, res: Response) => {
    try {
        // Ensure database connection
        await connectDB();

        const {
            AssignedFranchiseId,
            fromDate,
            toDate,
            page = 1,
            limit = 10
        } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDashboardDataSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        let startDate: Date, endDate: Date;

        try {
            const dateRange = adminService.getDateRange(fromDate, toDate);
            startDate = dateRange.startDate;
            endDate = dateRange.endDate;
        } catch (error) {
            return RESPONSE.FailureResponse(res, 400, {
                Message: error instanceof Error ? error.message : "Invalid date format",
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Aggregation pipeline for total count
        const countPipeline = [
            {
                $match: {
                    AssignedFranchiseId,
                    Date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: "$AssignedFranchiseArea",
                    count: { $sum: 1 },
                },
            },
            {
                $count: "totalAreas"
            }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            {
                $match: {
                    AssignedFranchiseId,
                    Date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: "$AssignedFranchiseArea",
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 as const } // Sort by count descending
            },
            {
                $skip: skip,
            },
            {
                $limit: pageLimit,
            },
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            RequestModel.aggregate(countPipeline),
            RequestModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalAreas : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200,
            {
                Status: ResponseStatus.SUCCESS,
                StatusCode: 200,
                Message: "Dashboard data fetched successfully",
                Data: dataResult,
                Meta: {
                    currentPage,
                    totalPages,
                },
            }
        );

    } catch (error) {

        return RESPONSE.FailureResponse(res, 404, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });

    }
}


const getDashboardAreaWiseRequests = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const {
            AssignedFranchiseStateID,
            AssignedFranchiseDistrictID,
            AssignedFranchiseId,
            page = 1,
            limit = 10
        } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDashboardAreaRequestsSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            $and: [
                { AssignedFranchiseStateID },
                { AssignedFranchiseDistrictID },
                { AssignedFranchiseId }
            ]
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: "$AssignedFranchiseArea",
                    count: { $sum: 1 }
                }
            },
            {
                $count: "totalAreas"
            }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: "$AssignedFranchiseArea",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 as const } // Sort by count descending
            },
            {
                $skip: skip
            },
            {
                $limit: pageLimit
            }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            RequestModel.aggregate(countPipeline),
            RequestModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalAreas : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Dashboard area-wise requests fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDashboardAreaWiseRequests:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};



const getDashboardCategoryWise = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const {
            fromDate,
            toDate,
            page = 1,
            limit = 10
        } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDashboardCategorySchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Parse dates
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return RESPONSE.FailureResponse(res, 400, {
                Message: "Invalid date format",
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            Date: {
                $gte: startDate,
                $lte: endDate
            }
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: "$CategoryName",
                    count: { $sum: 1 }
                }
            },
            {
                $count: "totalCategories"
            }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            {
                $match: matchCondition
            },
            {
                $group: {
                    _id: "$CategoryName",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { count: -1 as const } // Sort by count descending
            },
            {
                $skip: skip
            },
            {
                $limit: pageLimit
            }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            RequestModel.aggregate(countPipeline),
            RequestModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalCategories : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Dashboard category-wise requests fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDashboardCategoryWise:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};


const getDashboardFranchiseComplaintCount = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const { AssignedFranchiseId, fromDate, toDate, page = 1, limit = 10 } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDashboardFranchiseComplaintSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Parse dates
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);

        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return RESPONSE.FailureResponse(res, 400, {
                Message: "Invalid date format",
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            $and: [
                {
                    RaisedComplaint: true
                },
                {
                    AssignedFranchiseId: AssignedFranchiseId,
                    Date: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            ],
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            { $match: matchCondition },
            {
                $group: {
                    _id: "$CategoryName",
                    count: { $sum: 1 }
                }
            },
            { $count: "totalCategories" }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            { $match: matchCondition },
            {
                $group: {
                    _id: "$CategoryName",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 as const } }, // Sort by count descending
            { $skip: skip },
            { $limit: pageLimit }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            RequestModel.aggregate(countPipeline),
            RequestModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalCategories : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Dashboard franchise complaint count fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDashboardFranchiseComplaintCount:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};


const getDashboardFranchiseCount = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const { state, page = 1, limit = 10 } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDashboardFranchiseCountSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            State: state
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            { $match: matchCondition },
            {
                $group: {
                    _id: "$District",
                    count: { $sum: 1 }
                }
            },
            { $count: "totalDistricts" }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            { $match: matchCondition },
            {
                $group: {
                    _id: "$District",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 as const } }, // Sort by count descending
            { $skip: skip },
            { $limit: pageLimit }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            FranchiseModel.aggregate(countPipeline),
            FranchiseModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalDistricts : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Dashboard franchise count by district fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDashboardFranchiseCount:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};


const getDropdownDistrictFranchisers = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const { AssignedFranchiseStateID, AssignedFranchiseDistrictID, page = 1, limit = 10 } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDropdownDistrictFranchisersSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            $and: [
                {
                    StateID: AssignedFranchiseStateID
                },
                {
                    DistrictID: AssignedFranchiseDistrictID
                },
            ],
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            { $match: matchCondition },
            { $count: "totalFranchisers" }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            { $match: matchCondition },
            {
                $project: {
                    _id: 1,
                    FranchiseOwnerName: 1,
                },
            },
            { $sort: { FranchiseOwnerName: 1 as const } }, // Sort by name ascending
            { $skip: skip },
            { $limit: pageLimit }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            FranchiseModel.aggregate(countPipeline),
            FranchiseModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalFranchisers : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Dropdown district franchisers fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDropdownDistrictFranchisers:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};


const getAreaWiseComplaintsCount = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const {
            AssignedFranchiseId,
            AssignedFranchiseStateID,
            AssignedFranchiseDistrictID,
            page = 1,
            limit = 10
        } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getAreaWiseComplaintsCountSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            $and: [
                {
                    AssignedFranchiseId: AssignedFranchiseId
                },
                {
                    AssignedFranchiseStateID: AssignedFranchiseStateID,
                },
                {
                    AssignedFranchiseDistrictID: AssignedFranchiseDistrictID,
                },
                {
                    ComplaintRaised: true
                },
            ],
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            { $match: matchCondition },
            {
                $group: {
                    _id: {
                        AssignedFranchiseArea: "$AssignedFranchiseArea",
                    },
                    Total: {
                        $sum: 1
                    },
                },
            },
            { $count: "totalAreas" }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            { $match: matchCondition },
            {
                $group: {
                    _id: {
                        AssignedFranchiseArea: "$AssignedFranchiseArea",
                    },
                    Total: {
                        $sum: 1
                    },
                },
            },
            { $sort: { Total: -1 as const } }, // Sort by total complaints descending
            { $skip: skip },
            { $limit: pageLimit }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            RequestModel.aggregate(countPipeline),
            RequestModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalAreas : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Area-wise complaints count fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getAreaWiseComplaintsCount:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};


const getDepartmentByDeptID = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const { DepartmentID, page = 1, limit = 10 } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDepartmentByDeptIDSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            $and: [
                {
                    _id: DepartmentID
                }
            ],
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            { $match: matchCondition },
            { $count: "totalDepartments" }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            { $match: matchCondition },
            { $skip: skip },
            { $limit: pageLimit }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            DepartmentModel.aggregate(countPipeline),
            DepartmentModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalDepartments : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Department fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDepartmentByDeptID:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};


const getDepartmentsByOrgID = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const { OrganizationID, page = 1, limit = 10 } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDepartmentsByOrgIDSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            $and: [
                {
                    OrganizationID: OrganizationID
                }
            ],
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            { $match: matchCondition },
            { $count: "totalDepartments" }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            { $match: matchCondition },
            { $skip: skip },
            { $limit: pageLimit }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            DepartmentModel.aggregate(countPipeline),
            DepartmentModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalDepartments : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Departments by organization fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDepartmentsByOrgID:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};

/**
 * Handle 404 - Not Found
 */
const notfound = (req: Request, res: Response) => {
    return RESPONSE.FailureResponse(res, 404, {
        StatusCode: 404,
        Message: "Route not found",
        Status: ResponseStatus.FAILED,
    });
};




const getDesignationByDesignationID = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const { DesignationID, page = 1, limit = 10 } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDesignationByDesignationIDSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition
        const matchCondition = {
            $and: [
                {
                    _id: new mongoose.Types.ObjectId(DesignationID)
                }
            ],
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            { $match: matchCondition },
            { $count: "totalDesignations" }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            { $match: matchCondition },
            { $skip: skip },
            { $limit: pageLimit }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            DesignationModel.aggregate(countPipeline),
            DesignationModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalDesignations : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Designation fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDesignationByDesignationID:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};


const getDesignationsByDept = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Ensure database connection
        await connectDB();

        const { DepartmentID, page = 1, limit = 10 } = req.body;

        // Joi Validation
        const { error } = filtersValidation.getDesignationsByDeptSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination calculations
        const currentPage = Math.max(1, Number(page));
        const pageLimit = Math.max(1, Number(limit));
        const skip = (currentPage - 1) * pageLimit;

        // Base match condition (Note: Fixed typo from DepartmenID to DepartmentID)
        const matchCondition = {
            $and: [
                {
                    DepartmentID: DepartmentID
                }
            ],
        };

        // Aggregation pipeline for total count
        const countPipeline = [
            { $match: matchCondition },
            { $count: "totalDesignations" }
        ];

        // Aggregation pipeline for paginated data
        const dataPipeline = [
            { $match: matchCondition },
            {
                $project: {
                    _id: 1,
                    DesignationName: 1,
                },
            },
            { $sort: { DesignationName: 1 as const } }, // Sort by name ascending
            { $skip: skip },
            { $limit: pageLimit }
        ];

        // Execute both pipelines concurrently
        const [countResult, dataResult] = await Promise.all([
            DesignationModel.aggregate(countPipeline),
            DesignationModel.aggregate(dataPipeline)
        ]);

        const totalCount = countResult.length > 0 ? countResult[0].totalDesignations : 0;
        const totalPages = Math.ceil(totalCount / pageLimit);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Designations by department fetched successfully",
            Data: dataResult,
            Meta: {
                currentPage,
                totalPages,
            },
        });

    } catch (error) {
        console.error("Error in getDesignationsByDept:", error);
        return RESPONSE.FailureResponse(res, 500, {
            StatusCode: 500,
            Message: "Internal server error",
            Status: ResponseStatus.FAILED,
        });
    }
};


export default {
    notfound,
    getDashboardData,
    getDesignationsByDept,
    getDepartmentByDeptID,
    getDepartmentsByOrgID,
    getDashboardCategoryWise,
    getDashboardFranchiseCount,
    getAreaWiseComplaintsCount,
    getDashboardAreaWiseRequests,
    getDesignationByDesignationID,
    getDropdownDistrictFranchisers,
    getDashboardFranchiseComplaintCount,
}