import DeviceConfigurationModel from "./device_configuration_model_schema";
import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserModel = mongoose.model(
    "UserModel",
    new Schema({
      email_address: {
        type: String,
        default: null,
      },
      device_configurations: Array(DeviceConfigurationModel)
    }, { timestamps: true })
);

export default UserModel;
