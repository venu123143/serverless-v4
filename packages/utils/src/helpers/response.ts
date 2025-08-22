import { ResponseStatus } from "../types/types";

export const successResponse = (data: unknown, statusCode = 200, message = "Request successful") => ({
    statusCode,
    body: JSON.stringify({
        Status: ResponseStatus.SUCCESS,
        StatusCode: statusCode,
        Message: message,
        Data: data,
    }),
});

export const errorResponse = (data: unknown, message: string, statusCode = 500) => ({
    statusCode,
    body: JSON.stringify({
        Status: ResponseStatus.FAILED,
        StatusCode: statusCode,
        Message: message,
        Data: data,
    }),
});
