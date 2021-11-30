import DeviceConfigurationModel from "./device_configuration_model_schema";
import DigitalAssetModel from "./digital_asset_model_schema";
import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const UserModel = mongoose.model(
    "UserModel",
    new Schema({
      email_address: String,
      wallet_address: String,
      owned_device_configurations: Array(DeviceConfigurationModel),
      owned_digital_assets: Array(DigitalAssetModel)
    }, { timestamps: true })
);

export default UserModel;
