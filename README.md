# Location stream - NATS WS
A Node.js backend for a location-sharing application using **Express**, **MongoDB**, **NATS** messaging, and **JWT** authentication. This application provides endpoints for user authentication, ride orders, and location updates.

## Features

- **JWT Authentication**: Secure endpoints using JSON Web Tokens.
- **NATS Messaging**: Real-time communication for ride orders and location updates.
- **MongoDB**: Store and track rider location details.
- **Dockerized Setup**: Easily deployable with Docker and Docker Compose.

## Prerequisites

- **Node.js** and **npm**
- **Docker** and **Docker Compose** for containerized deployment

## Setup

### 1. Environment Configuration

Create a `.env` file with the following:

```bash
cp .env.example .env
```

### 2. Install Dependencies

```bash
make install
```

### 3. Run Locally (Development Mode)

```bash
make dev
```

### 4. Docker Deployment

Build and start the containers:

```bash
make docker-build
make docker-up
```

To stop and remove containers:

```bash
make docker-down
```

### 5. View Logs

```bash
make logs
```

## Running Tests

To run tests with Jest and Supertest:

```bash
make test
```
