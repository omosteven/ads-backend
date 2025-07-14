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

  static getFormattedDate = (date?: string) => {
    let monthList = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];

    let dateTime = date ? new Date(date) : new Date();

    let fullYear = dateTime.getFullYear();
    let month = dateTime.getMonth();
    let day = dateTime.getDate();
    let dayString = String(day);
    if (day < 10 && day > 0) {
      dayString = `0${day}`;
    }

    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();

    return `${dayString} ${monthList[month]} ${fullYear} ${hour}:${minute}`;
  };

  static genRandomCode = (): string => {
    function randomString(length: number): string {
      let result = "";
      let characters = "";

      const startCharCode: number = "a".charCodeAt(0);
      const endCharCode: number = "z".charCodeAt(0);

      for (let i = startCharCode; i <= endCharCode; i++) {
        characters += String.fromCharCode(i);
      }

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    }

    return `${randomString(2)}-${randomString(3)}-${Math.floor(
      Date.now() / 1000
    )}`;
  };

  static genDiscountCode = (): string => {
    function randomString(length: number): string {
      let result = "";
      let characters = "";

      const startCharCode: number = "a".charCodeAt(0);
      const endCharCode: number = "z".charCodeAt(0);

      for (let i = startCharCode; i <= endCharCode; i++) {
        characters += String.fromCharCode(i);
      }

      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    }

    return `${randomString(3)?.toUpperCase?.()}${randomString(
      3
    )?.toUpperCase?.()}`;

    // ?.toUpperCase?.()}${Math.floor(Date.now() / 1000)
    //   .toString()
    //   .split("", 2)
  };
}

export default Helpers;
