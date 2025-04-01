# backend
## Steps to Build and Run the Dockerized App
Build the Docker Image:
```bash
docker build -t express-backend .
```

Run the Docker Container:
```bash
# TODO Find an appropriate docker run command which can be killed via the terminal.
docker run -t -i -p 4000:4000
```

Access the Application:
Open a browser or use a tool like curl to visit: http://localhost:4000

## Local Development
### Initial Install
1. Install Colima (as Docker Daemon): https://github.com/abiosoft/colima
1. Install NodeJS 22 (current LTS): https://nodejs.org/en
1. Install ExpressJS 5.X: https://expressjs.com/en/starter/installing.html
1. PostgresSQL 17: https://www.postgresql.org/download/
1. pgadmin
1. Sequelize: object-relational mapper for PostgreSQL - https://sequelize.org/docs/v6/getting-started/
1. Pg & pg-hstore: pg is a PostgreSQL client for Node.js and pg-hstore is a node package for serializing and deserializing JSON data to hstore format
1. Nodemon: Automatic restart of node application when file changes are detected - `npm install --save-dev nodemon`
1. bcrypt (Optionally use Postgres SQL to hash?)
1. Dotenv: Access to env vars
1. JsonWeb Token: Generate tokens (Optional: Use Postgres SQL instead?)
1. CookieParser: Set cookies


## Concepts
### Security
* **Authentication**: determining if a user is who they claim to be.
* **Authorization**: specifies data users can get access to in your application
* **JSON Web Token (JWT)** is an open standard (RFC 7519) that defines a compact and self-contained way of securing and transmitting information between parties as JSON objects which will be stored as a Cookie stored in a user session.
