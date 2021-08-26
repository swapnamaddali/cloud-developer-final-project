import 'source-map-support/register'
import { getFileUrl } from '../../services/productService';
import { getToken, parseScope } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';

const logger = createLogger('productUPDLogger');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const pid = event.pathParameters.pid;
  logger.info('Processing event: ', { event: event });

  const authorization = event.headers.Authorization;
  const jwtToken = getToken(authorization);
  //const userId = parseUserId(jwtToken);
  const scope = parseScope(jwtToken);

  if (scope != "write:products"){
    return {
        statusCode: 401,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        },
      body: JSON.stringify({
            item: pid
        })
    }
  }

  const url = await getFileUrl(pid);

  // Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  };
}