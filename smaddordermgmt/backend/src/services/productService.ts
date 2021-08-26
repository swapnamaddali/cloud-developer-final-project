

import { ProductItem} from '../models/ProductItem';
//import { orderAccess } from '../data/ordersDataAccess';
import { ProductAccess } from '../data/productFileAccess';

import { CreateProductRequest } from '../requests/CreateProductRequest';
//import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger('productServices');

const prAccess = new ProductAccess();
//const imageAccess = new ImageAccess();

export async function getFileUrl(pid: string): Promise<string> {
  // Get pre-signed URL from filestore
  const url = await prAccess.getUploadUrl(pid);
  logger.info('url', { url: url });

  // Write final url to datastore
  await prAccess.updateProductUrl(pid);
  return url;
}

// export async function deleteTodo(todoId: string, userId: string) {
//   return await todoAccess.deleteTodo(todoId, userId);
// }

export async function getProduct(): Promise<ProductItem[]> {
  logger.info('Entering GetProducts Service');
  return prAccess.getProducts();
}

export async function createProduct(
  createProductItem: CreateProductRequest,
  userId: string
): Promise<ProductItem> {

  logger.info('Entering CreateProduct Service');

  const productId = "PID" + Math.random();
  const timestamp = new Date().toISOString();

  return await prAccess.createProduct({
    pid: productId,
    name: createProductItem.name,
    desc: createProductItem.desc,
    userId: userId,
    createdAt: timestamp
    // attachmentUrl?: string
  });
}

// export async function updateTodo(
//   todoId: string,
//   updateTodoRequest: UpdateTodoRequest,
//   userId: string
// ): Promise<TodoItem> {

//   logger.info('Entering UpdateToDO Service');

//   return await todoAccess.updateTodo({
//     name: updateTodoRequest.name,
//     dueDate: updateTodoRequest.dueDate,
//     done: updateTodoRequest.done,
//   },
//   todoId,
//   userId);

//}