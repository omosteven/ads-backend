import axios, { AxiosResponse } from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

interface Filters {
  SearchIndex?: string;
  MinPrice?: number;
  MaxPrice?: number;
  [key: string]: string | number | undefined;
}

interface AmazonAPIResponse {
  [key: string]: any;
}

class AmazonService {
  private endpoint: string;
  private region: string;
  private accessKey: string;
  private secretKey: string;
  private partnerTag: string;

  constructor() {
    this.endpoint = process.env.PA_API_ENDPOINT || "";
    this.region = process.env.PA_API_REGION || "";
    this.accessKey =
      process.env.AWS_ACCESS_KEY_ID ||
      "AKIAIJUHVTBVRZQOQB7Q";
    this.secretKey = process.env.AWS_SECRET_ACCESS_KEY || "cOsGuT+ftgr1NVRM+Nk/O4/8vxJymBHx4/bEtE3u";
    this.partnerTag = "biz29-21"; // Replace with your Amazon Affiliate Tag

    if (!this.endpoint || !this.region || !this.accessKey || !this.secretKey) {
      throw new Error("Missing required environment variables for Amazon API");
    } else {
      console.log("all fields present");
    }
  }

  /**
   * Generate a signature for the request
   * @param stringToSign - The string to sign
   * @returns - The signature
   */

  private createSignature(stringToSign: string): string {
    return crypto
      .createHmac("sha256", this.secretKey)
      .update(stringToSign, "utf8")
      .digest("base64");
  }

  /**
   * Generate a signed request URL
   * @param params - Query parameters
   * @param operationUri - API operation URI
   * @returns - Signed request URL
   */
  private generateSignedRequest(
    params: Record<string, string | number>,
    operationUri: string
  ): string {
    const method = "GET";
    const host = this.endpoint;

    // Add mandatory parameters
    params = {
      ...params,
      PartnerTag: this.partnerTag,
      PartnerType: "Associates",
      Marketplace: "www.amazon.com",
    };

    // Sort parameters by key
    const sortedParams = Object.keys(params)
      .sort()
      .reduce<Record<string, string | number>>((obj, key) => {
        obj[key] = params[key];
        return obj;
      }, {});

    const queryString = Object.entries(sortedParams)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
      )
      .join("&");

    const stringToSign = [method, host, operationUri, queryString].join("\n");
    const signature = this.createSignature(stringToSign);

    return `https://${host}${operationUri}?${queryString}&Signature=${encodeURIComponent(
      signature
    )}`;
  }

  /**
   * Fetch product details by ASIN
   * @param asin - Amazon Standard Identification Number
   * @returns - Product details
   */
  async fetchProductByASIN(asin: string): Promise<AmazonAPIResponse> {
    const params = {
      ItemIds: asin,
      Resources: [
        "Images.Primary.Medium",
        "ItemInfo.Title",
        "Offers.Listings.Price",
      ].join(","),
    };

    const signedUrl = this.generateSignedRequest(params, "/paapi5/getitems");

    try {
      const response: AxiosResponse = await axios.get(signedUrl);
      return response.data;
    } catch (error) {
      console.error("Error fetching product details:", error);
      throw error;
    }
  }

  /**
   * Search for products using a keyword and optional filters
   * @param keyword - Search keyword
   * @param filters - Optional filters (e.g., category, price range)
   * @returns - Search results
   */
  async searchProducts(
    keyword: string,
    filters: Filters = {}
  ): Promise<AmazonAPIResponse> {
    // const params = {
    //   Keywords: keyword,
    //   SearchIndex: "All",
    //   Resources: [
    //     "Images.Primary.Medium",
    //     "ItemInfo.Title",
    //     "Offers.Listings.Price",
    //   ].join(","),
    //   ...filters,
    // };
    const params = {
      Keywords: "laptop",
      Marketplace: "www.amazon.com",
      MaxPrice: 150000,
      MinPrice: 50000,
      PartnerTag: "biz29-21",
      PartnerType: "Associates",
      SearchIndex: "Electronics",
      Resources: [
        "Images.Primary.Medium",
        "ItemInfo.Title",
        "Offers.Listings.Price",
      ].join(","),
    };

    const signedUrl = this.generateSignedRequest(params, "/paapi5/searchitems");
    console.log({ signedUrl });
    try {
      const response: AxiosResponse = await axios.post(signedUrl);
      return response.data;
    } catch (error) {
      console.error("Error searching for products:", error);
      throw error;
    }
  }
}

export default AmazonService;
