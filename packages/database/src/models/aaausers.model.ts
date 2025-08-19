import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the AAADUser document
interface IAAAUser extends Document {
    OrganizationID: string;
    OrganizationName: string;
    DepartmentID: string;
    DepartmentName: string;
    DesignationID: string;
    DesignationName: string;
    TeamDetails: {
        TeamID: string;
        TeamName: string;
    }[];
    FirstName: string;
    LastName: string;
    PrimaryMobileNumber: string;
    SecondaryMobileNumber: string;
    Gender: string;
    Email: string;
    DOB: string;
    DOJ: string;
    AddressOne: string;
    AddressTwo: string;
    City: string;
    StateID: string;
    State: string;
    DistrictID: string;
    District: string;
    ReportingManagerID: string;
    ReportingManagerName: string;
    ProfilePic: string;
    AdharNumber: string;
    PanNumber: string;
    EmergencyContactNumber: number;
    EmergencyContactPersonName: string;
    RoleID: string;
    RoleName: string;
    Password: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Create the schema
const AAADUserSchema = new Schema<IAAAUser>({
    OrganizationID: {
        type: String,
    },
    OrganizationName: {
        type: String,
    },
    DepartmentID: {
        type: String,
    },
    DepartmentName: {
        type: String,
    },
    DesignationID: {
        type: String,
    },
    DesignationName: {
        type: String,
    },
    TeamDetails: [
        {
            TeamID: {
                type: String,
            },
            TeamName: {
                type: String,
            },
        },
    ],
    FirstName: {
        type: String,
    },
    LastName: {
        type: String,
    },
    PrimaryMobileNumber: {
        type: String,
    },
    SecondaryMobileNumber: {
        type: String,
    },
    Gender: {
        type: String,
    },
    Email: {
        type: String,
    },
    DOB: {
        type: String,
    },
    DOJ: {
        type: String,
    },
    AddressOne: {
        type: String,
    },
    AddressTwo: {
        type: String,
    },
    City: {
        type: String,
    },
    StateID: {
        type: String,
    },
    State: {
        type: String,
    },
    DistrictID: {
        type: String,
    },
    District: {
        type: String,
    },
    ReportingManagerID: {
        type: String,
    },
    ReportingManagerName: {
        type: String,
    },
    ProfilePic: {
        type: String,
    },
    AdharNumber: {
        type: String,
    },
    PanNumber: {
        type: String,
    },
    EmergencyContactNumber: {
        type: Number,
    },
    EmergencyContactPersonName: {
        type: String,
    },
    RoleID: {
        type: String,
    },
    RoleName: {
        type: String,
    },
    Password: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false, // removes __v field from the schema
});

// Create and export the model
export const AAAUser = mongoose.model<IAAAUser>('aaausers', AAADUserSchema);
