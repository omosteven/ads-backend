import express, { Request, Response } from "express";

import dotenv from "dotenv";

import bodyParser from "body-parser";

import cors from "cors";

import AppRoutes from "./app/routes";

import crypto from "crypto";

import cookieParser from "cookie-parser";
import querystring from "querystring";
import request from "request-promise";

// import connectDB from "./config/database";

const app = express();

dotenv.config();

// connectDB();

// const requiredEnvVars = ["SHOPIFY_API_KEY", "SHOPIFY_API_SECRET", "PORT"];
// requiredEnvVars.forEach((envVar) => {
//   if (!process.env[envVar]) {
//     throw new Error(`Missing required environment variable: ${envVar}`);
//   }
// });

const allowedOrigins = ["http://localhost:3000", "http://example.com"];

// const corsOptions = {
//   origin: (
//     origin: string | undefined,
//     callback: (err: Error | null, allow?: boolean) => void
//   ) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   optionsSuccessStatus: 200,
// };

const corsOptions = {
  origin: true, // Allow all origins
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// app.use(fileUpload());

app.use("/api/v1", AppRoutes);

const scopes = "write_products";
const forwardingAddress = "https://2951-176-201-106-81.ngrok-free.app"; // our ngrok url

// const { SHOPIFY_API_KEY, SHOPIFY_API_SECRET } = process.env;
const SHOPIFY_API_KEY = "ce6b00d2985f455cb4557950b413eebd";
const SHOPIFY_API_SECRET = "b17a4386e97aad3a91864bf16010f403";

app.get("/shopify", (req: any, res: any) => {
  const shopName = req.query.shop;
  if (shopName) {
    // use nonce to set a parameter called state
    // the nonce is random string that would be set
    // it would be received on the request
    // the callback from shopify would echo the state
    // the two states would be compared
    // if they match, we are sure the request came from shopify
    // if they don't match, they request is being spoofed
    // this would throw an error
    let nonce = crypto.randomBytes(16).toString("base64");
    const shopState = nonce;
    // shopify callback redirect
    const redirectURL = forwardingAddress + "/shopify/callback";

    // install url for app install
    const installUrl =
      "https://" +
      shopName +
      "/admin/oauth/authorize?client_id=" +
      SHOPIFY_API_KEY +
      "&scope=" +
      scopes +
      "&state=" +
      shopState +
      "&redirect_uri=" +
      redirectURL;

    // in a production app, the cookie should be encrypted
    // but, for the purpose of this application, we won't do that
    res.cookie("state", shopState);
    console.log({installUrl})
    // redirect the user to the installUrl
    res.redirect(installUrl);
  } else {
    return res.status(400).send('Missing "Shop Name" parameter!!');
  }
});

app.get("/shopify/callback", async (req: Request, res: Response) => {
  const { shop, hmac, code, state } = req.query||{} as { [key: string]: string };
  const stateCookie = req?.cookies?.state;

  if (state !== stateCookie) {
    // return res.status(400).send("Invalid request origin");
  }

  if (!shop || !hmac || !code) {
    return res.status(400).send("Required parameters missing");
  }

  // Validate HMAC
  const message = querystring.stringify({
    ...req.query,
    hmac: undefined,
    signature: undefined,
  });
  const generatedHash = crypto
    .createHmac("sha256", SHOPIFY_API_SECRET!)
    .update(message)
    .digest("hex");

  if (generatedHash !== hmac) {
    // return res.status(400).send("HMAC validation failed");
  }

  try {
    // Get access token
    const accessTokenRequestUrl = `https://${shop}/admin/oauth/access_token`;
    const accessTokenPayload = {
      client_id: SHOPIFY_API_KEY,
      client_secret: SHOPIFY_API_SECRET,
      code,
    };

    const { access_token: accessToken } = await request.post({
      url: accessTokenRequestUrl,
      json: accessTokenPayload,
    });

    // Fetch shop details
    const shopRequestUrl = `https://${shop}/admin/shop.json`;
    const shopResponse = await request.get({
      url: shopRequestUrl,
      headers: { "X-Shopify-Access-Token": accessToken },
      json: true,
    });

    console.log({accessToken})

    res.json(shopResponse);
  } catch (error: any) {
    console.error("Error during Shopify OAuth flow:", error.message);
    res.status(500).send("An error occurred during the Shopify OAuth process");
  }
});

// https://2951-176-201-106-81.ngrok-free.app/shopify/callback?code=17122f534bb646cd7431baee8651e3e6&hmac=f6faade376ccf8f4a454c05b0d0cfd8f4bbe309a04bc21559f45ceaac7b7e1c4&host=YWRtaW4uc2hvcGlmeS5jb20vc3RvcmUvcHJvZHVjdHNhcHBzdG9yZQ&shop=productsappstore.myshopify.com&state=wqFIngdJr9cIwUQISSvDWQ%3D%3D&timestamp=1733057300
app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Forklife Backend!");
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
