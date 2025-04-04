# Use the official Node.js 23 bookworm image. Bookworm is the latest Debian release.
FROM node:20.19-bookworm-slim

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json files to the working directory
COPY package.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Define the command to run the app
CMD ["node", "server.js"]
