import { DashboardMetric, AggregationResult, RevenueAggregationResult, RevenueMetric, UserDashboardMetric, TicketAggregationResult } from "../types/admin.types";


/**
 * Helper function to create a dashboard metric
 */
const createMetric = (label: string, value: number): DashboardMetric => ({
    label,
    value
});

/**
 * Helper function to process aggregation results
 */
const processAggregationResult = (data: AggregationResult[], defaultLabel: string): DashboardMetric => {
    if (data.length > 0) {
        return createMetric(data[0]._id, data[0].count);
    }
    return createMetric(defaultLabel, 0);
};

/**
 * Get today's date range (start and end of day)
 */
const getTodayDateRange = (): { startDate: Date; endDate: Date } => {
    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1);

    return { startDate, endDate };
};


/**
 * Helper function to create a revenue metric
 */
const createRevenueMetric = (label: string, count: number, totalIncome: number): RevenueMetric => ({
    label,
    value1: count,
    value2: totalIncome
});


/**
 * Helper function to process revenue aggregation results
 */
const processRevenueAggregationResult = (data: RevenueAggregationResult[], defaultLabel: string): RevenueMetric => {
    if (data.length > 0) {
        const result = data[0];
        const label = typeof result._id === "string" ? result._id : defaultLabel;
        return createRevenueMetric(label, result.count, result.Totalincome);
    }
    return createRevenueMetric(defaultLabel, 0, 0);
};



/**
 * Helper function to create a user dashboard metric
 */
const createUserMetric = (type: string, count: number, filter: string): UserDashboardMetric => ({
    Type: type,
    Count: count,
    filter: filter
});

/**
 * Helper function to process ticket aggregation results
 */
const processTicketAggregationResult = (data: TicketAggregationResult[], defaultType: string, filter: string): UserDashboardMetric => {
    if (data.length > 0) {
        return createUserMetric(data[0]._id, data[0].count, filter);
    }
    return createUserMetric(defaultType, 0, filter);
};


export default {
    createMetric,
    processAggregationResult,
    getTodayDateRange,
    createRevenueMetric,
    createUserMetric,
    processRevenueAggregationResult,
    processTicketAggregationResult
}