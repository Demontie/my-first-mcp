import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getProductsTool } from "./tools/products";

async function initializeServer() {
  // Create server instance
  const server = new McpServer({
    name: "My First MCP",
    version: "1.0.0",
    description: "My first MCP",
  });

  // Register all tools
  server.tool(
    getProductsTool.name,
    getProductsTool.description,
    getProductsTool.parameters,
    getProductsTool.handler
  );

  return server;
}

async function main() {
  const server = await initializeServer();

  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("MCP Server running on stdio");
}

// Start the server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  // @ts-ignore
  process.exit(1);
});
