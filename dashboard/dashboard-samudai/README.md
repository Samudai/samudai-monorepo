# Samudai Dashboard

A modern React-based web application for managing DAO interactions, projects, and collaborations.

## Tech Stack

- React 18
- TypeScript
- Redux Toolkit for state management
- Web3 Integration (Wagmi, RainbowKit)
- Ceramic Network for decentralized data
- SendBird for chat functionality
- Lit Protocol for encryption
- SASS for styling
- Nginx for production serving

## Prerequisites

- Node.js 18 or later
- npm or yarn
- Docker (for containerized deployment)

## Development Setup

1. Clone the repository:

```bash
git clone https://github.com/Samudai/dashboard-samudai.git
cd dashboard-samudai
```

2. Install dependencies:

```bash
npm install --force  # force flag is required due to dependency conflicts
```

3. Set up environment variables:

- Copy the appropriate environment file:

  ```bash
  cp .development.env .env  # for development
  # or
  cp .staging.env .env      # for staging
  # or
  cp .production.env .env   # for production
  ```

4. Start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run build:development` - Builds for development environment
- `npm run build:staging` - Builds for staging environment
- `npm run build:prod` - Builds for production environment
- `npm run lint` - Runs ESLint
- `npm run format` - Formats code using Prettier
- `npm run analyze` - Analyzes bundle size

## Docker Build Instructions

To build and run the application using Docker, follow these steps:

### Prerequisites

- Docker installed on your system
- Node.js 18 or later (for local development)
- NPM token (if required for private packages)

### Build the Docker Image

The application uses a multi-stage build process with Node.js for building and Nginx for serving the application. You can build the image using:

```bash
# Build for a specific environment (e.g., development)
docker build \
  --build-arg NODE_ENV=development \
  --build-arg NPM_TOKEN=your_npm_token \
  -t dashboard-samudai .

# Or for production
docker build \
  --build-arg NODE_ENV=production \
  --build-arg NPM_TOKEN=your_npm_token \
  -t dashboard-samudai .
```

### Run the Container

```bash
# Run the container
docker run -p 3000:80 dashboard-samudai
```

The application will be available at [http://localhost:3000](http://localhost:3000). Note that the container runs Nginx on port 80 internally.

### Notes

- The build process uses a multi-stage Dockerfile that:
  1. First builds the React application using Node.js
  2. Then serves it using Nginx
- Custom Nginx configurations are copied from the `nginx/` directory
- The build process requires the `--force` flag with npm install due to potential dependency conflicts

## Contributing

Please read our contributing guidelines before submitting pull requests.
