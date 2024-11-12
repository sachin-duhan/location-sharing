# Variables
ENV_FILE=.env

# Install dependencies
install:
	npm install

# Start the app in development mode with Nodemon
dev:
	npm run dev

# Build and run Docker containers
docker-build:
	docker-compose --profile dev build

docker-up:
	docker-compose --profile dev up -d

docker-down:
	docker-compose down

# View application logs
logs:
	docker-compose logs -f app

# Clean up Docker volumes
docker-clean:
	docker-compose down -v

# Run tests for the application
test:
	npm test

# Run debug script with specified folder path
debug:
	@bash debug.sh $(path)
