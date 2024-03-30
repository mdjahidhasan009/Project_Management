# Use the official Node.js 16 Alpine image.
FROM node:18-alpine

# Create and set the working directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory.
#COPY package*.json ./
COPY package.json .
RUN npm install
# Copy the rest of the backend code to the working directory.
COPY . .

# Expose the port the app runs on.
EXPOSE 5000

# Command to run the app.
CMD ["npm", "run", "server"]
