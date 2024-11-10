# Use official Node.js image
FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]
