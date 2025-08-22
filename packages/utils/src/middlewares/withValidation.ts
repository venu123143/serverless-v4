import { LambdaHandler } from "../types/types";
import Joi from "joi";

export const withValidation = (schema: Joi.ObjectSchema, handler: LambdaHandler): LambdaHandler => {
    return async (event) => {
        try {
            const body = event.body ? JSON.parse(event.body) : {};

            const { error } = schema.validate(body, { abortEarly: false });
            if (error) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: "Validation failed",
                        details: error.details.map((d) => d.message),
                    }),
                };
            }

            return handler(event);
        } catch (err: any) {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: "Server error", error: err.message }),
            };
        }
    };
};
