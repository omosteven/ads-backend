import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: true,
    match: /.+\@.+\..+/,
  },

  firstName: {
    type: String,
  },

  lastName: {
    type: String,
  },

  token: {
    type: String,
    required: false,
  },

  password: {
    type: String,
    minLength: 8,
    required: true,
  },
});
 
const AdminModel = mongoose.model("Admins", AdminSchema);

export default AdminModel;
