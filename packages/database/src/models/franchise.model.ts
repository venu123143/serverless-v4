import mongoose, { Schema, Document } from "mongoose";

// ---------------- Sub-interfaces ----------------

interface IEmployeeCategory {
    CategoryId: string;
    CategoryName: string;
}

interface IEmployee {
    EmployeeName: string;
    Age: string;
    DOB: string;
    Gender: string;
    EmployeeContactNumber: number;
    EmployeePassword: string;
    EmployeeSecondaryMobileNumber: number;
    AvatarImage: string;
    Address: string;
    AddressOne: string;
    City: string;
    State: string;
    District: string;
    Town: string;
    PinCode: number;
    isActive: string;
    RegisteredDate: Date;
    Experience: number;
    CategoryId: string;
    CategoryName: string;
    Categories: IEmployeeCategory[];
    AadharNumber: string;
    PanNUmber: string;
    AadharPics: {
        Front: string;
        Back: string;
    };
    PanPics: {
        Front: string;
    };
    DrivingLicencepics: {
        Front: string;
        Back: string;
    };
    Status: string;
}

interface IAccountDetail {
    BankName: string;
    AccountNumber: string;
    confirmAccountNumber: string;
    IFSC: string;
    isPrimary: boolean;
    AccountVerified: boolean;
}

interface IFeedback {
    CustomerID: string;
    CustomerName: string;
    FeebackPoints: number;
    Date: Date;
    RequestId: string;
    EmployeeID: string;
    EmployeeName: string;
}

interface IRating {
    Rating: number;
    GivenBy: string;
    MobileNumber: number;
}

interface ITransaction {
    TransactionID: string;
    TransactionAmount: number;
    TransactionDate: Date;
    TransactionType: string;
    RequestID: string;
    CategoryID: string;
    CategoryName: string;
    TransactionStatus: string;
}

interface IFranchiseSettlement {
    TransactionID: string;
    TransactionAmount: number;
    TransactionDate: Date;
    TransactionMonth: string;
    TransactionType: string;
    TransactionBank: string;
    TransactionBranch: string;
    TransactionIFSCCODE: string;
    TransactionAccountNumber: string;
    TransactionDoneBy: string;
    TransactionUPINo: string;
    TransactionStatus: string;
}

interface IPinCode {
    Area: string;
    Pincode: number;
}

interface ICategoryService {
    ServiceID: string;
    ServiceName: string;
    TabURL: string;
    isActive: boolean;
    ServiceDeActive: boolean;
}

// ---------------- Main Franchise Interface ----------------

export interface IFranchise extends Document {
    FranchiseOwnerName: string;
    FranchiseName: string;
    PrimaryNumber: string;
    SecondaryNumber: string;
    AvatarImage: string;
    Gender: string;
    DOB: string;
    Age: string;
    AadharNumber: string;
    FranchiseAadharPicsFront: string;
    FranchiseAadharPicsBack: string;
    FranchisePanPicsFront: string;
    StoreLocation: {
        type: string;
        coordinates: number[];
    };
    StoreAddress: string;
    StoreAdressOne: string;
    StoreLatitude: number;
    StoreLongitude: number;
    FranchiseCode: string;
    isActive: boolean;
    DistrictID: string;
    District: string;
    Town: string;
    StateID: string;
    State: string;
    Area: string;
    Pin: number;
    Balance: number;
    isProfileUpdated: boolean;
    FranchiseMapPic: string;
    MapLink: string;
    FranchiseShare: number;
    AAADUTYShare: number;
    EmployeeData: IEmployee[];
    AccountDetails: IAccountDetail[];
    RazorPaycontact_id: string;
    RazorPayfund_account_id: string;
    Email: string;
    FeedBacks: IFeedback[];
    Rating: IRating[];
    Transactions: ITransaction[];
    FranchiseSettlement: IFranchiseSettlement[];
    PinCodes: IPinCode[];
    CategoryServices: ICategoryService[];
}

// ---------------- Sub-schemas ----------------

const EmployeeCategorySchema = new Schema<IEmployeeCategory>({
    CategoryId: { type: String },
    CategoryName: { type: String },
});

const EmployeeSchema = new Schema<IEmployee>({
    EmployeeName: { type: String },
    Age: { type: String },
    DOB: { type: String },
    Gender: { type: String },
    EmployeeContactNumber: { type: Number },
    EmployeePassword: { type: String },
    EmployeeSecondaryMobileNumber: { type: Number },
    AvatarImage: { type: String },
    Address: { type: String },
    AddressOne: { type: String },
    City: { type: String },
    State: { type: String },
    District: { type: String },
    Town: { type: String },
    PinCode: { type: Number },
    isActive: { type: String },
    RegisteredDate: { type: Date },
    Experience: { type: Number },
    CategoryId: { type: String },
    CategoryName: { type: String },
    Categories: [EmployeeCategorySchema],
    AadharNumber: { type: String },
    PanNUmber: { type: String },
    AadharPics: {
        Front: { type: String },
        Back: { type: String },
    },
    PanPics: {
        Front: { type: String },
    },
    DrivingLicencepics: {
        Front: { type: String },
        Back: { type: String },
    },
    Status: { type: String },
});

const AccountDetailSchema = new Schema<IAccountDetail>({
    BankName: { type: String },
    AccountNumber: { type: String },
    confirmAccountNumber: { type: String },
    IFSC: { type: String },
    isPrimary: { type: Boolean },
    AccountVerified: { type: Boolean },
});

const FeedbackSchema = new Schema<IFeedback>({
    CustomerID: { type: String },
    CustomerName: { type: String },
    FeebackPoints: { type: Number },
    Date: { type: Date },
    RequestId: { type: String },
    EmployeeID: { type: String },
    EmployeeName: { type: String },
});

const RatingSchema = new Schema<IRating>({
    Rating: { type: Number },
    GivenBy: { type: String },
    MobileNumber: { type: Number },
});

const TransactionSchema = new Schema<ITransaction>({
    TransactionID: { type: String },
    TransactionAmount: { type: Number },
    TransactionDate: { type: Date },
    TransactionType: { type: String },
    RequestID: { type: String },
    CategoryID: { type: String },
    CategoryName: { type: String },
    TransactionStatus: { type: String },
});

const FranchiseSettlementSchema = new Schema<IFranchiseSettlement>({
    TransactionID: { type: String },
    TransactionAmount: { type: Number },
    TransactionDate: { type: Date },
    TransactionMonth: { type: String },
    TransactionType: { type: String },
    TransactionBank: { type: String },
    TransactionBranch: { type: String },
    TransactionIFSCCODE: { type: String },
    TransactionAccountNumber: { type: String },
    TransactionDoneBy: { type: String },
    TransactionUPINo: { type: String },
    TransactionStatus: { type: String },
});

const PinCodeSchema = new Schema<IPinCode>({
    Area: { type: String },
    Pincode: { type: Number },
});

const CategoryServiceSchema = new Schema<ICategoryService>({
    ServiceID: { type: String },
    ServiceName: { type: String },
    TabURL: { type: String },
    isActive: { type: Boolean },
    ServiceDeActive: { type: Boolean },
});

// ---------------- Main Franchise Schema ----------------

const FranchiseSchema = new Schema<IFranchise>(
    {
        FranchiseOwnerName: { type: String },
        FranchiseName: { type: String },
        PrimaryNumber: { type: String },
        SecondaryNumber: { type: String },
        AvatarImage: { type: String },
        Gender: { type: String },
        DOB: { type: String },
        Age: { type: String },
        AadharNumber: { type: String },
        FranchiseAadharPicsFront: { type: String },
        FranchiseAadharPicsBack: { type: String },
        FranchisePanPicsFront: { type: String },
        StoreLocation: {
            type: { type: String },
            coordinates: { type: [Number], index: "2dsphere" },
        },
        StoreAddress: { type: String },
        StoreAdressOne: { type: String },
        StoreLatitude: { type: Number },
        StoreLongitude: { type: Number },
        FranchiseCode: { type: String },
        isActive: { type: Boolean, default: true },
        DistrictID: { type: String },
        District: { type: String },
        Town: { type: String },
        StateID: { type: String },
        State: { type: String },
        Area: { type: String },
        Pin: { type: Number },
        Balance: { type: Number, default: 0 },
        isProfileUpdated: { type: Boolean, default: false },
        FranchiseMapPic: { type: String },
        MapLink: { type: String },
        FranchiseShare: { type: Number },
        AAADUTYShare: { type: Number },
        EmployeeData: [EmployeeSchema],
        AccountDetails: [AccountDetailSchema],
        RazorPaycontact_id: { type: String },
        RazorPayfund_account_id: { type: String },
        Email: { type: String },
        FeedBacks: [FeedbackSchema],
        Rating: [RatingSchema],
        Transactions: [TransactionSchema],
        FranchiseSettlement: [FranchiseSettlementSchema],
        PinCodes: [PinCodeSchema],
        CategoryServices: [CategoryServiceSchema],
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ---------------- Model Export ----------------

export const Franchise = mongoose.model<IFranchise>("franchises", FranchiseSchema);
