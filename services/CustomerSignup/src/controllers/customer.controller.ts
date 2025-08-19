import { Request, Response } from "express";
import { connectDB } from "@gotask/database/src/connection";
import { AAACustomer } from "@gotask/database/src/models/aaacustomers.model";
import { AAAUser } from "@gotask/database/src/models/aaausers.model";
import joiValidation from "../validations/customervalidation";
import { comparePassword, hashPassword } from "../utils/password";
import RESPONSE, { ResponseStatus } from "../utils/response";
import helpers from "../utils/helpers";


/**
 * Handles customer signup.
 * - Validates request body using Joi schema.
 * - Hashes the password before saving.
 * - Creates a new customer record in the database.
 * - Returns a success or failure response.
 */
const customerSignup = async (req: Request, res: Response) => {
    try {
        // connectDB establishes a new database connection if not already connected, 
        await connectDB();

        const { error, value } = joiValidation.signupSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
            return
        }

        const { Password } = value;

        // Hash password before saving
        const hashedPassword = await hashPassword(Password);
        const newCustomer = await AAACustomer.create({
            ...value,
            Password: hashedPassword,
        });

        return RESPONSE.SuccessResponse(res, 201, {
            Status: ResponseStatus.SUCCESS,
            Message: "Signup Successfully",
            data: newCustomer,
            StatusCode: 201,
        });
    } catch (err) {
        return RESPONSE.FailureResponse(res, 400, {
            Message: err instanceof Error ? err.message : "Unknown error",
            StatusCode: 400,
            Status: ResponseStatus.FAILED,
        });
    }
};

/**
 * Handles customer login.
 * - Validates request body using Joi schema.
 * - Checks if the customer exists by email.
 * - Compares the provided password with the stored hashed password.
 * - Returns a success or failure response.
 */
const CustomerCareAdminLogin = async (req: Request, res: Response) => {
    try {
        await connectDB();

        const { Email, Password } = req.body;

        const { error } = joiValidation.loginSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 401, {
                Message: errorMessage,
                StatusCode: 401,
                Status: ResponseStatus.FAILED,
            });
        }
        console.log("Email", Email, "Password", Password);
        // Find user by email
        const customer = await AAACustomer.findOne({ Email });
        console.log("customer", customer)
        if (!customer) {
            return RESPONSE.FailureResponse(res, 404, {
                Message: "Email does not exist",
                StatusCode: 404,
                Status: ResponseStatus.FAILED,
            });
        }

        // Compare password
        const isMatch = await comparePassword(Password, customer.Password);
        if (!isMatch) {
            return RESPONSE.FailureResponse(res, 401, {
                Message: "Invalid password",
                StatusCode: 401,
                Status: ResponseStatus.FAILED,
            });
        }

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            Message: "Login successful",
            data: customer,
            StatusCode: 200,
        });
    } catch (err) {
        return RESPONSE.FailureResponse(res, 500, {
            Message: err instanceof Error ? err.message : "Unknown error",
            StatusCode: 500,
            Status: ResponseStatus.FAILED,
        });
    }
};


/**
 * Handles Customer Care Admin login.
 * - Validates request body using Joi schema.
 * - Checks if the customer exists by email.
 * - Compares the provided password with the stored hashed password.
 * - Returns a success or failure response.
 */
const CustomerCareLogin = async (req: Request, res: Response) => {
    try {
        // Ensure DB connection (reuses existing connection if already open)
        await connectDB();

        const { Email, Password } = req.body;

        // Validate request body
        const { error } = joiValidation.loginSchema.validate(req.body);
        if (error) {
            const errorMessage = error?.message?.replace(/["\\]/g, "");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Find user by email
        const customer = await AAAUser.findOne({ where: { Email } });
        console.log(customer);
        if (!customer) {
            return RESPONSE.FailureResponse(res, 404, {
                Message: "Email does not exist",
                StatusCode: 404,
                Status: ResponseStatus.FAILED,
            });
        }

        // Compare password
        const isMatch = await comparePassword(Password, customer.Password);
        if (!isMatch) {
            return RESPONSE.FailureResponse(res, 401, {
                Message: "Invalid password",
                StatusCode: 401,
                Status: ResponseStatus.FAILED,
            });
        }

        // ✅ Success response
        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            Message: "Login successful",
            data: customer,
            StatusCode: 200,
        });
    } catch (err) {
        return RESPONSE.FailureResponse(res, 500, {
            Message: err instanceof Error ? err.message : "Unknown error",
            StatusCode: 500,
            Status: ResponseStatus.FAILED,
        });
    }
};

/**
 * Handles saving new Customer User data.
 * - Validates the request body.
 * - Generates a random password if not provided.
 * - Hashes password before saving.
 * - Creates a new AAAUser document in MongoDB.
 */
const CustomerSaveUserdata = async (req: Request, res: Response) => {
    try {
        await connectDB();

        // ✅ validate request body
        const { error, value } = joiValidation.saveUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errorMessage = error.details.map(err => err.message.replace(/["\\]/g, "")).join(", ");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // ✅ Generate random password if not provided
        const randomPassword = Math.random().toString(36).slice(-8);
        const rawPassword = value.Password || randomPassword;

        // ✅ Hash password
        const hashedPassword = await hashPassword(rawPassword);

        // ✅ Save user in DB
        const newUser = await AAAUser.create({
            ...value,
            Password: hashedPassword,
            isActive: true,
        });

        return RESPONSE.SuccessResponse(res, 201, {
            Status: ResponseStatus.SUCCESS,
            Message: "User created successfully",
            data: newUser,
            StatusCode: 201,
        });
    } catch (err) {
        return RESPONSE.FailureResponse(res, 500, {
            Message: err instanceof Error ? err.message : "Unknown error",
            StatusCode: 500,
            Status: ResponseStatus.FAILED,
        });
    }
};


/**
 * GET /users
 * Query params supported:
 * - page, limit
 * - sortBy (createdAt|updatedAt|FirstName|LastName|Email|PrimaryMobileNumber|isActive)
 * - sortOrder (asc|desc)
 * - search (matches name, email, mobile - case-insensitive)
 * - isActive (true|false), Gender, RoleID, City, State, District
 * - from, to (createdAt date range)
 * - fields (comma-separated field list to include; Password is always excluded)
 */
const CustomerUsersList = async (req: Request, res: Response) => {
    try {
        // connectDB establishes a new database connection if not already connected, 
        await connectDB();

        // Validate query
        const { error, value } = joiValidation.listQuerySchema.validate(req.query, { abortEarly: false, convert: true });
        if (error) {
            const msg = error.details.map((e) => e.message.replace(/["\\]/g, "")).join(", ");
            return RESPONSE.FailureResponse(res, 400, {
                Message: msg,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Normalized params
        const page = helpers.toInt(value.page, 1);
        const limit = helpers.toInt(value.limit, 10);
        const sortBy = String(value.sortBy);
        const sortOrder = String(value.sortOrder) === "asc" ? 1 : -1;
        const search = value.search ? String(value.search).trim() : "";
        const isActive = typeof value.isActive !== "undefined" ? helpers.toBool(value.isActive) : undefined;
        const gender = value.Gender as string | undefined;
        const roleId = value.RoleID as string | undefined;
        const city = value.City as string | undefined;
        const state = value.State as string | undefined;
        const district = value.District as string | undefined;
        const from = value.from ? helpers.parseDate(value.from) : undefined;
        const to = value.to ? helpers.parseDate(value.to) : undefined;

        // Build filter
        const filter: Record<string, any> = {};

        if (search) {
            const regex = new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
            filter.$or = [
                { FirstName: regex },
                { LastName: regex },
                { Email: regex },
                { PrimaryMobileNumber: regex },
                { SecondaryMobileNumber: regex },
            ];
        }

        if (typeof isActive !== "undefined") filter.isActive = isActive;
        if (gender) filter.Gender = gender;
        if (roleId) filter.RoleID = roleId;
        if (city) filter.City = city;
        if (state) filter.State = state;
        if (district) filter.District = district;

        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = from;
            if (to) filter.createdAt.$lte = to;
        }

        // Projection
        const projection: Record<string, 0 | 1> = { Password: 0 }; // never return password
        if (value.fields) {
            // allow clients to request specific fields, but still exclude Password
            const fields = String(value.fields)
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean);
            if (fields.length > 0) {
                // reset projection then re-apply exclusions
                Object.keys(projection).forEach((k) => delete projection[k]);
                fields.forEach((f) => (projection[f] = 1));
                projection["Password"] = 0;
            }
        }

        // Sorting
        const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder };

        // Pagination
        const skip = (page - 1) * limit;

        // Query (lean for speed)
        const [items, total] = await Promise.all([
            AAAUser.find(filter, projection).sort(sort).skip(skip).limit(limit).lean(),
            AAAUser.countDocuments(filter),
        ]);

        const totalPages = Math.max(1, Math.ceil(total / limit));

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            Message: "Users fetched successfully",
            data: items,
            StatusCode: 200,
            Meta: {
                totalPages,
                currentPage: page
            },
        });
    } catch (err) {
        return RESPONSE.FailureResponse(res, 500, {
            Message: err instanceof Error ? err.message : "Unknown error",
            StatusCode: 500,
            Status: ResponseStatus.FAILED,
        });
    }
};

const getUsersForDept = async (req: Request, res: Response) => {
    try {
        await connectDB();

        const { DepartmenID, page = 1, limit = 10 } = req.body as {
            DepartmenID?: string;
            page?: number;
            limit?: number;
        };

        if (!DepartmenID) {
            return RESPONSE.FailureResponse(res, 400, {
                Message: "Department ID is required",
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Pagination
        const pageNum = Math.max(1, Number(page));
        const limitNum = Math.max(1, Number(limit));
        const skip = (pageNum - 1) * limitNum;

        // Query to fetch Users who are NOT managers
        const query = {
            $and: [
                { DepartmenID },
                { RoleName: "User" },
                { DesignationName: { $not: { $regex: "Manager", $options: "i" } } }
            ]
        };

        // Fetch paginated users
        const [users, totalCount] = await Promise.all([
            await AAAUser.find(query, {
                FirstName: 1,
                LastName: 1,
                Email: 1,
                PrimaryMobileNumber: 1,
                RoleName: 1
            })
                .skip(skip)
                .limit(limitNum)
                .lean(),
            await AAAUser.countDocuments(query)
        ]);

        return RESPONSE.SuccessResponse(res, 200, {
            Message: "Users fetched successfully",
            StatusCode: 200,
            Status: ResponseStatus.SUCCESS,
            data: users,
            Meta: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalCount / limitNum),
            },
        });
    } catch (error) {
        return RESPONSE.FailureResponse(res, 500, {
            Message: "Error fetching users",
            StatusCode: 500,
            Status: ResponseStatus.FAILED,
            error,
        });
    }
};



/**
 * Handles deleting a Customer User.
 * - Validates request params.
 * - Checks if the user exists by ID.
 * - Deletes the user from MongoDB.
 * - Returns a success or failure response.
 */
const deleteCustomerUser = async (req: Request, res: Response) => {
    try {
        // Ensure DB connection
        await connectDB();

        const { id } = req.params;

        if (!id) {
            return RESPONSE.FailureResponse(res, 400, {
                Message: "User ID is required",
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        // Check if user exists
        const user = await AAAUser.findById(id);
        if (!user) {
            return RESPONSE.FailureResponse(res, 404, {
                Message: "User not found",
                StatusCode: 404,
                Status: ResponseStatus.FAILED,
            });
        }

        // Delete user
        await AAAUser.findByIdAndDelete(id);

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "User deleted successfully",
            data: {},
        });
    } catch (err) {
        return RESPONSE.FailureResponse(res, 500, {
            Message: err instanceof Error ? err.message : "Unknown error",
            StatusCode: 500,
            Status: ResponseStatus.FAILED,
        });
    }
};


/**
 * Fetch managers for a given department.
 * - Filters by DepartmentID and DesignationName = "Manager".
 * - Supports field selection (projection).
 * - Returns a clean response.
 */
const getManagerForDept = async (req: Request, res: Response) => {
    try {
        // connectDB establishes a new database connection if not already connected, 
        await connectDB();
        const { error, value } = joiValidation.getManagerForDeptSchema.validate(req.body, { abortEarly: false });

        if (error) {
            return RESPONSE.FailureResponse(res, 400, {
                Message: error.details.map((d) => d.message).join(", "),
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }
        // Build filter
        const filter: Record<string, any> = {
            DepartmenID: value.DepartmenID,
            DesignationName: "Manager",
        };

        // Projection (never return Password)
        const projection: Record<string, 0 | 1> = { Password: 0 };
        if (value.fields) {
            const selectedFields = String(value.fields)
                .split(",")
                .map((f) => f.trim())
                .filter(Boolean);
            if (selectedFields.length > 0) {
                Object.keys(projection).forEach((k) => delete projection[k]);
                selectedFields.forEach((f) => (projection[f] = 1));
                projection["Password"] = 0;
            }
        } else {
            projection.FirstName = 1;
            projection.LastName = 1;
        }

        // Query managers
        const managers = await AAAUser.find(filter, projection).lean();

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            StatusCode: 200,
            Message: "Managers fetched successfully",
            data: managers,
        });
    } catch (err) {
        return RESPONSE.FailureResponse(res, 500, {
            Message: err instanceof Error ? err.message : "Unknown error",
            StatusCode: 500,
            Status: ResponseStatus.FAILED,
        });
    }
};


/**
 * Handles updating an existing customer user.
 * - Validates request body.
 * - Finds user by ID and updates their data.
 * - Returns success or failure response.
 */
const UpdateCustomerUser = async (req: Request, res: Response) => {
    try {
        // Ensure DB connection
        await connectDB();

        // ✅ Validate request body (id + allowed fields)
        const { error, value } = joiValidation.updateUserSchema.validate(req.body, { abortEarly: false, stripUnknown: true });

        if (error) {
            const errorMessage = error.details.map(e => e.message.replace(/["\\]/g, "")).join(", ");
            return RESPONSE.FailureResponse(res, 400, {
                Message: errorMessage,
                StatusCode: 400,
                Status: ResponseStatus.FAILED,
            });
        }

        const { id, ...updateData } = value;

        // ✅ Update user
        const updatedUser = await AAAUser.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return RESPONSE.FailureResponse(res, 404, {
                Message: "User not found",
                StatusCode: 404,
                Status: ResponseStatus.FAILED,
            });
        }

        return RESPONSE.SuccessResponse(res, 200, {
            Status: ResponseStatus.SUCCESS,
            Message: "User updated successfully",
            data: updatedUser,
            StatusCode: 200,
        });
    } catch (err) {
        return RESPONSE.FailureResponse(res, 500, {
            Message: err instanceof Error ? err.message : "Unknown error",
            StatusCode: 500,
            Status: ResponseStatus.FAILED,
        });
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
    notfound,
    deleteCustomerUser,
    CustomerCareLogin,
    CustomerCareAdminLogin,
    CustomerSaveUserdata,
    UpdateCustomerUser,
    CustomerUsersList,
    customerSignup,
    getManagerForDept,
    getUsersForDept
};