import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export const withAuth = (handler: (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>) => {
    return async (event: APIGatewayProxyEventV2) => {
        const authHeader = event.headers.Authorization || event.headers.authorization;

        if (!authHeader || authHeader !== "Bearer my-secret-token") {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Unauthorized" }),
            };
        }

        return handler(event);
    };
};
