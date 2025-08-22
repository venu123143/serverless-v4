import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from "aws-lambda";
import { LambdaHandler } from "../types/types";
import Joi from "joi";
import { errorResponse } from "../helpers/response";

export const withValidation = (schema: Joi.ObjectSchema, handler: LambdaHandler): LambdaHandler => {
    return async (event: APIGatewayProxyEventV2, context: Context) => {
        try {
            console.log("calling withValidation");
            const body = event.body ? JSON.parse(event.body) : {};

            // const { error } = schema.validate(body, { abortEarly: false });
            // if (error) {
            //     return errorResponse(error.details.map((d) => d.message), "Validation failed", 400);
            // }

            return handler(event, context);
        } catch (err: any) {
            return errorResponse(err.message, "Server error", 500);
        }
    };
};
