FROM node:16-alpine

WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript ts-node

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application
COPY . .

# Build TypeScript code
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "./bin/index.js"]