export interface IUser {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface IUserAuth {
  email: string;
  password: string;
}

export interface IUserUpdate {
  firstName: string;
  lastName: string;
}

export interface IProduct {
  productName?: string;
  pricing?: string;
  noOfUnits: number;
  location?: string;
  media?: any;
}

export interface IOrder {
  productId: string;
  email?: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  noOfItems?: number;
  deliveryAddress: string;
  deliveryDate: Date;
  whatsappNo?: string;
  state?: string;
}
