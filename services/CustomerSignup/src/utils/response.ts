import { Response } from "express";

export enum ResponseStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED"
}

export interface SuccessData {
    Status: ResponseStatus;
    StatusCode: number;
    Message: string;
    Data: {
        [key: string]: any;
    };
    Meta?: {
        totalPages: number;
        currentPage: number;
    };
}

export interface FailureData {
    Message: string;
    StatusCode: number;
    Status?: ResponseStatus;
    [key: string]: any;
}

type FailureStatus = 400 | 401 | 403 | 404 | 413 | 422 | 429 | 409 | 500 | 503;

const RESPONSE = {
    SuccessResponse: (res: Response, status: 200 | 201, data: SuccessData) => {
        return res.status(status).json(data);
    },
    FailureResponse: (res: Response, status: FailureStatus, data: FailureData) => {
        return res.status(status).json(data);
    },
};

export default RESPONSE;
