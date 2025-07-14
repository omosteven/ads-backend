import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema({
  orgEmail: {
    type: String,
    required: false,
    unique: true,
    match: /.+\@.+\..+/,
  },

  orgName: {
    type: String,
  },

  orgAddress: {
    type: String,
  },

  contactNumber: {
    type: String,
  },

  contactName: {
    type: String,
    required: false,
  },
});

const CompanyModel = mongoose.model("Companies", CompanySchema);

export default CompanyModel;
