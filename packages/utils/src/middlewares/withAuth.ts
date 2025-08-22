import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from "aws-lambda";
import { LambdaHandler } from "../types/types";
import { errorResponse } from "../helpers/response";

export const withAuth = (handler: LambdaHandler) => {
    return async (event: APIGatewayProxyEventV2, context: Context) => {
        const authHeader = event.headers.Authorization || event.headers.authorization;
        console.log("calling withAuth", authHeader);
        // if (!authHeader || authHeader !== "Bearer my-secret-token") {
        //     return errorResponse(null, "Unauthorized", 401);
        // }

        return handler(event, context);
    };
};
