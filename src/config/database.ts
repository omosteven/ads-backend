import config from "./config";

import mongoose from "mongoose";

const connectDB = async () => {
  const dbURI = config("dbURL");

  try {
    await mongoose.connect(dbURI);

    console.log("Database is connected");
  } catch (err) {
    console.log(err);
  }
};

export default connectDB;
