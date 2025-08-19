


export interface DashboardMetric {
    label: string;
    value: number;
}


// Types for MongoDB aggregation results
export interface AggregationResult {
    _id: string;
    count: number;
}

// Enum for payment statuses
export enum PaymentStatus {
    SUCCESS = "Success",
    FAILED = "Failed"
}

// Enum for vendor categories
export enum VendorCategory {
    CAR_WASH = "CarWash",
    TOWING = "Towing"
}

// Enum for job roles
export enum JobRole {
    PERMANENT = "Permanent",
    CONTRACT_BASED = "Contract Based"
}



// Types for revenue dashboard data
export interface RevenueMetric {
    label: string;
    value1: number; // count
    value2: number; // total income
}

export interface RevenueDashboardResponse {
    Status: string;
    StatusCode: number;
    Message: string;
    data: RevenueMetric[];
}

// Types for MongoDB aggregation results with revenue data
export interface RevenueAggregationResult {
    _id: string | { "Vendor Name": string };
    count: number;
    Totalincome: number;
}




// Types for user dashboard data
export interface UserDashboardMetric {
    Type: string;
    Count: number;
    filter: string;
}

export interface UserDashboardResponse {
    Status: string;
    StatusCode: number;
    Message?: string;
    Data: UserDashboardMetric[];
}

// Types for MongoDB aggregation results
export interface TicketAggregationResult {
    _id: string;
    count: number;
}


// Enum for ticket statuses
export enum TicketStatus {
    OPEN = "Open",
    CLOSED = "Closed",
    WAITING_FOR_APPROVAL = "Waiting For Approval",
    REFUND_APPROVALS = "Refund Approvals"
}

// Enum for filter types
export enum FilterType {
    ALL_TICKETS = "all_tickets",
    OPEN = "open",
    WAITING_FOR_APPROVAL = "waiting_for_approval",
    CLOSED = "closed",
    CLOSE = "close", // Note: Original code had inconsistency between "closed" and "close"
    REFUND_APPROVAL = "refund_approval"
}
