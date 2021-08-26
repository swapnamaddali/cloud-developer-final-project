import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { updateOrder } from '../../services/orderService';
import { createLogger } from '../../utils/logger';
import { UpdateOrderRequest } from '../../requests/UpdateOrderRequest';
import { OrderItem } from '../../models/OrderItem';
import { getToken, parseUserId } from '../../auth/utils';

const logger = createLogger('updateOrder');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const orderId = event.pathParameters.orderId;
  logger.info('Processing event: ', {event: event});

  const updateRequest : UpdateOrderRequest = JSON.parse(event.body);
  const authorization = event.headers.Authorization;
  const jwtToken = getToken(authorization);
  const userId = parseUserId(jwtToken);
  
  try{ 
    const updOrder: OrderItem = await updateOrder(orderId, updateRequest, userId);

    logger.info('updated order: ', { updateRequest: updOrder });

    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    return {
      statusCode: 201,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item:updOrder
      })
    };
  } catch (e) {

    return {
      statusCode: 404,
      body: `error ${e}`
    };
  }
}
