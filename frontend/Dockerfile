# Use the official Node.js 16 Alpine image.
FROM node:18-alpine

# Create and set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory.
COPY package.json ./

# Install dependencies.
RUN npm install

# Copy the rest of the frontend code to the working directory.
COPY . .

# Accept environment variables as build arguments
ARG REACT_APP_BACKEND_URL
ARG REACT_APP_ASSET_URL

# Create .env file and write the build arguments to it
RUN echo "REACT_APP_BACKEND_URL=${REACT_APP_BACKEND_URL}" > .env
RUN echo "REACT_APP_ASSET_URL=${REACT_APP_ASSET_URL}" >> .env

# Build the application.
RUN npm run build

# Install `serve` to serve the app using a static server.
RUN npm install -g serve

# Expose the port the app runs on.
EXPOSE 3000

# Command to serve the app.
CMD ["serve", "-s", "build"]
