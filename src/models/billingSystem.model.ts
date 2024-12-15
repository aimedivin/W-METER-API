import { model, Model, Schema, Types } from 'mongoose';

interface IBillingSystem {
  volume: number;
  totalAmount: number;
  _id?: Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
type BillingSystemModelType = Model<IBillingSystem>;

const billingSystemSchema = new Schema<IBillingSystem, BillingSystemModelType>(
  {
    volume: {
      type: Number,
      unique: true,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const BillingSystem = model<IBillingSystem, BillingSystemModelType>(
  'BillingSystem',
  billingSystemSchema,
);

export default BillingSystem;
