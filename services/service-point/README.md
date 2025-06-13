# Service Points

## Overview

This service named service-points provides a suite of CRUD (Create, Read, Update, Delete) operations on a PostgreSQL database which are exposed as endpoints. It processes incoming messages from two primary sources: `service-discord` and `gateway-external`, using rabbitMq (queue) to handle point events. The messages are then stored in a PostgreSQL database.

The service also leverages Redis for caching frequently accessed data, and MongoDB for additional storage solutions. It is designed for high-performance in a distributed environment, written entirely in Go.

---

## Installation Guide

### Prerequisites

Ensure the following are installed before proceeding:

- **Go**
- **PostgreSQL**
- **Redis**
- **MongoDB**
- **RabbitMQ**

### Step 1: Clone the Repository

Start by cloning the repository to your local machine:

git clone https://github.com/Samudai/service-point.git

cd service-point

### Step 2: Set Up Environment Variables

To configure the environment variables, simply set up the .envrc file as outlined in the [master README.md](https://github.com/Samudai/gateway-consumer-node/blob/develop/MasterReadme.md). This will ensure all necessary environment variables are properly loaded.

### Step 3: Install Dependencies
The project uses Go modules to manage dependencies. Run the following commands:

go mod tidy
go mod vendor

### Step 4: Start the Service

To start the service, simply run the run executable file located in the root directory of the service

./run
