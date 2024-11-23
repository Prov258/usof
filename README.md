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

## <a name="getting-started">⚡️ Getting Started</a>

### <a name="prerequisites">📋 Prerequisites</a>

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en) (v16 or higher)
- [npm](https://www.npmjs.com) (v7 or higher)
- [PostgreSQL](https://www.postgresql.org) (v12 or higher)

### <a name="installation">⚙️ Installation</a>

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

### <a name="database-setup">🗂 Database Setup</a>

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

### <a name="executing-program">🚀 Executing program</a>
To run the application use the following command:

```bash
npm run start
```

## <a name="api-documentation">📄 API Documentation</a>

The application uses Swagger for API documentation.\
Visit `http://localhost:3000/api/docs` in your browser after starting the server to view the interactive API documentation.

## <a name="admin-panel">🔐 Admin panel</a>

After starting the server you can visit admin panel at `http://localhost:3000/admin`

## <a name="database-schema">📝 Database Schema</a>

The database schema is managed using Prisma. Below is a visual repesentation of the schema:

<p align="center">
  <img src="backend/prisma/db.png"/>
</p>

## <a name="license">🧾 License</a>

This project is licensed under the [MIT License](http://opensource.org/licenses/MIT).

