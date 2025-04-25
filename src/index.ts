import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

export interface McpTextContent {
  type: "text";
  text: string;
  [key: string]: unknown;
}

export interface McpImageContent {
  type: "image";
  data: string;
  mimeType: string;
  [key: string]: unknown;
}

export interface McpResourceContent {
  type: "resource";
  resource:
    | {
        text: string;
        uri: string;
        mimeType?: string;
        [key: string]: unknown;
      }
    | {
        uri: string;
        blob: string;
        mimeType?: string;
        [key: string]: unknown;
      };
  [key: string]: unknown;
}

export type McpContent = McpTextContent | McpImageContent | McpResourceContent;

export interface McpResponse {
  content: McpContent[];
  _meta?: Record<string, unknown>;
  isError?: boolean;
  [key: string]: unknown;
}

export interface ProductParams {
  id?: string;
  q?: string;
  category?: string;
  brand?: string;
  price?: number;
  rating?: number;
  skip?: number;
  limit?: number;
  select?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

async function initializeServer() {
  // Create server instance
  const server = new McpServer({
    name: "My First MCP",
    version: "1.0.0",
    description: "My first MCP",
  });

  // Register all tools
  server.tool(
    "get_products",
    "Get a list of products with optional filtering and pagination.",
    {
      id: z.string().optional().describe("Filter products by ID"),
      q: z.string().optional().describe("Filter products by title"),
      category: z.string().optional().describe("Filter products by category"),
      brand: z.string().optional().describe("Filter products by brand"),
      price: z.number().optional().describe("Filter products by price"),
      rating: z.number().optional().describe("Filter products by rating"),
      skip: z
        .number()
        .optional()
        .default(0)
        .describe("Number of products to skip"),
      limit: z
        .number()
        .optional()
        .default(10)
        .describe("Maximum number of products to return"),
    },
    async (params: ProductParams): Promise<McpResponse> => {
      try {
        const { q, ...rest } = params;
        let result: ProductsResponse;
        let response;
        if (q) {
          response = await fetch(
            `https://dummyjson.com/products/search?q=${q}`,
            {
              method: "GET",
            }
          );
        } else {
          const urlParams = new URLSearchParams();
          Object.entries(rest).forEach(([key, value]) => {
            if (value !== undefined) {
              urlParams.set(key, value.toString());
            }
          });
          response = await fetch(
            `https://dummyjson.com/products?${urlParams.toString()}`,
            {
              method: "GET",
            }
          );
        }

        result = await response.json();

        if (!result.products) {
          throw new Error("No results returned from API");
        }

        const content: McpTextContent = {
          type: "text",
          text: `Products Results:\n\n${JSON.stringify(
            result.products,
            null,
            2
          )}`,
        };

        return {
          content: [content],
        };
      } catch (error) {
        console.error(error);
        throw new Error(`Failed to fetch products: ${error.message} ${error}`);
      }
    }
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
