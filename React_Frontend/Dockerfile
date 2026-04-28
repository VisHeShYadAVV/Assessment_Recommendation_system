FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the default Vite port
EXPOSE 5173

# Command to start the development server
CMD ["npm", "run", "dev", "--", "--host"]
