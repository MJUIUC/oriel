import DeviceConfigurationModel from "./device_configuration_model_schema";
import DigitalAssetModel from "./digital_asset_model_schema";
import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

// interface UserModel {
//   email_address: string,
//   wallet_address: string, /* This may become an array at some point */
//   owned_device_configurations: array<typeof DeviceConfigurationModel>,
//   owned_digital_assets: array<typeof DigitalAssetModel>
// }

const UserModel = mongoose.model(
    "UserModel",
    new Schema({
      email_address: String,
      wallet_address: String, /* This may become an array at some point */
      owned_device_configurations: Array(),
      owned_digital_assets: Array()
    }, { timestamps: true })
);

export default UserModel;
