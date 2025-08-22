import { APIGatewayProxyEventV2, APIGatewayProxyResultV2, Context } from "aws-lambda";

export type LambdaHandler = (event: APIGatewayProxyEventV2, context: Context) => Promise<APIGatewayProxyResultV2>;

export enum ResponseStatus {
    SUCCESS = "SUCCESS",
    FAILED = "FAILED",
}
