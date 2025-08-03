# backend
## Local
### npm commands
* package install: `npm install <package>`
* build: `npm run start`

### Deploy
Use docker-compose in the base dir to setup with Postgres. The app will fail otherwise.

### Testing
#### Sign In
```bash
curl -X POST http://localhost:4000/api/v1/users/login \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

#### Register
```bash
curl -X POST http://localhost:4000/api/v1/users/register \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

# TODO Fix the cookie usage here
#### Summmarise Document
```bash
curl -X POST http://localhost:4000/api/v1/documents/summarise \
-H "Authorization: Basic {{TOKEN}}" \
-H "Content-Type: multipart/form-data" \
-F "document=@/Users/conorsmyth/projects/ai-tutor/test_document.pdf;type=application/pdf"
```


## Local Development
### Initial Install
1. Install Colima (as Docker Daemon): https://github.com/abiosoft/colima
1. Install NodeJS 20.19 (current LTS): https://nodejs.org/en
1. Install ExpressJS 5.X: https://expressjs.com/en/starter/installing.html
1. PostgresSQL 17: https://www.postgresql.org/download/

#### npm dependencies installed using npm ci
1. pgadmin
1. Sequelize: object-relational mapper for PostgreSQL - https://sequelize.org/docs/v6/getting-started/
1. Pg & pg-hstore: pg is a PostgreSQL client for Node.js and pg-hstore is a node package for serializing and deserializing JSON data to hstore format
1. Nodemon: Automatic restart of node application when file changes are detected - `npm install --save-dev nodemon`
1. bcrypt (Optionally use Postgres SQL to hash?)
1. Dotenv: Access to env vars
1. JsonWeb Token: Generate tokens (Optional: Use Postgres SQL instead?)
1. CookieParser: Set cookies

### Run Unit Tests
Uses the jest unit test framework.
```bash
npm test
```

### Compile
```bash
npx tsc --noEmit
```


## Concepts
### Security
* **Authentication**: determining if a user is who they claim to be.
* **Authorization**: specifies data users can get access to in your application
* **JSON Web Token (JWT)** is an open standard (RFC 7519) that defines a compact and self-contained way of securing and transmitting information between parties as JSON objects which will be stored as a Cookie stored in a user session.
