import * as AWS from 'aws-sdk';

import { OrderItem } from '../models/OrderItem';
//import { TodoUpdate } from '../models/TodoUpdate';

import { createLogger } from '../utils/logger';
import { UpdateOrderRequest } from '../requests/UpdateOrderRequest';

const logger = createLogger('ordersDataAccess');

const docClient = new AWS.DynamoDB.DocumentClient();
const orderTable = process.env.ORDERS_TABLE;
//const bucketName = process.env.TODO_IMAGES_S3_BUCKET;
const USER_INDEX = process.env.USER_ID_INDEX;

export class orderAccess {

  async getOrders(userId: string): Promise<OrderItem[]> {
    logger.info('Getting all todos');

    const result = await docClient.query({
      TableName: orderTable,
      IndexName: USER_INDEX,
      KeyConditionExpression: '#userId =:i',
      ExpressionAttributeNames: {
        '#userId': 'userId'
      },
      ExpressionAttributeValues: {
        ':i': userId
      }
    }).promise();

    const items = result.Items;

    return items as OrderItem[];
  }

  async createOrder(crOrder: OrderItem): Promise<OrderItem> {
    logger.info(`Creating a todo`, {
      orderId: crOrder.orderId
    });

    await docClient.put({
      TableName: orderTable,
      Item: crOrder
    }).promise();

    return crOrder;
  }
  
  async updateOrder(order: UpdateOrderRequest, orderId: string, userId: string) {
    logger.info(`Updating a todo`, {
      orderId: orderId,
      userId: userId
    });

    const params = {
      TableName: orderTable,
      Key: {
        userId: userId,
        orderId: orderId
      },
      ExpressionAttributeNames: {
        '#order_email': 'userEmail',
      },
      ExpressionAttributeValues: {
        ':email': order.userEmail,
        ':productId': order.productId,
        ':quantity': order.quantity
      },
      UpdateExpression: 'SET #order_email = :email, productId = :productId, quantity = :quantity',
      ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.update(params).promise();

    logger.info(`Update statement has completed without error`, { result: result });

    return result.Attributes as OrderItem;
  }

  async deleteOrder(orderId: string, userId: string) {
    
    logger.info(`Deleting Order`, {
      orderId: orderId,
      userId: userId
    });

    const params = {
      TableName: orderTable,
      Key: {
        userId: userId,
        orderId: orderId
      }
    };

    await docClient.delete(params, function (err, data) {
      if (err) {
        console.error("Unable to delete item. Error JSON:", JSON.stringify(err, null, 2));
      } else {
        console.log("DeleteItem succeeded:", JSON.stringify(data, null, 2));
      }
    }).promise();
  }


  
}