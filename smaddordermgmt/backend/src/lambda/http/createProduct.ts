import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { CreateProductRequest } from '../../requests/CreateProductRequest';
import { getToken, parseUserId, parseScope} from '../../auth/utils';
import { createLogger } from '../../utils/logger';
import { createProduct } from '../../services/productService';

const logger = createLogger('createProduct');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  logger.info('Processing current event: ', { event: event });
  //new request from the event
  const newProduct: CreateProductRequest = JSON.parse(event.body);

  //const newItem: {"message":"missing required property"}

  if (!newProduct.name) {
    return {
        statusCode: 400,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        },
      body: JSON.stringify({
            item: newProduct
        })
    }
  }
  // Get user id
  const authHeader = event.headers.Authorization;
  const jwtToken = getToken(authHeader);
  logger.info('jwtToken: ', { jwtToken: jwtToken });

  const userId = parseUserId(jwtToken);
  const scope = parseScope(jwtToken);

  logger.info('userId: ', { userId: userId });
  logger.info('scope: ', { scope: scope});

  
  if (scope != "write:products"){
    return {
        statusCode: 401,
        headers: {
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*'
        },
      body: JSON.stringify({
            item: newProduct
        })
    }
  }

  // Create Todo item
  const newItem = await createProduct(newProduct, userId);

  logger.info("Created Product", newItem); 

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