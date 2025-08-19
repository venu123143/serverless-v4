import mongoose, { Schema, Document } from "mongoose";

// 🔹 Service Interface & Schema
export interface IService extends Document {
    ServiceID: string;
    ServiceName: string;
    TypeID: string;
    TypeName: string;
    Price: string;
    imageURL: string;
}

const ServiceSchema = new Schema<IService>(
    {
        ServiceID: { type: String },
        ServiceName: { type: String },
        TypeID: { type: String },
        TypeName: { type: String },
        Price: { type: String },
        imageURL: { type: String },
    },
    { _id: false } // disable auto _id for subdocuments
);

// 🔹 Payments Interface & Schema
export interface IPayment extends Document {
    RequestID: string;
    RequestDate: Date;
    Amount: number;
    OrderID: string;
    PaymentDate: Date;
    Note: string;
}

const PaymentSchema = new Schema<IPayment>(
    {
        RequestID: { type: String },
        RequestDate: { type: Date },
        Amount: { type: Number },
        OrderID: { type: String },
        PaymentDate: { type: Date },
        Note: { type: String },
    },
    { _id: false }
);

// 🔹 Transaction Interface & Schema
export interface ITransaction extends Document {
    TransactionID: string;
    Amount: number;
    ModeOfTranscation: string;
    Date: Date;
    Status: string;
    Bank: string;
    Branch: string;
    Ifsc_code: string;
    AccountNumber: string;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        TransactionID: { type: String },
        Amount: { type: Number },
        ModeOfTranscation: { type: String },
        Date: { type: Date },
        Status: { type: String },
        Bank: { type: String },
        Branch: { type: String },
        Ifsc_code: { type: String },
        AccountNumber: { type: String },
    },
    { _id: false }
);

// 🔹 Vendor Interface
export interface IVendor extends Document {
    Aadhar: string;
    Address: string;
    pinCode: number;
    Services: IService[];
    CategoryID: string;
    CategoryName: string;
    CompanyName: string;
    FullName: string;
    Latitude: number;
    Longitude: number;
    PAN: string;
    panPic: string;
    businessPics: { Pic: string }[];
    profilePic: string;
    PrimaryPhoneNumber: string;
    BussinessOpenHours: string;
    BussinessClosingHours: string;
    Percentage: number;
    SecondaryPhoneNumber: string;
    UserId: string;
    CapturedName: string;
    isActive: boolean;
    Pics: string;
    City: string;
    State: string;
    AadharPicFront: string;
    AadharBackPic: string;
    Payments: IPayment[];
    isBankDetailsUpdated: boolean;
    BankName: string;
    Branch: string;
    Ifsccode: string;
    AccountNumber: string;
    contact_id: string;
    fund_id: string;
    PaymentTypeID: string;
    PaymentType: string;
    Transactions: ITransaction[];
    createdAt: Date;
    updatedAt: Date;
}

// 🔹 Vendor Schema
const VendorSchema = new Schema<IVendor>(
    {
        Aadhar: { type: String },
        Address: { type: String },
        pinCode: { type: Number },
        Services: [ServiceSchema],
        CategoryID: { type: String },
        CategoryName: { type: String },
        CompanyName: { type: String },
        FullName: { type: String },
        Latitude: { type: Number },
        Longitude: { type: Number },
        PAN: { type: String },
        panPic: { type: String },
        businessPics: [{ Pic: { type: String } }],
        profilePic: { type: String },
        PrimaryPhoneNumber: { type: String },
        BussinessOpenHours: { type: String },
        BussinessClosingHours: { type: String },
        Percentage: { type: Number },
        SecondaryPhoneNumber: { type: String },
        UserId: { type: String },
        CapturedName: { type: String },
        isActive: { type: Boolean },
        Pics: { type: String },
        City: { type: String },
        State: { type: String },
        AadharPicFront: { type: String },
        AadharBackPic: { type: String },
        Payments: [PaymentSchema],
        isBankDetailsUpdated: { type: Boolean },
        BankName: { type: String },
        Branch: { type: String },
        Ifsccode: { type: String },
        AccountNumber: { type: String },
        contact_id: { type: String },
        fund_id: { type: String },
        PaymentTypeID: { type: String },
        PaymentType: { type: String },
        Transactions: [TransactionSchema],
    },
    {
        timestamps: true, // createdAt & updatedAt
        versionKey: false, // removes __v
    }
);

// 🔹 Export Model
export const Vendor = mongoose.model<IVendor>("vendors", VendorSchema);
