import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getToken, parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

import { deleteOrder} from '../../services/orderService';

const logger = createLogger('deleteOrder');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const orderId = event.pathParameters.orderId;
  logger.info('Processing event: ', { event: event });

  const authorization = event.headers.Authorization;
  const jwtToken = getToken(authorization);
  const userId = parseUserId(jwtToken);

  await deleteOrder(orderId, userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      deletedOrder:orderId
    })
  }
}
