import 'source-map-support/register';

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda';
import { getOrders } from '../../services/orderService';

import { getToken, parseUserId } from '../../auth/utils';
import { createLogger } from '../../utils/logger';

const logger = createLogger('getOrders');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('Processing event: ', {event: event});

  const authorization = event.headers.Authorization;
  const jwtToken = getToken(authorization);
  const userId = parseUserId(jwtToken);

  //const userId = 'swapmaddd321'
 
  logger.info('useris: ', { string: userId });

  const orders = await getOrders(userId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items: orders
    })
  }
}

