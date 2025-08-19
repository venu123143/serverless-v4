import Joi from "joi";

const loginSchema = Joi.object({
    Email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a valid string",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required"
        }),

    Password: Joi.string()
        // .min(6)
        .max(20)
        .required()
        .messages({
            "string.base": "Password must be a valid string",
            // "string.min": "Password must be at least 6 characters long",
            "string.max": "Password cannot exceed 20 characters",
            "any.required": "Password is required"
        }),
});

const signupSchema = Joi.object({
    Name: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.base": "Name must be a valid string",
            "string.empty": "Name cannot be empty",
            "string.min": "Name must be at least 2 characters long",
            "string.max": "Name cannot exceed 50 characters",
            "any.required": "Name is required"
        }),

    Password: Joi.string()
        .min(6)
        .max(20)
        .required()
        .messages({
            "string.base": "Password must be a valid string",
            "string.empty": "Password cannot be empty",
            "string.min": "Password must be at least 6 characters long",
            "string.max": "Password cannot exceed 20 characters",
            "any.required": "Password is required"
        }),

    MobileNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
            "string.base": "Mobile number must be a valid string of digits",
            "string.empty": "Mobile number cannot be empty",
            "string.pattern.base": "Mobile number must be between 10 to 15 digits",
            "any.required": "Mobile number is required"
        }),

    Gender: Joi.string()
        .valid("Male", "Female", "Other")
        .required()
        .messages({
            "string.base": "Gender must be a valid string",
            "any.only": "Gender must be one of Male, Female, or Other",
            "any.required": "Gender is required"
        }),

    Email: Joi.string()
        .email()
        .required()
        .messages({
            "string.base": "Email must be a valid string",
            "string.email": "Please provide a valid email address",
            "any.required": "Email is required"
        }),


    Address: Joi.string()
        .max(200)
        .allow("", null) // optional
        .messages({
            "string.base": "Address must be a valid string",
            "string.max": "Address cannot exceed 200 characters"
        }),

});

const saveUserSchema = Joi.object({
    FirstName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Please enter your first name",
            "string.min": "First name should have at least 2 letters",
            "string.max": "First name can’t be longer than 50 letters",
            "any.required": "First name is required",
        }),

    LastName: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "Please enter your last name",
            "string.min": "Last name should have at least 2 letters",
            "string.max": "Last name can’t be longer than 50 letters",
            "any.required": "Last name is required",
        }),

    PrimaryMobileNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .required()
        .messages({
            "string.empty": "Please enter your mobile number",
            "string.pattern.base": "Mobile number should be between 10 and 15 digits",
            "any.required": "Primary mobile number is required",
        }),

    SecondaryMobileNumber: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .optional()
        .allow("", null)
        .messages({
            "string.pattern.base": "Secondary mobile number should be between 10 and 15 digits",
        }),

    Gender: Joi.string()
        .valid("Male", "Female", "Other")
        .required()
        .messages({
            "any.only": "Please select Male, Female, or Other",
            "any.required": "Gender is required",
        }),

    Email: Joi.string()
        .email()
        .required()
        .messages({
            "string.empty": "Please enter your email address",
            "string.email": "That doesn’t look like a valid email address",
            "any.required": "Email is required",
        }),

    AddressOne: Joi.string()
        .max(200)
        .allow("", null)
        .messages({
            "string.max": "Address line 1 can’t be longer than 200 characters",
        }),

    AddressTwo: Joi.string()
        .max(200)
        .allow("", null)
        .messages({
            "string.max": "Address line 2 can’t be longer than 200 characters",
        }),

    City: Joi.string()
        .max(100)
        .allow("", null)
        .messages({
            "string.max": "City name can’t be longer than 100 characters",
        }),

    State: Joi.string()
        .max(100)
        .allow("", null)
        .messages({
            "string.max": "State name can’t be longer than 100 characters",
        }),

    District: Joi.string()
        .max(100)
        .allow("", null)
        .messages({
            "string.max": "District name can’t be longer than 100 characters",
        }),
});

const listQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1).messages({
        "number.base": "Page must be a number",
        "number.min": "Page must be at least 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
        "number.base": "Limit must be a number",
        "number.min": "Limit must be at least 1",
        "number.max": "Limit can’t be more than 100",
    }),
    sortBy: Joi.string()
        .valid(
            "createdAt",
            "updatedAt",
            "FirstName",
            "LastName",
            "Email",
            "PrimaryMobileNumber",
            "isActive"
        )
        .default("createdAt")
        .messages({
            "any.only": "Invalid sort field",
        }),
    sortOrder: Joi.string().valid("asc", "desc").default("desc").messages({
        "any.only": "Sort order must be 'asc' or 'desc'",
    }),

    // Search across common fields
    search: Joi.string().allow("", null),

    // Filters
    isActive: Joi.boolean().optional(),
    Gender: Joi.string().valid("Male", "Female", "Other").optional(),
    RoleID: Joi.string().optional(),
    City: Joi.string().optional(),
    State: Joi.string().optional(),
    District: Joi.string().optional(),

    // Date range on createdAt
    from: Joi.date().optional().messages({
        "date.base": "From date is not valid",
    }),
    to: Joi.date().optional().messages({
        "date.base": "To date is not valid",
    }),

    // Field selection (comma-separated)
    fields: Joi.string().optional(),
}).unknown(true); // allow future-safe params


const getManagerForDeptSchema = Joi.object({
    DepartmenID: Joi.string()
        .required()
        .messages({
            "any.required": "Department ID is required",
            "string.base": "Department ID must be a string",
            "string.empty": "Department ID cannot be empty",
        }),

    fields: Joi.string()
        .optional()
        .messages({
            "string.base": "Fields must be a string",
        }),
});


const updateUserSchema = Joi.object({
    id: Joi.string().required().messages({
        "any.required": "User ID is required",
        "string.base": "User ID must be a string"
    }),
    FirstName: Joi.string().optional(),
    LastName: Joi.string().optional(),
    Email: Joi.string().email().optional(),
    PrimaryMobileNumber: Joi.string().optional(),
    SecondaryMobileNumber: Joi.string().optional(),
    Gender: Joi.string().valid("Male", "Female", "Other").optional(),
    DOB: Joi.string().optional(),
    DOJ: Joi.string().optional(),
    AddressOne: Joi.string().optional(),
    AddressTwo: Joi.string().optional(),
    City: Joi.string().optional(),
    StateID: Joi.string().optional(),
    State: Joi.string().optional(),
    DistrictID: Joi.string().optional(),
    District: Joi.string().optional(),
    ReportingManagerID: Joi.string().optional(),
    ReportingManagerName: Joi.string().optional(),
    RoleID: Joi.string().optional(),
    RoleName: Joi.string().optional(),
    isActive: Joi.boolean().optional(),
});


export default {
    loginSchema,
    signupSchema,
    saveUserSchema,
    listQuerySchema,
    updateUserSchema,
    getManagerForDeptSchema
}