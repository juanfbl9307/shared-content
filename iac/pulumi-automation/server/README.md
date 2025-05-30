# Pulumi Automation API Server

This server provides a REST API for managing Pulumi stacks using the Pulumi Automation API.

## API Endpoints

### Status

- **URL**: `/api/pulumi/status`
- **Method**: `GET`
- **Description**: Check if the API is running
- **Response**:
  ```json
  {
    "status": "OK",
    "message": "Pulumi Automation API is running"
  }
  ```

### Refresh Stack

- **URL**: `/api/pulumi/refresh`
- **Method**: `GET`
- **Description**: Refresh the Pulumi stack to sync with the actual state of cloud resources
- **Response**:
  ```json
  {
    "message": "Stack refreshed successfully"
  }
  ```

### Update Stack

- **URL**: `/api/pulumi/update`
- **Method**: `POST`
- **Description**: Create or update resources defined in the Pulumi stack
- **Response**:
  ```json
  {
    "message": "Stack updated successfully",
    "summary": {
      "create": 1,
      "update": 0,
      "delete": 0,
      "same": 0
    },
    "outputs": {
      "websiteUrl": {
        "value": "node1"
      }
    }
  }
  ```

### Destroy Stack

- **URL**: `/api/pulumi/destroy`
- **Method**: `DELETE`
- **Description**: Destroy all resources in the Pulumi stack
- **Response**:
  ```json
  {
    "message": "Stack destroyed successfully"
  }
  ```

## Running the Server

### Using Docker Compose

```bash
cd /path/to/pulumi-automation
docker-compose up -d
```

The server will be available at http://localhost:3000.

### Running Locally

```bash
cd /path/to/pulumi-automation/server
yarn install
yarn build
yarn start
```

## Development

### Building the Project

```bash
yarn build
```

### Running in Development Mode

```bash
yarn start
```

## Architecture

The server is built using a service-oriented architecture:

1. **PulumiService**: Encapsulates the Pulumi automation logic
2. **PulumiController**: Exposes the service functionality as REST API endpoints
3. **Express Application**: Handles HTTP requests and routes them to the appropriate controller methods

This separation of concerns makes the code more maintainable and testable.