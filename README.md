# Cloud-Developer Capstone Project - Order Product Management Backend APIs

Project has back end code for the Product/Order Management application.
APIs are exposed as AWS Lambda functions using serverless yaml which has 6 end points to perform various operations required.

# Code Structure
# How to build and deploy as Lambda Functions to AWS
# $ cd cloud-developer-final-project/smaddordermgmt/backend
# $ npm install
# $ sls deploy -v


# Serverless Order Management app
 The backend for the project can be used for Order and Product management app.

### Order:
   # Need write:order permissions to Get (specfic user)/create/delete (specific user) order
1) Create order : https://abt4icvmra.execute-api.us-east-1.amazonaws.com/prod/orders
  This enpoint will create new order for a given product.
   
2) Update order: https://abt4icvmra.execute-api.us-east-1.amazonaws.com/prod/orders/{orderId}

   This enpoint will update order info.

3) Delete order: https://abt4icvmra.execute-api.us-east-1.amazonaws.com/prod/orders/{orderId}

   This enpoint will delete order

4) Get Orders: https://abt4icvmra.execute-api.us-east-1.amazonaws.com/prod/orders
   
   This enpoint will get all the orders for logged in user (token specific)
    

### Products 

# Need write:products permisisons to do action on product table

1) Create product : https://abt4icvmra.execute-api.us-east-1.amazonaws.com/prod/orders
  This enpoint will create new product.

2) Generate upload url for to uplaod product image: https://abt4icvmra.execute-api.us-east-1.amazonaws.com/prod/products/{pid}/attachment

   This enpoint will generate upload url to upload product image to AWS S3 bucket.


## Please run the postman collections to test all the API endpoionts.

## User and Token info
 
 I have put permisions on the Auth0 users that can be found in postman collections.

## Upload file to Binary to an associated Product

In the post man collections, please make sure the S3 URL Test is updated with a proper file from the filesystem under binary input.






