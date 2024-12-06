import mongoose, { Schema } from "mongoose";

const OrderSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
    unique: false,
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

  productId: {
    type: Schema.Types.ObjectId,
    ref: "Products",
  },

  noOfItems: {
    type: Number,
    default: 0,
  },

  deliveryAddress: {
    type: String,
    default: "",
  },
  deliveryDate: {
    type: Date,
    default: "",
  },
  state: {
    type: String,
    default: "",
  },
  whatsappNo: {
    type: String,
    default: "",
  },
});

// Order model interface
interface IOrder extends Document {
  email?: string;
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
  productId: mongoose.Types.ObjectId;
  noOfItems: number;
  deliveryAddress?: string;
  state:string
}

const OrderModel = mongoose.model("Orderss", OrderSchema);

export default OrderModel;
