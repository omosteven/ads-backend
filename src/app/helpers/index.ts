import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

import dotenv from "dotenv";
import fs from "fs";

import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
// import { MemoryStorageOptions } from "multer";

import config from "../../config/config";

dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Cloudinary configuration
cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
  // api_key: process.env.CLOUDINARY_API_KEY || "",
  // api_secret: process.env.CLOUDINARY_API_SECRET || "",
  cloud_name: "dtdla1h52",
  api_key: "168332195773649",
  api_secret: "wnJhB0GuqzD08JVX20TXthG2ikc",
});

class Helpers {
  static async generateToken(email: string) {
    const jwtKey = config("jwt_key");

    const jwtExpirySeconds = 604800;
    // For a week

    const token = jwt.sign(
      {
        email,
      },
      jwtKey,
      {
        algorithm: "HS256",

        expiresIn: jwtExpirySeconds,
      }
    );

    return token;
  }

  static hashPassword(password: string) {
    let hashedPassword = bcrypt.hashSync(password, 10);

    return hashedPassword;
  }

  static async comparePasswords(password1: string, password2: string) {
    return await bcrypt.compare(password1, password2);
  }

  static uploadToCloudinary(file: any, fileName: string, fileType: any) {
    return new Promise((resolve, reject) => {
      cloudinary.config({
        cloud_name: "dapfixxti",
        api_key: "825786214664966",
        api_secret: "C_zbaZJX6zDcSQDrZ5fi9myy69Y",
      });

      cloudinary.uploader.upload(
        file,
        {
          resource_type: fileType,

          public_id: fileName,

          overwrite: true,

          folder: "website-media",
        },
        (error: any, result: any) => {
          if (error) {
            fs.unlinkSync("./temp_uploads/" + fileName);
            // Used resolve instead of reject in order to prevent async on the call
            resolve({
              status: false,
            });
          } else {
            fs.unlinkSync("./temp_uploads/" + fileName);
            resolve({
              status: true,
              data: {
                url: result?.secure_url,
                type: result?.resource_type,
                path: result?.public_id,
              },
            });
          }
        }
      );
    });
  }
}

export default Helpers;
