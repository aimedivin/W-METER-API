import { model, Model, Schema, Types } from 'mongoose';

interface INotification {
  message: string;
  type: string;
  isRead: boolean;
  user: Types.ObjectId;
  _id?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
type NotificationModelType = Model<INotification>;

const notificationSchema = new Schema<INotification, NotificationModelType>(
  {
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

const Notification = model<INotification, NotificationModelType>(
  'Notification',
  notificationSchema,
);

export default Notification;
