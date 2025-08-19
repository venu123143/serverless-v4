import mongoose, { Schema, Document } from "mongoose";

// 🔹 AAADesignation Interface & Schema
export interface IAAADesignation extends Document {
    OrganizationID: string;
    OrganizationName: string;
    DepartmenID: string;
    DepartmentName: string;
    DesignationName: string;
    isActive: boolean;
}

const AAADesignationSchema = new Schema<IAAADesignation>(
    {
        OrganizationID: { type: String },
        OrganizationName: { type: String },
        DepartmenID: { type: String },
        DepartmentName: { type: String },
        DesignationName: { type: String },
        isActive: { type: Boolean },
    }
);

// 🔹 Export Model
export const AAADesignation = mongoose.model<IAAADesignation>("designations", AAADesignationSchema);