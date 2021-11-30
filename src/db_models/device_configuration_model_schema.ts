import DigitalAssetModel from "./digital_asset_model_schema"
import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const DeviceConfigurationModel = mongoose.model(
    "DeviceConfigurationModel",
    new Schema({
        device_name: String,
        device_owner_wallet_address: String,
        display_hardware_details: {
            storage_space_mbs: Number,
            screen_height: Number,
            screen_width: Number,
            aspect_ratio: Number,

        },
        displayable_assets: {
            lastest_device_sync_timestamp: Number,
            asset_list: Array(DigitalAssetModel),
        },
    }, { timestamps: true })
);

export default DeviceConfigurationModel;
