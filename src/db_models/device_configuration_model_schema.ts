import * as mongoose from "mongoose";
import { DigitalAssetModelReferenceInterface } from "./digital_asset_model_schema";
const Schema = mongoose.Schema;

export interface DisplayHardwareDetailsInterface {
  storage_space_mbs: number,
  screen_height: number,
  screen_width: number,
  aspect_ratio: number,
  static_image_format?: string
}

export interface DeviceConfigurationModelInterface {
  device_name: string,
  device_owner_wallet_address: string,
  display_hardware_details: DisplayHardwareDetailsInterface,
  displayable_assets: {
    latest_asset_modify_timestamp: number,
    asset_list: [DigitalAssetModelReferenceInterface],
  },
  save: any
}

const DeviceConfigurationModel = mongoose.model<DeviceConfigurationModelInterface>(
    "DeviceConfigurationModel",
    new Schema<DeviceConfigurationModelInterface>({
        device_name: String,
        device_owner_wallet_address: String,
        display_hardware_details: {
            storage_space_mbs: Number,
            screen_height: Number,
            screen_width: Number,
            aspect_ratio: Number,
            static_image_format: {
                type: String,
                default: "jpeg"
            }
        },
        displayable_assets: {
            latest_asset_modify_timestamp: Number,
            asset_list: Array(),
        },
    }, { timestamps: true })
);

export default DeviceConfigurationModel;
