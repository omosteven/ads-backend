
import { Request, Response, NextFunction } from "express";

import Helpers from "../helpers";

/**
  @param {Request} req
  @param {Response}  res
  @returns
**/

const { uploadToCloudinary } = Helpers;

class MiscController {
  static async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      const image = req.file;
      let uploadImage: any = null;

      // --- Validate Size and FIle type---
      if (!image?.mimetype.includes("image/")) {
        return res.status(400).json({
          message: "Only image is allowed.",
        });
      }

      // --- Must not exceed 2.5mb in size
      if (image?.size / (1000 * 1000) > 5) {
        return res.status(400).json({
          message: "Image is too large.",
        });
      }

      uploadImage = await uploadToCloudinary(
        image.path,
        image.filename,
        "image"
      );

      if (uploadImage.status) {
        return res.status(200).json({
          message: "File uploaded successfully",
          data: uploadImage?.data,
        });
      } else {
        return res.status(400).json({
          message: "File failed to upload.",
        });
      }
    } catch (error) {
      console.log(error);
      // console.error("Error uploading file:", error);
      next(error); // Pass error to global error handler
    }
  }
}

export default MiscController;
