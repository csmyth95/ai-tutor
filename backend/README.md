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
