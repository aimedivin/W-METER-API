import { model, Model, Schema, Types } from 'mongoose';

enum MicroControllerStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

interface IMicroController {
  _id?: Types.ObjectId;
  model: string;
  serialNumber: string;
  manufacturer: string;
  status: {
    status: MicroControllerStatus;
    reason?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
type MicroControllerModelType = Model<IMicroController>;

const microControllerSchema = new Schema<
  IMicroController,
  MicroControllerModelType
>(
  {
    model: {
      type: String,
      required: true,
    },
    serialNumber: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    status: new Schema<
      IMicroController['status'],
      Model<IMicroController['status']>
    >({
      status: {
        type: String,
        required: true,
        enum: {
          values: Object.values(MicroControllerStatus),
          message: '{VALUE} is not supported',
        },
      },
      reason: String,
    }),
  },
  { timestamps: true },
);

const MicroController = model<IMicroController, MicroControllerModelType>(
  'MicroController',
  microControllerSchema,
);

export default MicroController;
