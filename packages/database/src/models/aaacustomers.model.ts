import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the AAACustomer document
interface IAAACustomer extends Document {
    Name: string;
    Password: string;
    MobileNumber: string;
    Gender: string;
    Email: string;
    isProfileUpdated: boolean;
    Address: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Create the schema
const AAACustomerSchema = new Schema<IAAACustomer>({
    Name: {
        type: String,
    },
    Password: {
        type: String,
    },
    MobileNumber: {
        type: String,
    },
    Gender: {
        type: String,
    },
    Email: {
        type: String,
    },
    isProfileUpdated: {
        type: Boolean,
        default: false,
    },
    Address: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true, // adds createdAt and updatedAt
    versionKey: false, // removes __v
});

// Create and export the model
export const AAACustomer = mongoose.model<IAAACustomer>('aaacustomers', AAACustomerSchema);
