StockPilot



StockPilot is a full-stack inventory and sales order management system built with Spring Boot, React, and MySQL. It helps a business manage products, categories, suppliers, customers, stock levels, and sales orders through a simple dashboard.

The project was created as a portfolio application to demonstrate backend API development, relational database design, business logic, and frontend integration.

Features

Dashboard

View the total number of products

View low-stock product count

View total categories, suppliers, and customers

View total, completed, and cancelled orders

View revenue generated from completed orders

Product Management

Add, view, update, and delete products

Assign products to categories

Search products by name

Identify low-stock products

Use reorder levels to determine when stock should be replenished

Display product stock status in the frontend

Category Management

Add, view, update, and delete categories

Organize products under categories

Supplier Management

Add, view, update, and delete suppliers

Store supplier contact and address information

Customer Management

Add, view, update, and delete customers

View orders belonging to a selected customer

Sales Order Management

Create orders containing one or more products

Validate customer and product IDs

Check whether enough stock is available

Calculate item subtotals and the final order total

Automatically reduce stock when an order is created

Cancel an order and restore its stock

Prevent the same order from being cancelled more than once

Filter orders by customer and order status

Business Rules

Product SKUs must be unique.

Category names must be unique.

Supplier and customer email addresses must be unique.

Product quantity cannot fall below the quantity required by an order.

A product is considered low stock when:

quantity <= reorderLevel

Revenue includes only orders with the COMPLETED status.

Cancelling an order restores the quantities of all products in that order.

A cancelled order cannot be cancelled again.

Technology Stack

Backend

Java 21

Spring Boot 4.1.0

Spring Web

Spring Data JPA

Hibernate

Bean Validation

Maven

Lombok

MySQL Connector/J

Frontend

React

Vite

React Router

JavaScript

HTML

CSS

Fetch API

Database and Tools

MySQL

MySQL Workbench

IntelliJ IDEA

Visual Studio Code

Postman

Git and GitHub

System Architecture

React Frontend
      |
      | HTTP / JSON
      v
Spring Boot REST API
      |
      | Spring Data JPA / Hibernate
      v
MySQL Database

The frontend sends HTTP requests to the Spring Boot REST API. The backend processes business rules and stores data in MySQL.

Project Structure

StockPilot/
├── stockpilot-backend/
│   ├── src/main/java/com/stockpilot/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── repository/
│   │   ├── service/
│   │   └── StockPilotApplication.java
│   ├── src/main/resources/
│   │   └── application.yml
│   └── pom.xml
│
└── stockpilot-frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    └── vite.config.js

Getting Started

Prerequisites

Install the following software:

Java Development Kit 21

Maven

MySQL Server

Node.js and npm

Git

Confirm that they are installed:

java -version
mvn -version
node -v
npm -v
git --version

Database Setup

Create the MySQL database:

CREATE DATABASE stockpilot_db;

Update the backend configuration in:

stockpilot-backend/src/main/resources/application.yml

Example configuration:

spring:
  application:
    name: stockpilot-backend

  datasource:
    url: jdbc:mysql://localhost:3306/stockpilot_db
    username: root
    password: your_mysql_password

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

server:
  port: 8080

Do not commit real database passwords to a public repository.

Running the Backend

Open a terminal inside the backend folder:

cd stockpilot-backend

Run the application:

mvn spring-boot:run

The backend runs at:

http://localhost:8080

You can also run StockPilotApplication.java directly from IntelliJ IDEA.

Running the Frontend

Open another terminal inside the frontend folder:

cd stockpilot-frontend

Install dependencies:

npm install

Start the Vite development server:

npm run dev

The frontend normally runs at:

http://localhost:5173

Vite may use another port, such as 5174, when port 5173 is already occupied.

Vite Proxy Configuration

The frontend uses a Vite proxy to send /api requests to the Spring Boot backend.

Example vite.config.js:

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});

REST API Endpoints

Products

Method

Endpoint

Description

GET

/api/products

Get all products

GET

/api/products/{id}

Get a product by ID

POST

/api/products

Create a product

PUT

/api/products/{id}

Update a product

DELETE

/api/products/{id}

Delete a product

GET

/api/products/search/{name}

Search products by name

GET

/api/products/low-stock

Get low-stock products

Categories

Method

Endpoint

Description

GET

/api/categories

Get all categories

GET

/api/categories/{id}

Get a category by ID

POST

/api/categories

Create a category

PUT

/api/categories/{id}

Update a category

DELETE

/api/categories/{id}

Delete a category

Suppliers

Method

Endpoint

Description

GET

/api/suppliers

Get all suppliers

GET

/api/suppliers/{id}

Get a supplier by ID

POST

/api/suppliers

Create a supplier

PUT

/api/suppliers/{id}

Update a supplier

DELETE

/api/suppliers/{id}

Delete a supplier

Customers

Method

Endpoint

Description

GET

/api/customers

Get all customers

GET

/api/customers/{id}

Get a customer by ID

POST

/api/customers

Create a customer

PUT

/api/customers/{id}

Update a customer

DELETE

/api/customers/{id}

Delete a customer

Sales Orders

Method

Endpoint

Description

GET

/api/orders

Get all sales orders

GET

/api/orders/{id}

Get an order by ID

POST

/api/orders

Create an order

PUT

/api/orders/{id}/cancel

Cancel an order and restore stock

GET

/api/orders/customer/{customerId}

Get orders by customer

GET

/api/orders/status/{status}

Get orders by status

Supported order statuses:

COMPLETED
CANCELLED

Dashboard

Method

Endpoint

Description

GET

/api/dashboard/summary

Get dashboard summary information

Example Requests

Create a Product

POST /api/products
Content-Type: application/json

{
  "name": "Mechanical Keyboard",
  "sku": "KEY-005",
  "description": "RGB mechanical gaming keyboard",
  "price": 8500.00,
  "quantity": 15,
  "reorderLevel": 5,
  "categoryId": 1
}

Create a Sales Order

POST /api/orders
Content-Type: application/json

{
  "customerId": 1,
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 3,
      "quantity": 1
    }
  ]
}

Cancel a Sales Order

PUT /api/orders/1/cancel

No request body is required.

Dashboard Summary Response

{
  "totalProducts": 12,
  "lowStockProducts": 1,
  "totalCategories": 8,
  "totalSuppliers": 2,
  "totalCustomers": 2,
  "totalOrders": 1,
  "completedOrders": 0,
  "cancelledOrders": 1,
  "totalRevenue": 0
}

Frontend Pages

The frontend currently includes:

Dashboard

Products page

Product table with stock status

Add Product modal

Product editing and deletion controls

Sidebar navigation

Planned pages include:

Categories

Suppliers

Customers

Sales Orders

Authentication and authorization

Screenshots

Add project screenshots to a folder such as:

docs/screenshots/

Then include them in this README:

![StockPilot Dashboard](docs/screenshots/dashboard.png)
![StockPilot Products](docs/screenshots/products.png)

Future Improvements

Complete category, supplier, customer, and sales-order frontend pages

Add product deactivation instead of deleting products used in order history

Add JWT authentication and role-based authorization

Add pagination and sorting

Add advanced product and order filters

Add purchase orders and supplier-product relationships

Add stock movement history

Add validation messages and global exception handling

Add unit and integration tests

Add Docker support

Deploy the frontend, backend, and database

Author

Chavidu Bandara

Software Engineering undergraduate interested in backend engineering, full-stack development, Java, Spring Boot, and scalable software systems.

License

No open-source license has been added yet. Add a LICENSE file before allowing others to reuse or redistribute the project.
