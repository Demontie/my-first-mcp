import { z } from "zod";
import {
  McpResponse,
  McpTextContent,
  ProductParams,
  ProductsResponse,
} from "../types";

export const getProductsTool = {
  name: "get_products",
  description: "Get a list of products with optional filtering and pagination.",
  parameters: {
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
  handler: async (params: ProductParams): Promise<McpResponse> => {
    try {
      const { q, ...rest } = params;
      let result: ProductsResponse;
      let response;
      if (q) {
        response = await fetch(`https://dummyjson.com/products/search?q=${q}`, {
          method: "GET",
        });
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
  },
};
