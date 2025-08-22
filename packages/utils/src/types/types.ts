import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";

export type LambdaHandler = (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>;
