import Joi from "joi";

const getDashboardDataSchema = Joi.object({
    AssignedFranchiseId: Joi.string()
        .required()
        .messages({
            "string.base": "AssignedFranchiseId must be a valid string",
            "string.empty": "AssignedFranchiseId cannot be empty",
            "any.required": "AssignedFranchiseId is required"
        }),

    fromDate: Joi.date()
        .required()
        .messages({
            "date.base": "From date must be a valid date",
            "any.required": "From date is required"
        }),

    toDate: Joi.date()
        .required()
        .messages({
            "date.base": "To date must be a valid date",
            "any.required": "To date is required"
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true); // Allow additional properties for future extensibility

const getDashboardAreaRequestsSchema = Joi.object({
    AssignedFranchiseStateID: Joi.string()
        .required()
        .messages({
            "string.base": "AssignedFranchiseStateID must be a valid string",
            "string.empty": "AssignedFranchiseStateID cannot be empty",
            "any.required": "AssignedFranchiseStateID is required"
        }),

    AssignedFranchiseDistrictID: Joi.string()
        .required()
        .messages({
            "string.base": "AssignedFranchiseDistrictID must be a valid string",
            "string.empty": "AssignedFranchiseDistrictID cannot be empty",
            "any.required": "AssignedFranchiseDistrictID is required"
        }),

    AssignedFranchiseId: Joi.string()
        .required()
        .messages({
            "string.base": "AssignedFranchiseId must be a valid string",
            "string.empty": "AssignedFranchiseId cannot be empty",
            "any.required": "AssignedFranchiseId is required"
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


// Joi Validation Schema
const getDashboardCategorySchema = Joi.object({
    fromDate: Joi.date()
        .required()
        .messages({
            "date.base": "From date must be a valid date",
            "any.required": "From date is required"
        }),

    toDate: Joi.date()
        .required()
        .messages({
            "date.base": "To date must be a valid date",
            "any.required": "To date is required"
        }),

    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),

    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


const getDashboardFranchiseComplaintSchema = Joi.object({
    AssignedFranchiseId: Joi.string()
        .required()
        .messages({
            "string.base": "Assigned Franchise ID must be a string",
            "any.required": "Assigned Franchise ID is required"
        }),
    fromDate: Joi.date()
        .required()
        .messages({
            "date.base": "From date must be a valid date",
            "any.required": "From date is required"
        }),
    toDate: Joi.date()
        .required()
        .messages({
            "date.base": "To date must be a valid date",
            "any.required": "To date is required"
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


const getDashboardFranchiseCountSchema = Joi.object({
    state: Joi.string()
        .required()
        .messages({
            "string.base": "State must be a string",
            "any.required": "State is required"
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


const getDropdownDistrictFranchisersSchema = Joi.object({
    AssignedFranchiseStateID: Joi.string()
        .required()
        .messages({
            "string.base": "Assigned Franchise State ID must be a string",
            "any.required": "Assigned Franchise State ID is required"
        }),
    AssignedFranchiseDistrictID: Joi.string()
        .required()
        .messages({
            "string.base": "Assigned Franchise District ID must be a string",
            "any.required": "Assigned Franchise District ID is required"
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


const getAreaWiseComplaintsCountSchema = Joi.object({
    AssignedFranchiseId: Joi.string()
        .required()
        .messages({
            "string.base": "Assigned Franchise ID must be a string",
            "any.required": "Assigned Franchise ID is required"
        }),
    AssignedFranchiseStateID: Joi.string()
        .required()
        .messages({
            "string.base": "Assigned Franchise State ID must be a string",
            "any.required": "Assigned Franchise State ID is required"
        }),
    AssignedFranchiseDistrictID: Joi.string()
        .required()
        .messages({
            "string.base": "Assigned Franchise District ID must be a string",
            "any.required": "Assigned Franchise District ID is required"
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


const getDepartmentByDeptIDSchema = Joi.object({
    DepartmentID: Joi.string()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.base": "Department ID must be a string",
            "string.pattern.base": "Department ID must be a valid ObjectId",
            "any.required": "Department ID is required"
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


// Joi Validation Schema
const getDepartmentsByOrgIDSchema = Joi.object({
    OrganizationID: Joi.string()
        .required()
        .messages({
            "string.base": "Organization ID must be a string",
            "any.required": "Organization ID is required"
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


// Joi Validation Schema
const getDesignationByDesignationIDSchema = Joi.object({
    DesignationID: Joi.string()
        .required()
        .pattern(/^[0-9a-fA-F]{24}$/)
        .messages({
            "string.base": "Designation ID must be a string",
            "string.pattern.base": "Designation ID must be a valid ObjectId",
            "any.required": "Designation ID is required"
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);


const getDesignationsByDeptSchema = Joi.object({
    DepartmentID: Joi.string()
        .required()
        .messages({
            "string.base": "Department ID must be a string",
            "any.required": "Department ID is required"
        }),
    page: Joi.number()
        .integer()
        .min(1)
        .default(1)
        .messages({
            "number.base": "Page must be a number",
            "number.integer": "Page must be a whole number",
            "number.min": "Page must be at least 1"
        }),
    limit: Joi.number()
        .integer()
        .min(1)
        .max(100)
        .default(10)
        .messages({
            "number.base": "Limit must be a number",
            "number.integer": "Limit must be a whole number",
            "number.min": "Limit must be at least 1",
            "number.max": "Limit cannot exceed 100"
        })
}).unknown(true);

export default {
    getDashboardDataSchema,
    getDashboardCategorySchema,
    getDepartmentsByOrgIDSchema,
    getDepartmentByDeptIDSchema,
    getDashboardAreaRequestsSchema,
    getAreaWiseComplaintsCountSchema,
    getDashboardFranchiseCountSchema,
    getDesignationByDesignationIDSchema,
    getDashboardFranchiseComplaintSchema,
    getDropdownDistrictFranchisersSchema,
    getDesignationsByDeptSchema,
    
}
