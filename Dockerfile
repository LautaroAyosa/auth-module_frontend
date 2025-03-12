# Stage 1: Build the Next.js app
FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source and build the app
COPY . .
RUN npm run build

# Stage 2: Run the app in production mode
FROM node:16-alpine AS runner

WORKDIR /usr/src/app
COPY --from=builder /usr/src/app ./

# Expose the frontend port
EXPOSE 3006

# Start the application
CMD ["npm", "start"]