import type { APIGatewayProxyEventV2, APIGatewayProxyStructuredResultV2, Context } from 'aws-lambda';
import { withAuth } from '@gotask/utils/src/middlewares/withAuth';
import { withValidation } from '@gotask/utils/src/middlewares/withValidation';
import { createUserSchema } from './validations/customer-validation';
import { LambdaHandler } from '@gotask/utils/src/types/types';
import { connectDB } from '@gotask/database/src/connection';
import { errorResponse } from '@gotask/utils/src/helpers/response';

const hello: LambdaHandler = async (event: APIGatewayProxyEventV2, context: Context): Promise<APIGatewayProxyStructuredResultV2> => {
  try {
    await connectDB();

    console.log('Hello, Lambda!', event.body, context.functionName, context.functionVersion);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Go Serverless v4! Your function executed successfully!',
        functionName: context.functionName,
        functionVersion: context.functionVersion,
      }),
    };
  } catch (error) {
    return errorResponse(error, "Server error", 500);
  }
};

export const handler = withAuth(withValidation(createUserSchema, hello));