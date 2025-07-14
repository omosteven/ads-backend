import { Router } from "express";

import multer from "multer";
import auth from "../middleware/auth.middleware";
import AdminController from "../controllers/admin.controller";
import ProductController from "../controllers/product.controller";
import MiscController from "../controllers/misc.controller";

const { register, login, getProfile, updateProfile, deleteAccount } =
  AdminController;

const {
  getAll,
  fetchProducts,
  fetchShopifyProducts,
  contactUs,
  joinAsCompany,
  fetchAllDiscounts,
} = ProductController;
const { uploadFile } = MiscController;

const router = Router();

const formData = multer({ dest: "temp_uploads/" });

router.post("/auth/register", register);

router.post("/auth/login", login);

router.post("/joinus", contactUs);

router.post("/join-as-company", joinAsCompany);

router.get("/user", auth, getProfile);

router.patch("/user", auth, updateProfile);

router.delete("/user", auth, deleteAccount);

router.get("/products", fetchProducts);

router.get("/shopify-products", fetchShopifyProducts);

router.get("/discounts", fetchAllDiscounts);

router.post("/upload", formData.single("file"), uploadFile);

export default router;
