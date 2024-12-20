import { model, Model, Schema, Types } from 'mongoose';

interface IProfile {
  _id?: Types.ObjectId;
  fullName: string;
  firstName: string;
  lastName: string;
  photo: string;
  dob: Date;
  address?: {
    streetNumber: string;
    province: string;
    district: string;
    sector: string;
    village: string;
  };
  user: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
type ProfileModelType = Model<IProfile>;

const profileSchema = new Schema<IProfile, ProfileModelType>(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    photo: String,
    dob: {
      type: Date,
      required: true,
    },
    address: new Schema<IProfile['address'], Model<IProfile['address']>>({
      streetNumber: String,
      province: String,
      district: String,
      sector: String,
      village: String,
    }),
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
  },
  { timestamps: true },
);

profileSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

const Profile = model<IProfile, ProfileModelType>('Profile', profileSchema);

export default Profile;
