import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    match: /.+\@.+\..+/,
  },

  phoneNumber: {
    type: String,
    required: false,
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  totalOrders: {
    type: Number,
    default: 0,
  },
});

const UserModel = mongoose.model("Users", UserSchema);

export default UserModel;
