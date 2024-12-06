import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  media: {
    type: Object,
    required: false,

    default: {
      url: "",
      type: "",
    },
  },

  productName: {
    type: String,
    required: true,
  },

  pricing: {
    type: String,
    required: true,
  },

  noOfUnits: {
    type: Number,
    required: true,
    default: 0,
  },

  location: {
    type: String,
    default: "",
  },
});

const ProductModel = mongoose.model("Products", ProductSchema);

export default ProductModel;
