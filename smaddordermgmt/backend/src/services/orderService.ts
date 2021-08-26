

import { OrderItem} from '../models/OrderItem';
import { orderAccess } from '../data/ordersDataAccess';
//import { ImageAccess } from '../data/productFileAccess';

import { CreateOrderRequest } from '../requests/CreateOrderRequest';
import { UpdateOrderRequest } from '../requests/UpdateOrderRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger('ordersServices');

const orAccess = new orderAccess();
//const imageAccess = new ImageAccess();

//export async function getFileUrl(todoId: string, userId: string): Promise<string> {
//   // Get pre-signed URL from filestore
//   const url = await imageAccess.getUploadUrl(todoId);
//   logger.info('url', { url: url });

//   // Write final url to datastore
//   await todoAccess.updateTodoUrl(todoId, userId);
//   return url;
// }

// export async function deleteTodo(todoId: string, userId: string) {
//   return await todoAccess.deleteTodo(todoId, userId);
// }

export async function getOrders(userId: string): Promise<OrderItem[]> {
  logger.info('Entering GetOrders Service');
  return orAccess.getOrders(userId);
}

export async function createOrder(
  createOrderItem: CreateOrderRequest,
  userId: string
): Promise<OrderItem> {

  logger.info('Entering CreateToDo Service');

  const orderId = "OID" + Math.random();
  const timestamp = new Date().toISOString();

  return await orAccess.createOrder({
    userId: userId,
    orderId: orderId,
    createdAt: timestamp,
    productId: createOrderItem.productId,
    userEmail: createOrderItem.userEmail,
    orderStatus: 'completed',
    quantity: '1'
    // attachmentUrl?: string
  });
}

export async function updateOrder(
  orderId: string,
  updateOrderRequest: UpdateOrderRequest,
  userId: string
): Promise<OrderItem> {

  logger.info('Entering UpdateOrder Service');
  
  return await orAccess.updateOrder(updateOrderRequest, orderId, userId);

}

export async function deleteOrder(orderId: string, userId: string) {
  return await orAccess.deleteOrder(orderId, userId);
}