# Use a Node.js base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3000 (puedes ajustar esto según el puerto en el que escucha tu aplicación Nest.js)
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]
