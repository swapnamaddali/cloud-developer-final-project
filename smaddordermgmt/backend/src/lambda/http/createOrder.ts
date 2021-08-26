import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateOrderRequest } from '../../requests/CreateOrderRequest';
import { getToken, parseUserId, parseScope} from '../../auth/utils';
import { createLogger } from '../../utils/logger';
import { createOrder } from '../../services/orderService';

const logger = createLogger('createOrder');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  //logger.info('Processing current event: ', { event: event });
  //new request from the event
  const newOrder: CreateOrderRequest = JSON.parse(event.body);

  //const newItem: {"message":"missing required property"}

  if (!newOrder.productId) {
    return {
        statusCode: 400,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        },
      body: JSON.stringify({
            item: newOrder
        })
    }
  }
  // Get user id
  const authHeader = event.headers.Authorization;
  const jwtToken = getToken(authHeader);
  logger.info('jwtToken: ', { jwtToken: jwtToken });

  const userId = parseUserId(jwtToken);
  const scope = parseScope(jwtToken)
  logger.info('userId: ', { userId: userId });
  logger.info('Scope: ', { scope: scope });
  
  // Create Todo item
  const newItem = await createOrder(newOrder, userId);

  logger.info("Created ", newItem); 

  return {
    statusCode: 201,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item:newItem
    })
  };
};