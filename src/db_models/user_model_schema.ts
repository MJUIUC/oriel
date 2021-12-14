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
      }
    }, { timestamps: true })
);

export default UserModel;
