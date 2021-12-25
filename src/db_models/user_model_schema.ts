import * as mongoose from "mongoose";
import { DeviceConfigurationModelInterface } from "./device_configuration_model_schema";
const Schema = mongoose.Schema;

export interface UserModelInterface {
  email_address: string,
  wallet_address: string, /* This may become an array at some point */
  owned_device_configurations: Array<string>,
  save: any,
  _id: any,
}

const UserModel = mongoose.model<UserModelInterface>(
    "UserModel",
    new Schema<UserModelInterface>({
      email_address: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        unique: true,
        trim: true,
        lowercase: true,
      },
      wallet_address: {
        type: String /* This may become an array at some point */
      }, 
      owned_device_configurations: {
        type: Array()
      },
    }, { timestamps: true })
);

export default UserModel;
