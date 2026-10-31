# StockWise – Inventory Management System

StockWise is a full-stack inventory management MVP built with React, Spring Boot, and MySQL. It provides a dashboard for monitoring inventory and CRUD operations for product records.

## Features
- Dashboard summary: total products, units in stock, low-stock items, and inventory value
- Create, read, update, and delete products
- Search products by name or SKU
- Track SKU, category, price, quantity, and reorder level
- REST API built with Spring Boot and Spring Data JPA
- MySQL persistence

## Tech stack
- Frontend: React, Vite, JavaScript, CSS
- Backend: Java 17+, Spring Boot 3, Spring Web, Spring Data JPA, Bean Validation
- Database: MySQL 8+
- Build: Maven

## Project structure
```text
StockWise/
├── stockwise-backend/
│   ├── src/main/java/com/stockwise/
│   ├── src/main/resources/application.properties
│   └── pom.xml
├── stockwise-frontend/
│   ├── src/App.jsx
│   ├── src/App.css
│   └── package.json
└── database/schema.sql
```

## Run locally

### 1. Create the database
Run `database/schema.sql` in MySQL Workbench or the MySQL CLI.

### 2. Configure database credentials
Open `stockwise-backend/src/main/resources/application.properties` and set your local MySQL username/password. The default configuration uses:
- database: `stockwise_db`
- username: `root`
- password: `root`

For a safer setup, override credentials using environment variables `DB_USERNAME` and `DB_PASSWORD`.

### 3. Start the backend
```bash
cd stockwise-backend
mvn spring-boot:run
```
Backend: `http://localhost:8080`

### 4. Start the frontend
Open a second terminal:
```bash
cd stockwise-frontend
npm install
npm run dev
```
Frontend: `http://localhost:5173`

## API endpoints
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products; optional `?search=term` |
| GET | `/api/products/{id}` | Get one product |
| POST | `/api/products` | Create a product |
| PUT | `/api/products/{id}` | Update a product |
| DELETE | `/api/products/{id}` | Delete a product |
| GET | `/api/dashboard/summary` | Get inventory summary |

## Sample product JSON
```json
{
  "name": "Wireless Mouse",
  "sku": "ELEC-001",
  "category": "Electronics",
  "price": 799.00,
  "quantity": 25,
  "reorderLevel": 5
}
```

## Current scope
This repository is an MVP focused on product and stock tracking. Authentication, supplier/purchase workflows, sales orders, role-based access, automated tests, and deployment are planned enhancements and are not represented as completed features.

## Resume description
**StockWise – Inventory Management System | Java, Spring Boot, React, MySQL**
- Developed a full-stack inventory management application with a React dashboard and Spring Boot REST APIs.
- Implemented product CRUD operations, search, stock-level monitoring, and inventory summary metrics.
- Integrated MySQL persistence using Spring Data JPA.
