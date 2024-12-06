import AmazonService from "../services/amazon.service";
import { IProduct } from "../types/index";

import { NextFunction, Request, Response } from "express";
import axios from "axios";
// import { GraphQLClient } from "graphql-request";

import dotenv from "dotenv";

dotenv.config();

/**
  @param {Request} req
  @param {Response}  res
  @returns
**/

const amazonService = new AmazonService();

export interface Filters {
  SearchIndex?: string;
  MinPrice?: number;
  MaxPrice?: number;
  [key: string]: string | number | undefined;
}

// curl -X GET "https://productsappstore.myshopify.com/admin/api/2024-01/products.json?ids=632910392%2C921728736" -H "X-Shopify-Access-Token: shpua_322b3e75d19ca68b0ffafa5c87533bff"

const shopifyStores = [
  {
    url: "https://productsappstore.myshopify.com/admin/api/2024-01/products.json",
    token: "shpua_322b3e75d19ca68b0ffafa5c87533bff",
  },
  // {
  //   url: process.env.SHOPIFY_API_URL_2!,
  //   token: process.env.SHOPIFY_API_TOKEN_2!,
  // },
];

class ProductController {
  static async getAll(req: Request, res: Response, next: NextFunction) {}

  static async fetchProducts(req: Request, res: Response, next: NextFunction) {
    const { keyword, category, minPrice, maxPrice } = req.query;

    const filters: Filters = {};
    if (category) filters.SearchIndex = String(category);
    if (minPrice) filters.MinPrice = parseInt(String(minPrice), 10) * 100; // Prices are in cents
    if (maxPrice) filters.MaxPrice = parseInt(String(maxPrice), 10) * 100; // Prices are in cents

    try {
      const products = await amazonService.searchProducts(
        String(keyword),
        filters
      );
      return res.status(200).json({
        message: "Products Retrieved",
        data: products,
      });
    } catch (error) {
      return res.status(500).json({
        code: 500,
        message: "Failed to fetch product list",
      });
    }
  }

  static async fetchShopifyProducts(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { keyword } = req.query || {};

    try {
      console.log({ keyword });
      const results = await Promise.all(
        shopifyStores.map(async (store) => {
          const response = await axios.get(
            store.url,
            // { query: productQuery, variables: { keyword } },
            {
              headers: {
                "X-Shopify-Access-Token": store.token,
                "Content-Type": "application/json",
              },
              params: {},
            }
          );

          const data = response.data;
          if (data.errors) {
            throw new Error(
              `GraphQL errors: ${data.errors
                .map((err: any) => err.message)
                .join(", ")}`
            );
          }
          return data?.products;
        })
      );

      const combinedResults = results.flat();
      return res.status(200).json(combinedResults);
    } catch (error: any) {
      return res
        .status(500)
        .json({ error: "Failed to fetch products.", details: error?.message });
    }
  }
}

export default ProductController;
