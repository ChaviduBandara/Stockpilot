StockPilot – Inventory and Order Management System

A modern full-stack inventory and sales order management system built with Spring Boot, React, and MySQL.

StockPilot helps businesses manage products, categories, suppliers, customers, stock levels, and sales orders through a clear dashboard and REST API.

Features

Dashboard Overview: Displays total products, low-stock products, categories, suppliers, customers, orders, completed orders, cancelled orders, and total revenue

Product Management: Add, view, edit, and delete products

Category Management: Organize products under different categories

Supplier Management: Store and manage supplier details

Customer Management: Add and maintain customer information

Sales Order Management: Create orders containing multiple products

Automatic Stock Updates: Product quantities decrease when an order is created

Order Cancellation: Cancel an order and automatically restore product quantities

Low-Stock Detection: Products are marked as low stock when quantity reaches the reorder level

Order Filtering: Filter orders by customer or order status

Responsive Interface: Frontend layout designed for desktop, tablet, and mobile devices

REST API Integration: React frontend communicates with the Spring Boot backend using JSON

Project Structure

StockPilot/
├── Stockpilot-backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── com/stockpilot/
│   │       │       ├── controller/
│   │       │       ├── dto/
│   │       │       ├── entity/
│   │       │       ├── repository/
│   │       │       ├── service/
│   │       │       └── StockPilotApplication.java
│   │       └── resources/
│   │           └── application.yml
│   └── pom.xml
│
└── Stockpilot-frontend/
    ├── src/
    │   ├── components/
    │   │   └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   └── Products.jsx
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    ├── package.json
    ├── vite.config.js
    └── index.html

Frontend Pages

Dashboard

Displays a summary of inventory and sales data

Shows total products and low-stock products

Shows total categories, suppliers, and customers

Shows completed and cancelled order counts

Calculates revenue using completed orders only

Products

Displays all products in a clear table

Shows product name, SKU, category, price, quantity, and reorder level

Displays stock status using In Stock and Low Stock badges

Includes an Add Product modal

Supports editing and deleting products

Loads category options from the backend

Backend Modules

Products

Create products

View all products

View a product by ID

Update products

Delete products

Search products by name

View low-stock products

Categories

Create categories

View categories

Update categories

Delete categories

Suppliers

Create suppliers

View suppliers

Update suppliers

Delete suppliers

Customers

Create customers

View customers

Update customers

Delete customers

Sales Orders

Create orders with one or more products

Validate customer and product IDs

Check available stock before creating an order

Calculate item subtotals and total order amount

Reduce product quantity after an order is created

Cancel orders and restore stock

Prevent an order from being cancelled more than once

Filter orders by customer

Filter orders by status

Stock and Reorder Logic

Each product contains:

quantity: Current available stock

reorderLevel: The minimum stock level before more items should be ordered

A product is considered low stock when:

quantity <= reorderLevel

Example:

Quantity: 3
Reorder Level: 5
Status: Low Stock

Order Status

StockPilot currently supports two order statuses:

COMPLETED
CANCELLED

COMPLETED: The order was created successfully and stock was reduced

CANCELLED: The order was cancelled and stock was restored

Technologies Used

Backend

Java 21

Spring Boot

Spring Web

Spring Data JPA

Hibernate

Maven

Lombok

MySQL Connector/J

Frontend

React

Vite

React Router

JavaScript

HTML5

CSS3

Fetch API

Database and Development Tools

MySQL

MySQL Workbench

IntelliJ IDEA

Visual Studio Code

Postman

Git

GitHub

API Endpoints

Products

GET    /api/products
GET    /api/products/{id}
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}
GET    /api/products/search/{name}
GET    /api/products/low-stock

Categories

GET    /api/categories
GET    /api/categories/{id}
POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}

Suppliers

GET    /api/suppliers
GET    /api/suppliers/{id}
POST   /api/suppliers
PUT    /api/suppliers/{id}
DELETE /api/suppliers/{id}

Customers

GET    /api/customers
GET    /api/customers/{id}
POST   /api/customers
PUT    /api/customers/{id}
DELETE /api/customers/{id}

Sales Orders

GET  /api/orders
GET  /api/orders/{id}
POST /api/orders
PUT  /api/orders/{id}/cancel
GET  /api/orders/customer/{customerId}
GET  /api/orders/status/{status}

Dashboard

GET /api/dashboard/summary

Example Product Request

{
  "name": "Mechanical Keyboard",
  "sku": "KEY-005",
  "description": "RGB mechanical gaming keyboard",
  "price": 8500.00,
  "quantity": 15,
  "reorderLevel": 5,
  "categoryId": 1
}

Example Sales Order Request

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

Database Setup

Create the MySQL database:

CREATE DATABASE stockpilot_db;

Update application.yml with your MySQL credentials:

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/stockpilot_db
    username: root
    password: your_password

  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true

server:
  port: 8080

Running the Project

Start the Backend

Open a terminal inside the backend folder:

cd Stockpilot-backend
mvn spring-boot:run

The backend runs at:

http://localhost:8080

Start the Frontend

Open another terminal inside the frontend folder:

cd Stockpilot-frontend
npm install
npm run dev

The frontend normally runs at:

http://localhost:5173

Future Improvements

Complete frontend pages for categories, suppliers, customers, and sales orders

Add product search and stock filters

Add pagination and sorting

Add product activation and deactivation

Add purchase order management

Add authentication and role-based authorization

Add stock movement history

Add reports and charts

Add automated testing

Deploy the frontend, backend, and database

Author

Chavidu Bandara

Software Engineering undergraduate interested in Java, Spring Boot, backend development, full-stack development, and scalable software systems.
