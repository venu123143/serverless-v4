import mongoose, { Schema, Document } from "mongoose";

// 🔹 AAADepartment Interface & Schema
export interface IAAADepartment extends Document {
    OrganizationID: string;
    OrganizationName: string;
    DepartmentName: string;
    isActive: boolean;
}

const AAADepartmentsSchema = new Schema<IAAADepartment>(
    {
        OrganizationID: { type: String },
        OrganizationName: { type: String },
        DepartmentName: { type: String },
        isActive: { type: Boolean },
    }
);

// 🔹 Export Model
export const AAADepartment = mongoose.model<IAAADepartment>("aaadepartments", AAADepartmentsSchema);