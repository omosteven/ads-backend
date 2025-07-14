import mongoose, { Schema } from "mongoose";

const DiscountSchema = new mongoose.Schema({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: "Companies",
  },

  percentage: {
    type: Number,
  },

  realValue: {
    type: String,
  },

  minOrderPrice: {
    type: Number,
  },

  currency: {
    type: String,
    default: "NGN",
  },

  discountCode: {
    type: String,
    required: true,
  },

  noOfUsage: {
    type: Number,
    default: 0,
  },

  validFrom: {
    type: Date,
    default: new Date(),
  },

  expiry: {
    type: Date,
    default: "",
  },
});

const DiscountModel = mongoose.model("Discounts", DiscountSchema);

export default DiscountModel;
