# **usof**

<div>
    <img src="https://img.shields.io/badge/nestjs-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" height="30"/>
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" height="30"/>
    <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" height="30"/>
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" height="30"/>
    <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" height="30"/>
    <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=white" height="30"/>
</div>

---

**usof** is a backend application inspired by platforms like StackOverflow and Reddit. It provides an API for user authentication, question posting, answers, voting, and comments. The project is designed for learning and experimentation purposes and demonstrates the use of modern backend development practices.

---

## 📋 Table of Contents


- [⚡️ Getting Started](#getting-started)
    - [📋 Prerequisites](#prerequisites)
    - [⚙️ Installation](#installation)
    - [🗂 Database Setup](#database-setup)
    - [🚀 Executing program](#executing-program)
- [📄 API Documentation](#api-documentation)
- [🔐 Admin panel](#admin-panel)
- [📝 Database Schema](#database-schema)
- [🧾 License](#license)

---

## ⚡️ Getting Started

### 📋 Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en) (v16 or higher)
- [npm](https://www.npmjs.com) (v7 or higher)
- [PostgreSQL](https://www.postgresql.org) (v12 or higher)

### ⚙️ Installation

1. Clone the repository:
   
    ```bash
    git clone https://github.com/Prov258/usof.git
    ```

2. Go to the project directory:
    
    ```bash
    cd usof/backend
    ```

3. Install dependencies:
    
    ```bash
    npm install
    ```

4. Create a `.env` file based on `.env.example` and put your configuration values

### 🗂 Database Setup

1. Configure the database:
    - Create a PostgreSQL database
    - Set up the environment variables in a `.env` file
2. Run the database migrations:
    
    ```bash
    npx prisma migrate dev
    ```

3. Seed the database if needed:
    
    ```bash
    npx prisma db seed
    ```

### 🚀 Executing program
To run the application use the following command:

```bash
npm run start
```

## 📄 API Documentation

The application uses Swagger for API documentation.\
Visit `http://localhost:3000/api/docs` in your browser after starting the server to view the interactive API documentation.

## 🔐 Admin panel

After starting the server you can visit admin panel at `http://localhost:3000/admin`

## 📝 Database Schema

The database schema is managed using Prisma. Below is a visual repesentation of the schema:

<p align="center">
  <img src="backend/prisma/db.png"/>
</p>

## 🧾 License

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).

