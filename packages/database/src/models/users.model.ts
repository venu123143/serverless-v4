import mongoose, { Schema, Document } from "mongoose";

// ---------------- Sub-interfaces ----------------

interface IAddress {
    addressType: string;
    Latitude: number;
    Longitude: number;
    Address: string;
}

interface IEmergencyContact {
    Number: number;
}

interface IAccountDetail {
    BankName: string;
    AccountNumber: string;
    IFSC: string;
    isPrimary: boolean;
    AccountVerified: boolean;
}

interface ITransaction {
    TransactionID: string;
    TransactionAmount: number;
    TransactionDate: Date;
    TransactionType: string;
    RequestID: string;
    CategoryID: string;
    CategoryName: string;
}

// ---------------- Main User interface ----------------

export interface IUser extends Document {
    CustomerName: string;
    MobileNumber: string;
    Gender: string;
    Email: string;
    isProfileUpdated: boolean;
    DOB: string;
    Address: IAddress[];
    isActive: boolean;
    Avatar: string;
    EmergencyContacts: IEmergencyContact[];
    Balance: number;
    AccountDetails: IAccountDetail[];
    Transactions: ITransaction[];
}

// ---------------- Sub-schemas ----------------

const AddressSchema = new Schema<IAddress>({
    addressType: { type: String },
    Latitude: { type: Number },
    Longitude: { type: Number },
    Address: { type: String },
});

const EmergencyContactSchema = new Schema<IEmergencyContact>({
    Number: { type: Number },
});

const AccountDetailSchema = new Schema<IAccountDetail>({
    BankName: { type: String },
    AccountNumber: { type: String },
    IFSC: { type: String },
    isPrimary: { type: Boolean },
    AccountVerified: { type: Boolean },
});

const TransactionSchema = new Schema<ITransaction>({
    TransactionID: { type: String },
    TransactionAmount: { type: Number },
    TransactionDate: { type: Date },
    TransactionType: { type: String },
    RequestID: { type: String },
    CategoryID: { type: String },
    CategoryName: { type: String },
});

// ---------------- Main User Schema ----------------

const UserSchema = new Schema<IUser>(
    {
        CustomerName: { type: String },
        MobileNumber: { type: String },
        Gender: { type: String },
        Email: { type: String },
        isProfileUpdated: { type: Boolean, default: false },
        DOB: { type: String },
        Address: [AddressSchema],
        isActive: { type: Boolean, default: true },
        Avatar: { type: String },
        EmergencyContacts: [EmergencyContactSchema],
        Balance: { type: Number, default: 0 },
        AccountDetails: [AccountDetailSchema],
        Transactions: [TransactionSchema],
    },
    {
        timestamps: true, // adds createdAt and updatedAt
        versionKey: false, // removes __v
    }
);

// ---------------- Model Export ----------------

export const User = mongoose.model<IUser>("users", UserSchema);
