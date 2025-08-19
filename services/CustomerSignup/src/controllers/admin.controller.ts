import { Request, Response } from "express";
import { connectDB } from "@gotask/database/src/connection";
import { AAACustomer } from "@gotask/database/src/models/aaacustomers.model";
import { Vendor } from "@gotask/database/src/models/vendor.model";
import { Franchise } from "@gotask/database/src/models/franchise.model";
import { Request as RequestModel } from "@gotask/database/src/models/requests.model";
import RESPONSE, { ResponseStatus } from "../utils/response";
import adminService from "../helpers/admin.service";
import { DashboardMetric, AggregationResult, PaymentStatus, VendorCategory, JobRole, RevenueMetric, RevenueAggregationResult, TicketAggregationResult, TicketStatus, FilterType, UserDashboardMetric } from "../types/admin.types";


/**
 * Admin Dashboard - Get aggregated statistics
 * Returns various metrics including user counts, vendor counts, employee counts, and request statistics
 */
const adminDashboard = async (req: Request, res: Response): Promise<Response> => {
    try {
        await connectDB();

        const response: DashboardMetric[] = [];
        const { startDate, endDate } = adminService.getDateRange();

        // Execute all aggregation queries in parallel for better performance
        const [
            totalUsers,
            profileUpdatedUsers,
            profileNotUpdatedUsers,
            carWashVendors,
            towingVendors,
            permanentEmployees,
            contractBasedEmployees,
            todayRequests,
            failedRequests,
            totalFranchises
        ] = await Promise.all([
            // Get total users count
            AAACustomer.aggregate<AggregationResult>([
                {
                    $group: {
                        _id: "Total Users",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get profile updated users count
            AAACustomer.aggregate<AggregationResult>([
                { $match: { isProfileUpdated: true } },
                {
                    $group: {
                        _id: "Total Profile Updated Users",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get profile not updated users count
            AAACustomer.aggregate<AggregationResult>([
                { $match: { isProfileUpdated: false } },
                {
                    $group: {
                        _id: "Total Profile Not Updated Users",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get car wash vendors count
            Vendor.aggregate<AggregationResult>([
                { $match: { CategoryName: VendorCategory.CAR_WASH } },
                {
                    $group: {
                        _id: "Total Car wash Vendors",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get towing vendors count
            Vendor.aggregate<AggregationResult>([
                { $match: { CategoryName: VendorCategory.TOWING } },
                {
                    $group: {
                        _id: "Total Towing Vendors",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get permanent employees count
            Franchise.aggregate<AggregationResult>([
                { $unwind: "$EmployeeData" },
                { $match: { "EmployeeData.JobRoleName": JobRole.PERMANENT } },
                {
                    $group: {
                        _id: "Total Permanent Employees",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get contract-based employees count
            Franchise.aggregate<AggregationResult>([
                { $unwind: "$EmployeeData" },
                { $match: { "EmployeeData.JobRoleName": JobRole.CONTRACT_BASED } },
                {
                    $group: {
                        _id: "Total Contract Based Employees",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get today's successful requests count
            RequestModel.aggregate<AggregationResult>([
                {
                    $match: {
                        PaymentStatus: PaymentStatus.SUCCESS,
                        Date: { $gte: startDate, $lt: endDate }
                    }
                },
                {
                    $group: {
                        _id: "Total Request For Today",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get today's failed payment requests count
            RequestModel.aggregate<AggregationResult>([
                {
                    $match: {
                        PaymentStatus: PaymentStatus.FAILED,
                        Date: { $gte: startDate, $lt: endDate }
                    }
                },
                {
                    $group: {
                        _id: "Total Request Failed For Today",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get total franchises count
            Franchise.aggregate<AggregationResult>([
                {
                    $group: {
                        _id: "Total Franchise",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Process all aggregation results
        response.push(
            adminService.processAggregationResult(totalUsers, "Total Users"),
            adminService.processAggregationResult(profileUpdatedUsers, "Total Profile Updated Users"),
            adminService.processAggregationResult(profileNotUpdatedUsers, "Total Profile Not Updated Users"),
            adminService.processAggregationResult(carWashVendors, "Total Car wash Vendors"),
            adminService.processAggregationResult(towingVendors, "Total Towing Vendors"),
            adminService.processAggregationResult(permanentEmployees, "Total Permanent Employees"),
            adminService.processAggregationResult(contractBasedEmployees, "Total Contract Based Employees"),
            adminService.processAggregationResult(todayRequests, "Total Request For Today"),
            adminService.processAggregationResult(failedRequests, "Total Failed Request For Today"),
            adminService.processAggregationResult(totalFranchises, "Total Franchise")
        );

        const dashboardResponse = {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Dashboard data retrieved successfully",
            Data: response
        };

        return RESPONSE.SuccessResponse(res, 200, dashboardResponse);

    } catch (error) {
        console.error("Admin Dashboard Error:", error);

        const errorResponse = {
            Status: ResponseStatus.FAILED,
            StatusCode: 500,
            Message: error instanceof Error ? error.message : "Internal server error"
        };

        return RESPONSE.FailureResponse(res, 500, errorResponse);
    }
};







/**
 * Revenue Dashboard - Get aggregated revenue statistics
 * Returns various revenue metrics including daily and overall request counts and income
 */
const revenueDashboard = async (req: Request, res: Response): Promise<Response> => {
    try {
        await connectDB();

        const response: RevenueMetric[] = [];
        const { startDate, endDate } = adminService.getDateRange();

        // Execute all aggregation queries in parallel for better performance
        const [
            todayRequests,
            allRequests,
            todayCarWashRequests,
            allCarWashRequests,
            todayTowingRequests,
            allTowingRequests
        ] = await Promise.all([
            // Get today's successful requests count and revenue
            RequestModel.aggregate<RevenueAggregationResult>([
                {
                    $match: {
                        PaymentStatus: PaymentStatus.SUCCESS,
                        Date: { $gte: startDate, $lt: endDate }
                    }
                },
                {
                    $group: {
                        _id: "Today Request",
                        count: { $sum: 1 },
                        Totalincome: { $sum: "$Price" }
                    }
                }
            ]),

            // Get all successful requests count and revenue
            RequestModel.aggregate<RevenueAggregationResult>([
                {
                    $match: {
                        PaymentStatus: PaymentStatus.SUCCESS
                    }
                },
                {
                    $group: {
                        _id: "Overall Request",
                        count: { $sum: 1 },
                        Totalincome: { $sum: "$Price" }
                    }
                }
            ]),

            // Get today's car wash requests count and revenue
            RequestModel.aggregate<RevenueAggregationResult>([
                { $unwind: "$Services" },
                {
                    $match: {
                        CategoryName: VendorCategory.CAR_WASH,
                        PaymentStatus: PaymentStatus.SUCCESS,
                        Date: { $gte: startDate, $lt: endDate }
                    }
                },
                {
                    $group: {
                        _id: "Today Carwash Payments",
                        count: { $sum: 1 },
                        Totalincome: { $sum: "$Services.Price" }
                    }
                }
            ]),

            // Get all car wash requests count and revenue
            RequestModel.aggregate<RevenueAggregationResult>([
                { $unwind: "$Services" },
                {
                    $match: {
                        CategoryName: VendorCategory.CAR_WASH,
                        PaymentStatus: PaymentStatus.SUCCESS
                    }
                },
                {
                    $group: {
                        _id: "Total Carwash Payments",
                        count: { $sum: 1 },
                        Totalincome: { $sum: "$Services.Price" }
                    }
                }
            ]),

            // Get today's towing requests count and revenue
            RequestModel.aggregate<RevenueAggregationResult>([
                { $unwind: "$Services" },
                {
                    $match: {
                        CategoryName: VendorCategory.TOWING,
                        PaymentStatus: PaymentStatus.SUCCESS,
                        Date: { $gte: startDate, $lt: endDate }
                    }
                },
                {
                    $group: {
                        _id: "Today Towing Payments",
                        count: { $sum: 1 },
                        Totalincome: { $sum: "$Services.Price" }
                    }
                }
            ]),

            // Get all towing requests count and revenue
            RequestModel.aggregate<RevenueAggregationResult>([
                { $unwind: "$Services" },
                {
                    $match: {
                        CategoryName: VendorCategory.TOWING,
                        PaymentStatus: PaymentStatus.SUCCESS
                    }
                },
                {
                    $group: {
                        _id: "Total Towing Payments",
                        count: { $sum: 1 },
                        Totalincome: { $sum: "$Services.Price" }
                    }
                }
            ])
        ]);

        // Process all aggregation results
        response.push(
            adminService.processRevenueAggregationResult(todayRequests, "Today Request"),
            adminService.processRevenueAggregationResult(allRequests, "Overall Request"),
            adminService.processRevenueAggregationResult(todayCarWashRequests, "Today Carwash Payments"),
            adminService.processRevenueAggregationResult(allCarWashRequests, "Total Carwash Payments"),
            adminService.processRevenueAggregationResult(todayTowingRequests, "Today Towing Payments"),
            adminService.processRevenueAggregationResult(allTowingRequests, "Total Towing Payments")
        );

        const dashboardResponse = {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Revenue dashboard data retrieved successfully",
            Data: response
        };

        return RESPONSE.SuccessResponse(res, 200, dashboardResponse);

    } catch (error) {
        console.error("Revenue Dashboard Error:", error);

        const errorResponse = {
            Status: ResponseStatus.FAILED,
            StatusCode: 500,
            Message: error instanceof Error ? error.message : "Internal server error"
        };

        return RESPONSE.FailureResponse(res, 500, errorResponse);
    }
};

/**
 * Alternative implementation with detailed vendor breakdown for car wash
 * This handles the vendor-specific grouping that was in the original car wash query
 */
const revenueByVendorDashboard = async (req: Request, res: Response): Promise<Response> => {
    try {
        await connectDB();

        const { startDate, endDate } = adminService.getDateRange();

        // Get today's car wash requests grouped by vendor
        const carWashByVendor = await RequestModel.aggregate<RevenueAggregationResult>([
            { $unwind: "$Services" },
            {
                $match: {
                    CategoryName: VendorCategory.CAR_WASH,
                    PaymentStatus: PaymentStatus.SUCCESS,
                    Date: { $gte: startDate, $lt: endDate }
                }
            },
            {
                $group: {
                    _id: { "Vendor Name": "$VendorName" }, // Fixed typo: VenodrName -> VendorName
                    count: { $sum: 1 },
                    Totalincome: { $sum: "$Services.Price" }
                }
            }
        ]);

        const vendorMetrics: RevenueMetric[] = carWashByVendor.map(vendor => {
            const vendorName = (vendor._id as { "Vendor Name": string })["Vendor Name"];
            return adminService.createRevenueMetric(`Vendor: ${vendorName}`, vendor.count, vendor.Totalincome);
        });

        const dashboardResponse = {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Revenue by vendor dashboard data retrieved successfully",
            Data: vendorMetrics
        };

        return RESPONSE.SuccessResponse(res, 200, dashboardResponse);

    } catch (error) {
        console.error("Revenue By Vendor Dashboard Error:", error);

        const errorResponse = {
            Status: ResponseStatus.FAILED,
            StatusCode: 500,
            Message: error instanceof Error ? error.message : "Internal server error"
        };

        return RESPONSE.FailureResponse(res, 500, errorResponse);
    }
};




/**
 * User Dashboard - Get aggregated ticket statistics for a specific assigned person
 * Returns various ticket metrics including counts by status
 */
const userDashboard = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Validate required parameters
        if (!req.body?.AssignedPersonID) {
            return RESPONSE.FailureResponse(res, 400, {
                Status: ResponseStatus.FAILED,
                StatusCode: 400,
                Message: "AssignedPersonID is required"
            });
        }

        await connectDB();

        const { AssignedPersonID } = req.body;
        const response: UserDashboardMetric[] = [];

        // Execute all aggregation queries in parallel for better performance
        const [
            allTickets,
            openTickets,
            waitingForApprovalTickets,
            closedTickets,
            refundApprovalTickets
        ] = await Promise.all([
            // Get all tickets for the assigned person
            RequestModel.aggregate<TicketAggregationResult>([
                {
                    $match: {
                        "TicketStatus.AssignedPersonID": AssignedPersonID
                    }
                },
                {
                    $group: {
                        _id: "All Tickets",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get open tickets
            RequestModel.aggregate<TicketAggregationResult>([
                {
                    $match: {
                        $and: [
                            { "RaiseComplaint.AssignedPersonID": AssignedPersonID },
                            { "RaiseComplaint.Status": TicketStatus.OPEN }
                        ]
                    }
                },
                {
                    $group: {
                        _id: "Open Tickets",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get tickets waiting for approval
            RequestModel.aggregate<TicketAggregationResult>([
                {
                    $match: {
                        $and: [
                            { "RaiseComplaint.AssignedPersonID": AssignedPersonID },
                            { "RaiseComplaint.Status": TicketStatus.WAITING_FOR_APPROVAL }
                        ]
                    }
                },
                {
                    $group: {
                        _id: "Waiting For An Approval",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get closed tickets
            RequestModel.aggregate<TicketAggregationResult>([
                {
                    $match: {
                        $and: [
                            { "TicketStatus.AssignedPersonID": AssignedPersonID },
                            { "RaiseComplaint.Status": TicketStatus.CLOSED }
                        ]
                    }
                },
                {
                    $group: {
                        _id: "Closed Tickets",
                        count: { $sum: 1 }
                    }
                }
            ]),

            // Get refund approval tickets
            RequestModel.aggregate<TicketAggregationResult>([
                {
                    $match: {
                        $and: [
                            { "TicketStatus.AssignedPersonID": AssignedPersonID },
                            { "RaiseComplaint.Status": TicketStatus.REFUND_APPROVALS }
                        ]
                    }
                },
                {
                    $group: {
                        _id: "Refund Approvals",
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);

        // Process all aggregation results
        response.push(
            adminService.processTicketAggregationResult(allTickets, "All Tickets", FilterType.ALL_TICKETS),
            adminService.processTicketAggregationResult(openTickets, "Open Tickets", FilterType.OPEN),
            adminService.processTicketAggregationResult(waitingForApprovalTickets, "Waiting For An Approval", FilterType.WAITING_FOR_APPROVAL),
            adminService.processTicketAggregationResult(closedTickets, "Closed Tickets", FilterType.CLOSED),
            adminService.processTicketAggregationResult(refundApprovalTickets, "Refund Approvals", FilterType.REFUND_APPROVAL)
        );

        const dashboardResponse = {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "User dashboard data retrieved successfully",
            Data: response
        };

        return RESPONSE.SuccessResponse(res, 200, dashboardResponse);

    } catch (error) {
        console.error("User Dashboard Error:", error);

        const errorResponse = {
            Status: ResponseStatus.FAILED,
            StatusCode: 500,
            Message: error instanceof Error ? error.message : "Internal server error",
            Data: []
        };

        return RESPONSE.FailureResponse(res, 500, errorResponse);
    }
};

/**
 * Get detailed ticket breakdown by status for a specific user
 * Alternative implementation that provides more granular control
 */
const getUserTicketsByStatus = async (req: Request, res: Response): Promise<Response> => {
    try {
        if (!req.body?.AssignedPersonID) {
            return RESPONSE.FailureResponse(res, 400, {
                Status: ResponseStatus.FAILED,
                StatusCode: 400,
                Message: "AssignedPersonID is required"
            });
        }

        await connectDB();

        const { AssignedPersonID } = req.body;

        // Get detailed breakdown of tickets by different criteria
        const ticketBreakdown = await RequestModel.aggregate([
            {
                $match: {
                    $or: [
                        { "TicketStatus.AssignedPersonID": AssignedPersonID },
                        { "RaiseComplaint.AssignedPersonID": AssignedPersonID }
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        status: "$RaiseComplaint.Status",
                        assignedVia: {
                            $cond: {
                                if: { $ne: ["$TicketStatus.AssignedPersonID", null] },
                                then: "TicketStatus",
                                else: "RaiseComplaint"
                            }
                        }
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.status": 1 }
            }
        ]);

        const detailedMetrics: UserDashboardMetric[] = ticketBreakdown.map(item => ({
            Type: `${item._id.status} (via ${item._id.assignedVia})`,
            Count: item.count,
            filter: item._id.status?.toLowerCase().replace(/\s+/g, '_') || 'unknown'
        }));

        const dashboardResponse = {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Detailed user ticket breakdown retrieved successfully",
            Data: detailedMetrics
        };

        return RESPONSE.SuccessResponse(res, 200, dashboardResponse);

    } catch (error) {
        console.error("User Tickets By Status Error:", error);

        const errorResponse = {
            Status: ResponseStatus.FAILED,
            StatusCode: 500,
            Message: error instanceof Error ? error.message : "Internal server error",
            Data: []
        };

        return RESPONSE.FailureResponse(res, 500, errorResponse);
    }
};


/**
 * Handles requests to undefined routes.
 * Returns a 404 Not Found response.
 */
const notfound = (req: Request, res: Response) => {
    return RESPONSE.FailureResponse(res, 404, {
        Message: "Not Found",
        StatusCode: 404,
        Status: ResponseStatus.FAILED,
    });
};


export default {
    adminDashboard, revenueDashboard,
    revenueByVendorDashboard,
    userDashboard,
    getUserTicketsByStatus,
    notfound


};