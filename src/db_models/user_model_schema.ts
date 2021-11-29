import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserModel = mongoose.model(
    "UserModel",
    new Schema({
      email_address: {
        type: String,
        default: null,
      },
      device_configurations: {
        type: Array,
        default: null,
      }
    }, { timestamps: true })
);

export default UserModel;
