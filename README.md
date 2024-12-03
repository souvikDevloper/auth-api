
Authentication API with Node.js, JWT, Prisma, and PostgreSQL
This project is a complete authentication API built using modern technologies like Node.js, Express, JWT, Prisma, and PostgreSQL. It implements user registration, login, and protected routes with robust security and scalability. Designed as a backend solution for real-world applications, this project highlights my skills in building scalable and secure REST APIs.

Key Features
User Registration: Registers users with secure password hashing.
User Login: Authenticates users and issues JSON Web Tokens (JWTs) for session management.
Protected Routes: Middleware to validate JWTs for secure access.
Database Management: Utilizes Prisma ORM for PostgreSQL to handle user data.
Scalability: Modular structure for easy enhancements and scaling.
Testing: Includes automated testing with Jest for high reliability.
Tech Stack
Backend: Node.js, Express.js
Authentication: JSON Web Tokens (JWT)
Database: PostgreSQL with Prisma ORM
Testing: Jest
Tools: Postman for API testing, Prisma Studio for database inspection
Setup Instructions
1. Prerequisites
Ensure you have the following installed:

Node.js (v14+)
PostgreSQL
Git
2. Clone the Repository
bash
Copy code
git clone https://github.com/your-username/authentication-api.git
cd authentication-api
3. Install Dependencies
bash
Copy code
npm install
4. Configure Environment Variables
Create a .env file in the project root with the following values:

env
Copy code
DATABASE_URL="postgresql://<username>:<password>@localhost:5432/souvik"
JWT_SECRET="your_jwt_secret"
PORT=3000
Replace <username> and <password> with your PostgreSQL credentials.


