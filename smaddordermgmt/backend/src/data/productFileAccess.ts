import * as AWS  from 'aws-sdk';

import { createLogger } from '../utils/logger';
import { ProductItem } from '../models/ProductItem';

const logger = createLogger('productAccess');
const docClient = new AWS.DynamoDB.DocumentClient();
const productTable = process.env.PRODUCTS_TABLE;

const s3: AWS.S3 = new AWS.S3({ signatureVersion: 'v4' });
const bucketName = process.env.PRODUCT_IMAGES_S3_BUCKET;
const urlExpiration: Number = Number(process.env.SIGNED_URL_EXPIRATION);

export class ProductAccess {

  async getUploadUrl(pid: string): Promise<string> {
    const result = s3.getSignedUrl('putObject', {
      Bucket: bucketName,
      Key: pid,
      Expires: urlExpiration
    });

    logger.info('result', { result: result });

    return result;
  }

  async getProducts(): Promise<ProductItem[]> {

    const result = await docClient.scan({
      TableName: productTable,
    }).promise();

    logger.info('result', { result: result });
    const items = result.Items;
    
    return items as ProductItem[];

  }

  async createProduct(crProduct: ProductItem): Promise<ProductItem> {
    logger.info(`Creating a product`, {
      pid: crProduct.pid
    });

    await docClient.put({
      TableName: productTable,
      Item: crProduct
    }).promise();

    return crProduct;

  }

  async updateProductUrl(pid: string) {
    logger.info(`Updating a product URL for item:`, {
      pid: pid,
    });

    const url = `https://${bucketName}.s3.amazonaws.com/${pid}`;

    const params = {
      TableName: productTable,
      Key: {
        pid: pid
      },
      ExpressionAttributeNames: {
        '#pr_attachmentUrl': 'attachmentUrl'
      },
      ExpressionAttributeValues: {
        ':attachmentUrl': url
      },
      UpdateExpression: 'SET #pr_attachmentUrl = :attachmentUrl',
      ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.update(params).promise();

    logger.info(`Update statement has completed without error`, { result: result });

    return result.Attributes as ProductItem;
  }
  




}
