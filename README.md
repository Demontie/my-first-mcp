# My First MCP Project

This project demonstrates the use of MCP (Model Context Protocol) server that retrieves data from the [DummyJSON](https://dummyjson.com/docs/products#products-all) API. Built using Cursor IDE with the default agent.

## Table of Contents

- [Features](#features)
- [Installation and Usage](#installation-and-usage)
- [Cursor Configuration](#cursor-configuration)
- [License](#license)

## Features

### Products API Tools

- **get_products**
  - Description: Get a list of products with optional filtering and pagination
  - Parameters:
    - `id` (string, optional): Filter products by ID
    - `q` (string, optional): Filter products by title
    - `category` (string, optional): Filter products by category
    - `brand` (string, optional): Filter products by brand
    - `price` (number, optional): Filter products by price
    - `rating` (number, optional): Filter products by rating
    - `skip` (number, optional, default: 0): Number of products to skip
    - `limit` (number, optional, default: 10): Maximum number of products to return
  - Returns: A list of products matching the specified criteria
  - Data Source: DummyJSON API (https://dummyjson.com/products)

## Installation and Usage

### Prerequisites

- Node.js (version 23 or higher)
- Docker and Docker Compose
- WSL2 (if using Windows)

## Cursor Configuration

To configure this MCP server with Cursor:

1. Open Cursor
2. Press:
   - Windows/Linux: `Ctrl + Shift + P`
   - macOS: `Cmd + Shift + P`
3. Type "Configure MCP Server" and select it
4. Add the appropriate configuration based on your setup:

#### For Windows (without WSL) or Linux:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "node",
      "args": ["ABSOLUTE_PATH_TO_PROJECT/src/index.ts"]
    }
  }
}
```

#### For WSL Users:

```json
{
  "mcpServers": {
    "postgres": {
      "command": "wsl.exe",
      "args": [
        "-e",
        "ABSOLUTE_PATH_TO_NODE/.nvm/versions/node/v23.11.0/bin/node",
        "ABSOLUTE_PATH_TO_PROJECT/src/index.ts"
      ]
    }
  }
}
```

To find your Node.js path, run:

```bash
which node
```

## License

This project is licensed under the MIT License.
