import mongoose, { Schema, Document } from "mongoose";

// 🔹 Interfaces for nested objects
interface ILocation {
    type: string;
    coordinates: number[];
}

interface IService {
    TypeID: string;
    TypeName: string;
    CategoryID: string;
    CategoryName: string;
    SubCategoryID: string;
    SubCategoryName: string;
    Price: number;
    ComplaintID: string;
    Complaint: string;
    NoOfCount: string;
    isActive: string;
}

interface IProblem {
    CategoryID: string;
    CategoryName: string;
    TypeID: string;
    TypeName: string;
    ServiceId: string;
    ServiceName: string;
    ProblemsId: string;
    ProblemsType: string;
}

interface ISlot {
    SlotId: string;
    StartTime: string;
    EndTime: string;
    Start: number;
    End: number;
}

interface IStatusTracking {
    CurrentStatus: string;
    DateTime: Date;
    Note: string;
    NotificationType: string;
    isActive: boolean;
}

interface IPhoto {
    Pics: string;
}

interface IWoozInstruction {
    People: string;
}

interface IRaiseComplaint {
    ReasonType: string;
    ReasonTypeID: string;
    ComplaintRaisedPersonID: string;
    ComplaintRaisedPersonName: string;
    ShortDesc: string;
    Status: string;
    RaisedDate: Date;
    CurrentDate: Date;
    AssignedPersonID: string;
    AssignedPersonName: string;
    AssignedDeptName: string;
    AssignedDeptID: string;
    TicketID: string;
}

interface ITicketStatus {
    AssignedPersonID: string;
    AssignedPersonName: string;
    AssignedDeptName: string;
    AssignedDeptID: string;
    AssignedDate: Date;
    Comment: string;
    CommentedDate: Date;
    Status: string;
}

interface IAssignedTechnician {
    TechinicianID: string;
    TechinicianName: string;
}

// 🔹 Main Request Interface
export interface IRequest extends Document {
    CustomerID: string;
    CustomerName: string;
    CustomerPhoneNumber: string;
    TicketID: string;
    SourceAddress: string;
    SourceLocation: ILocation;
    SourctLat: number;
    SourceLong: number;
    DestinationLat: number;
    DestinationLong: number;
    DesinationAddress: string;
    DestinationLocation: ILocation;
    CarPickupLocationAddress: string;
    CarPickupLat: number;
    CarPickupLong: number;
    CarPickupLocation: ILocation;
    CarDeliveryLocationAddress: string;
    CarDeliveryLat: number;
    CarDeliveryLong: number;
    CarDeliveryLocation: ILocation;
    Distance: number;
    ServiceTax: number;
    GST: number;
    AddTip: number;
    Price: number;
    TotalAmount: number;
    Balance: number;
    Note: string;
    CategoryID: string;
    ServiceImageURL: string;
    RequestImageURL: string;
    TotalSFT: number;
    CategoryName: string;
    CategoryImage: string;
    VendorID: string;
    VenodrName: string;
    VendorPhoneNumber: string;
    VendorAddress: string;
    VendorLat: number;
    VendorLong: number;
    VendorLocation: ILocation;
    Services: IService[];
    Problems: IProblem[];
    typeID: string;
    typeName: string;
    Slot: ISlot;
    VendorSlotID: string;
    AssignedFranchiseId: string;
    AssignedFranchiseName: string;
    AssignedFranchsiePhoneNumber: string;
    AssignedFranchiseAddress: string;
    AssignedFranchiseLocation: ILocation;
    AssignedFranchiseStateID: string;
    AssignedFranchiseState: string;
    AssignedFranchiseDistrictID: string;
    AssignedFranchiseDistrictName: string;
    AssignedFranchiseStoreAddress: string;
    AssignedFranchiseArea: string;
    AssignedFranchisePinCode: string;
    AssignedFranchiseCode: string;
    RaisedComplaint: boolean;
    Date: Date;
    PaymentStatus: string;
    AssignedTechinicianID: string;
    AssignedTechnicianName: string;
    AssignedTechnicianPhoneNumber: number;
    AssignedTechnicianAvatar: string;
    AssignedFranchiseComments: string;
    StatusTracking: IStatusTracking[];
    FranchiseNote: string;
    RequestStatus: string;
    OrderID: string;
    BeforePics: IPhoto[];
    AfterPics: IPhoto[];
    NotificationStatus: string;
    TechnicianRating: number;
    CancelReason: string;
    otherCancelComments: string;
    CarWashRequestStatus: string;
    PaidToVendor: number;
    WooZServiceID: string;
    WooZService: string;
    TotalKm: number;
    WooZComplaintID: string;
    WooZComplaintName: string;
    WoozInstructions: IWoozInstruction[];
    WaitingPeriodTime: number;
    VehicleTypeID: string;
    VehicleTypeName: string;
    BrandID: string;
    BrandName: string;
    VehicleName: string;
    Problem: string;
    RaiseComplaint: IRaiseComplaint;
    TicketStatus: ITicketStatus[];
    RequestForTommorow: boolean;
    RequestType: string;
    companyTypeID: string;
    companyType: string;
    companyID: string;
    companyName: string;
    companyMobileNumber: string;
    companyAddress: string;
    companyAddressLocation: string;
    AssignedTechinicians: IAssignedTechnician[];
    RequestFrom: string;
    createdAt: Date;
    updatedAt: Date;
}

// 🔹 Sub-schemas
const LocationSchema = new Schema<ILocation>(
    {
        type: { type: String },
        coordinates: { type: [Number], index: "2dsphere" },
    },
    { _id: false }
);

const ServiceSchema = new Schema<IService>(
    {
        TypeID: String,
        TypeName: String,
        CategoryID: String,
        CategoryName: String,
        SubCategoryID: String,
        SubCategoryName: String,
        Price: Number,
        ComplaintID: String,
        Complaint: String,
        NoOfCount: String,
        isActive: String,
    },
    { _id: false }
);

const ProblemSchema = new Schema<IProblem>(
    {
        CategoryID: String,
        CategoryName: String,
        TypeID: String,
        TypeName: String,
        ServiceId: String,
        ServiceName: String,
        ProblemsId: String,
        ProblemsType: String,
    },
    { _id: false }
);

const SlotSchema = new Schema<ISlot>(
    {
        SlotId: String,
        StartTime: String,
        EndTime: String,
        Start: Number,
        End: Number,
    },
    { _id: false }
);

const StatusTrackingSchema = new Schema<IStatusTracking>(
    {
        CurrentStatus: String,
        DateTime: Date,
        Note: String,
        NotificationType: String,
        isActive: { type: Boolean, default: false },
    },
    { _id: false }
);

const PhotoSchema = new Schema<IPhoto>(
    { Pics: String },
    { _id: false }
);

const WoozInstructionSchema = new Schema<IWoozInstruction>(
    { People: String },
    { _id: false }
);

const RaiseComplaintSchema = new Schema<IRaiseComplaint>(
    {
        ReasonType: String,
        ReasonTypeID: String,
        ComplaintRaisedPersonID: String,
        ComplaintRaisedPersonName: String,
        ShortDesc: String,
        Status: String,
        RaisedDate: Date,
        CurrentDate: Date,
        AssignedPersonID: String,
        AssignedPersonName: String,
        AssignedDeptName: String,
        AssignedDeptID: String,
        TicketID: String,
    },
    { _id: false }
);

const TicketStatusSchema = new Schema<ITicketStatus>(
    {
        AssignedPersonID: String,
        AssignedPersonName: String,
        AssignedDeptName: String,
        AssignedDeptID: String,
        AssignedDate: Date,
        Comment: String,
        CommentedDate: Date,
        Status: String,
    },
    { _id: false }
);

const AssignedTechnicianSchema = new Schema<IAssignedTechnician>(
    {
        TechinicianID: String,
        TechinicianName: String,
    },
    { _id: false }
);

// 🔹 Main Request Schema
const RequestSchema = new Schema<IRequest>(
    {
        CustomerID: String,
        CustomerName: String,
        CustomerPhoneNumber: String,
        TicketID: String,
        SourceAddress: String,
        SourceLocation: LocationSchema,
        SourctLat: Number,
        SourceLong: Number,
        DestinationLat: Number,
        DestinationLong: Number,
        DesinationAddress: String,
        DestinationLocation: LocationSchema,
        CarPickupLocationAddress: String,
        CarPickupLat: Number,
        CarPickupLong: Number,
        CarPickupLocation: LocationSchema,
        CarDeliveryLocationAddress: String,
        CarDeliveryLat: Number,
        CarDeliveryLong: Number,
        CarDeliveryLocation: LocationSchema,
        Distance: Number,
        ServiceTax: Number,
        GST: Number,
        AddTip: Number,
        Price: Number,
        TotalAmount: Number,
        Balance: Number,
        Note: String,
        CategoryID: String,
        ServiceImageURL: String,
        RequestImageURL: String,
        TotalSFT: Number,
        CategoryName: String,
        CategoryImage: String,
        VendorID: String,
        VenodrName: String,
        VendorPhoneNumber: String,
        VendorAddress: String,
        VendorLat: Number,
        VendorLong: Number,
        VendorLocation: LocationSchema,
        Services: [ServiceSchema],
        Problems: [ProblemSchema],
        typeID: String,
        typeName: String,
        Slot: SlotSchema,
        VendorSlotID: String,
        AssignedFranchiseId: String,
        AssignedFranchiseName: String,
        AssignedFranchsiePhoneNumber: String,
        AssignedFranchiseAddress: String,
        AssignedFranchiseLocation: LocationSchema,
        AssignedFranchiseStateID: String,
        AssignedFranchiseState: String,
        AssignedFranchiseDistrictID: String,
        AssignedFranchiseDistrictName: String,
        AssignedFranchiseStoreAddress: String,
        AssignedFranchiseArea: String,
        AssignedFranchisePinCode: String,
        AssignedFranchiseCode: String,
        RaisedComplaint: Boolean,
        Date: Date,
        PaymentStatus: String,
        AssignedTechinicianID: String,
        AssignedTechnicianName: String,
        AssignedTechnicianPhoneNumber: Number,
        AssignedTechnicianAvatar: String,
        AssignedFranchiseComments: String,
        StatusTracking: [StatusTrackingSchema],
        FranchiseNote: String,
        RequestStatus: String,
        OrderID: String,
        BeforePics: [PhotoSchema],
        AfterPics: [PhotoSchema],
        NotificationStatus: String,
        TechnicianRating: Number,
        CancelReason: String,
        otherCancelComments: String,
        CarWashRequestStatus: String,
        PaidToVendor: Number,
        WooZServiceID: String,
        WooZService: String,
        TotalKm: Number,
        WooZComplaintID: String,
        WooZComplaintName: String,
        WoozInstructions: [WoozInstructionSchema],
        WaitingPeriodTime: Number,
        VehicleTypeID: String,
        VehicleTypeName: String,
        BrandID: String,
        BrandName: String,
        VehicleName: String,
        Problem: String,
        RaiseComplaint: RaiseComplaintSchema,
        TicketStatus: [TicketStatusSchema],
        RequestForTommorow: Boolean,
        RequestType: String,
        companyTypeID: String,
        companyType: String,
        companyID: String,
        companyName: String,
        companyMobileNumber: String,
        companyAddress: String,
        companyAddressLocation: String,
        AssignedTechinicians: [AssignedTechnicianSchema],
        RequestFrom: String,
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// 🔹 Export Model
export const Request = mongoose.model<IRequest>("requests", RequestSchema);
